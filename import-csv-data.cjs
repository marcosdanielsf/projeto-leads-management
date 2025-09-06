const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Função para ler variáveis do .env
function loadEnvVars() {
  const envPath = path.join(__dirname, '.env');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      envVars[key.trim()] = value.trim().replace(/["']/g, '');
    }
  });
  
  return envVars;
}

// Função para parsear CSV
function parseCSV(csvContent) {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim().replace(/["']/g, ''));
  
  console.log('Cabeçalhos encontrados:', headers);
  
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/["']/g, ''));
    const row = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index] || null;
    });
    
    data.push(row);
  }
  
  return data;
}

// Função para converter data
function convertDate(dateStr) {
  if (!dateStr || dateStr === 'null' || dateStr === '') return null;
  
  try {
    // Tentar diferentes formatos de data
    const formats = [
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // DD/MM/YYYY ou MM/DD/YYYY
      /^(\d{4})-(\d{1,2})-(\d{1,2})$/, // YYYY-MM-DD
      /^(\d{1,2})-(\d{1,2})-(\d{4})$/, // DD-MM-YYYY
    ];
    
    for (const format of formats) {
      const match = dateStr.match(format);
      if (match) {
        const [, part1, part2, part3] = match;
        
        // Assumir formato DD/MM/YYYY para datas brasileiras
        if (format === formats[0]) {
          const day = parseInt(part1);
          const month = parseInt(part2);
          const year = parseInt(part3);
          
          if (day <= 12 && month > 12) {
            // Formato MM/DD/YYYY
            return new Date(year, part1 - 1, part2).toISOString();
          } else {
            // Formato DD/MM/YYYY
            return new Date(year, part2 - 1, part1).toISOString();
          }
        }
        
        if (format === formats[1]) {
          // YYYY-MM-DD
          return new Date(part1, part2 - 1, part3).toISOString();
        }
        
        if (format === formats[2]) {
          // DD-MM-YYYY
          return new Date(part3, part2 - 1, part1).toISOString();
        }
      }
    }
    
    // Tentar Date.parse como último recurso
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
    
    return null;
  } catch (error) {
    console.warn(`Erro ao converter data: ${dateStr}`, error.message);
    return null;
  }
}

// Função para mapear dados do CSV para a estrutura da tabela
function mapCSVToTable(csvRow) {
  return {
    lead_id: csvRow['lead_id'] || null,
    nome: csvRow['contato_principal (obrigatório)'] || null,
    telefone: csvRow['telefone_comercial'] || null,
    email: csvRow['email_comercial'] || null,
    origem: csvRow['fonte_lead'] || null,
    status: csvRow['etapa_funil (obrigatório)'] || csvRow['estado_contato'] || null,
    observacoes: csvRow['respostas_ia'] || csvRow['tipo_agendamento'] || null,
    data_entrada_agendamento: convertDate(csvRow['data_entrada_agendamento']),
    data_hora_agendamento_bposs: convertDate(csvRow['data_hora_agendamento_bposs'])
  };
}

async function importCSVData() {
  try {
    console.log('🚀 Iniciando importação dos dados do CSV...');
    
    // Carregar variáveis de ambiente
    const env = loadEnvVars();
    
    // Criar cliente Supabase
    const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
    
    // Verificar se a tabela existe
    console.log('📋 Verificando se a tabela leads existe...');
    const { data: tableCheck, error: tableError } = await supabase
      .from('leads')
      .select('count', { count: 'exact', head: true });
    
    if (tableError) {
      console.error('❌ Erro ao verificar tabela:', tableError.message);
      console.log('💡 Execute primeiro o script create-leads-table.sql no Supabase Dashboard');
      return;
    }
    
    console.log('✅ Tabela leads encontrada');
    
    // Ler arquivo CSV
     const csvPath = path.join(__dirname, 'public', 'leads_filtrado_revisado.csv');
    
    if (!fs.existsSync(csvPath)) {
      console.error('❌ Arquivo CSV não encontrado:', csvPath);
      return;
    }
    
    console.log('📄 Lendo arquivo CSV revisado:', csvPath);
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    
    // Parsear CSV
    const csvData = parseCSV(csvContent);
    console.log(`📊 Total de registros no CSV: ${csvData.length}`);
    
    if (csvData.length === 0) {
      console.log('⚠️ Nenhum dado encontrado no CSV');
      return;
    }
    
    // Mostrar exemplo dos primeiros registros
    console.log('\n📋 Exemplo dos primeiros 3 registros:');
    csvData.slice(0, 3).forEach((row, index) => {
      console.log(`Registro ${index + 1}:`, JSON.stringify(mapCSVToTable(row), null, 2));
    });
    
    // Mapear dados
    const mappedData = csvData.map(mapCSVToTable).filter(row => {
      // Filtrar registros que tenham pelo menos um campo preenchido
      return row.nome || row.telefone || row.email || row.lead_id;
    });
    
    console.log(`\n🔄 Registros válidos para inserção: ${mappedData.length}`);
    
    if (mappedData.length === 0) {
      console.log('⚠️ Nenhum registro válido encontrado para inserção');
      return;
    }
    
    // Inserir dados em lotes
    const batchSize = 100;
    let totalInserted = 0;
    let totalErrors = 0;
    
    for (let i = 0; i < mappedData.length; i += batchSize) {
      const batch = mappedData.slice(i, i + batchSize);
      
      console.log(`\n📦 Inserindo lote ${Math.floor(i / batchSize) + 1}/${Math.ceil(mappedData.length / batchSize)} (${batch.length} registros)...`);
      
      try {
        const { data, error } = await supabase
          .from('leads')
          .insert(batch)
          .select('id');
        
        if (error) {
           console.error(`❌ Erro no lote ${Math.floor(i / batchSize) + 1}:`, error.message || error.details || JSON.stringify(error));
           console.error('Detalhes do erro:', error);
           totalErrors += batch.length;
         } else {
           const inserted = data ? data.length : batch.length;
           totalInserted += inserted;
           console.log(`✅ Lote ${Math.floor(i / batchSize) + 1} inserido com sucesso: ${inserted} registros`);
         }
      } catch (err) {
        console.error(`❌ Erro inesperado no lote ${Math.floor(i / batchSize) + 1}:`, err.message);
        totalErrors += batch.length;
      }
      
      // Pequena pausa entre lotes
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Verificar total de registros na tabela
    const { count } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });
    
    console.log('\n📊 Resumo da importação:');
    console.log(`✅ Total de registros inseridos: ${totalInserted}`);
    console.log(`❌ Total de erros: ${totalErrors}`);
    console.log(`📋 Total de registros na tabela: ${count}`);
    
    if (totalInserted > 0) {
      console.log('\n🎉 Importação concluída com sucesso!');
      console.log('💡 Você pode agora acessar o dashboard para visualizar os dados');
    } else {
      console.log('\n⚠️ Nenhum registro foi inserido. Verifique o formato do CSV e tente novamente.');
    }
    
  } catch (error) {
    console.error('❌ Erro durante a importação:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Executar importação
importCSVData();