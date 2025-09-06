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
  
  console.log('📋 Cabeçalhos encontrados:', headers);
  
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

async function importFinal() {
  try {
    console.log('🚀 Iniciando importação final dos dados...');
    
    // Carregar variáveis de ambiente
    const env = loadEnvVars();
    
    // Criar cliente Supabase com service_role key se disponível
    let supabase;
    if (env.SUPABASE_SERVICE_ROLE_KEY) {
      console.log('🔑 Usando service role key para bypass do RLS');
      supabase = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
    } else {
      console.log('🔑 Usando anon key');
      supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
    }
    
    // Verificar se a tabela existe
    console.log('📋 Verificando tabela leads...');
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
    
    console.log('📄 Lendo arquivo CSV:', csvPath);
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    
    // Parsear CSV
    const csvData = parseCSV(csvContent);
    console.log(`📊 Total de registros no CSV: ${csvData.length}`);
    
    if (csvData.length === 0) {
      console.log('⚠️ Nenhum dado encontrado no CSV');
      return;
    }
    
    // Mapear e filtrar dados válidos
    const mappedData = csvData.map(mapCSVToTable).filter(row => {
      return row.nome || row.telefone || row.email || row.lead_id;
    });
    
    console.log(`🔄 Registros válidos para inserção: ${mappedData.length}`);
    
    if (mappedData.length === 0) {
      console.log('⚠️ Nenhum registro válido encontrado');
      return;
    }
    
    // Mostrar alguns exemplos
    console.log('\n📋 Exemplos de registros:');
    mappedData.slice(0, 3).forEach((record, index) => {
      console.log(`Registro ${index + 1}:`, JSON.stringify(record, null, 2));
    });
    
    // Inserir dados em lotes menores
    const batchSize = 50;
    const totalBatches = Math.ceil(mappedData.length / batchSize);
    let totalInserted = 0;
    let totalErrors = 0;
    
    console.log(`\n📦 Iniciando inserção em ${totalBatches} lotes de ${batchSize} registros...`);
    
    for (let i = 0; i < totalBatches; i++) {
      const start = i * batchSize;
      const end = Math.min(start + batchSize, mappedData.length);
      const batch = mappedData.slice(start, end);
      
      console.log(`\n📦 Inserindo lote ${i + 1}/${totalBatches} (${batch.length} registros)...`);
      
      try {
        // Tentar inserção direta primeiro
        const { data, error } = await supabase
          .from('leads')
          .insert(batch)
          .select('id');
        
        if (error) {
          console.error(`❌ Erro no lote ${i + 1}:`, error);
          
          // Se falhar, tentar inserir um por um
          console.log(`🔄 Tentando inserção individual para lote ${i + 1}...`);
          
          for (let j = 0; j < batch.length; j++) {
            try {
              const { data: singleData, error: singleError } = await supabase
                .from('leads')
                .insert([batch[j]])
                .select('id');
              
              if (singleError) {
                console.error(`❌ Erro no registro ${start + j + 1}:`, singleError.message || singleError);
                totalErrors++;
              } else {
                totalInserted++;
              }
            } catch (singleErr) {
              console.error(`❌ Erro inesperado no registro ${start + j + 1}:`, singleErr.message);
              totalErrors++;
            }
          }
        } else {
          console.log(`✅ Lote ${i + 1} inserido com sucesso (${data.length} registros)`);
          totalInserted += data.length;
        }
      } catch (batchErr) {
        console.error(`❌ Erro inesperado no lote ${i + 1}:`, batchErr.message);
        totalErrors += batch.length;
      }
      
      // Pequena pausa entre lotes
      if (i < totalBatches - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Verificar total final
    const { count: finalCount } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });
    
    console.log('\n📊 Resumo final da importação:');
    console.log(`✅ Total de registros inseridos: ${totalInserted}`);
    console.log(`❌ Total de erros: ${totalErrors}`);
    console.log(`📋 Total de registros na tabela: ${finalCount}`);
    
    if (totalInserted > 0) {
      console.log('\n🎉 Importação concluída com sucesso!');
      
      // Mostrar alguns registros inseridos
      const { data: sampleData } = await supabase
        .from('leads')
        .select('*')
        .limit(3);
      
      console.log('\n📋 Exemplos de registros inseridos:');
      sampleData?.forEach((record, index) => {
        console.log(`Registro ${index + 1}:`, JSON.stringify(record, null, 2));
      });
    } else {
      console.log('\n⚠️ Nenhum registro foi inserido. Verifique as configurações do Supabase.');
    }
    
  } catch (error) {
    console.error('❌ Erro durante importação:', error);
  }
}

// Executar importação
importFinal();