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

// Função para parsear CSV simples
function parseCSVSimple(csvContent) {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim().replace(/["']/g, ''));
  
  console.log('Cabeçalhos encontrados:', headers);
  
  const data = [];
  for (let i = 1; i < Math.min(lines.length, 11); i++) { // Apenas primeiros 10 registros para teste
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
  if (!dateStr || dateStr === 'null' || dateStr === '' || dateStr === 'undefined') return null;
  
  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
    return null;
  } catch (error) {
    return null;
  }
}

// Função para mapear dados do CSV para a estrutura da tabela
function mapCSVToTable(csvRow) {
  const mapped = {
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
  
  // Limpar valores vazios
  Object.keys(mapped).forEach(key => {
    if (mapped[key] === '' || mapped[key] === 'undefined') {
      mapped[key] = null;
    }
  });
  
  return mapped;
}

async function importCSVDataSimple() {
  try {
    console.log('🚀 Iniciando importação simples dos dados do CSV...');
    
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
      console.error('❌ Erro ao verificar tabela:', tableError);
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
    
    // Parsear CSV (apenas primeiros 10 registros)
    const csvData = parseCSVSimple(csvContent);
    console.log(`📊 Total de registros para teste: ${csvData.length}`);
    
    if (csvData.length === 0) {
      console.log('⚠️ Nenhum dado encontrado no CSV');
      return;
    }
    
    // Mostrar exemplo dos registros
    console.log('\n📋 Registros para importação:');
    csvData.forEach((row, index) => {
      const mapped = mapCSVToTable(row);
      console.log(`Registro ${index + 1}:`, JSON.stringify(mapped, null, 2));
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
    
    // Inserir um registro por vez para debug
    let totalInserted = 0;
    let totalErrors = 0;
    
    for (let i = 0; i < mappedData.length; i++) {
      const record = mappedData[i];
      
      console.log(`\n📦 Inserindo registro ${i + 1}/${mappedData.length}...`);
      console.log('Dados:', JSON.stringify(record, null, 2));
      
      try {
        const { data, error } = await supabase
          .from('leads')
          .insert([record])
          .select();
        
        if (error) {
          console.error(`❌ Erro no registro ${i + 1}:`, error);
          totalErrors++;
        } else {
          console.log(`✅ Registro ${i + 1} inserido com sucesso:`, data);
          totalInserted++;
        }
      } catch (err) {
        console.error(`❌ Erro inesperado no registro ${i + 1}:`, err);
        totalErrors++;
      }
      
      // Pequena pausa entre inserções
      await new Promise(resolve => setTimeout(resolve, 500));
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
      console.log('\n🎉 Importação de teste concluída com sucesso!');
      console.log('💡 Agora você pode executar a importação completa');
    } else {
      console.log('\n⚠️ Nenhum registro foi inserido. Verificando problemas...');
    }
    
  } catch (error) {
    console.error('❌ Erro durante a importação:', error);
  }
}

// Executar importação
importCSVDataSimple();