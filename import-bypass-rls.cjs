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
      envVars[key.trim()] = value.trim().replace(/[\"']/g, '');
    }
  });
  
  return envVars;
}

// Função para parsear CSV
function parseCSV(csvContent) {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim().replace(/[\"']/g, ''));
  
  console.log('📋 Cabeçalhos encontrados:', headers);
  
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/[\"']/g, ''));
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
    // Tentar diferentes formatos de data
    let date;
    
    // Formato ISO
    if (dateStr.includes('T') || dateStr.includes('Z')) {
      date = new Date(dateStr);
    }
    // Formato brasileiro DD/MM/YYYY
    else if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        date = new Date(parts[2], parts[1] - 1, parts[0]);
      }
    }
    // Formato americano MM/DD/YYYY ou YYYY-MM-DD
    else {
      date = new Date(dateStr);
    }
    
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
    return null;
  } catch (error) {
    return null;
  }
}

// Função para mapear dados do CSV
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

async function importBypassRLS() {
  try {
    console.log('🚀 Iniciando importação com bypass de RLS...');
    
    // Carregar variáveis de ambiente
    const env = loadEnvVars();
    
    // Criar cliente Supabase
    const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
    
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
    
    // Primeiro, vamos tentar criar a tabela sem RLS
    console.log('\n🔧 Recriando tabela sem RLS...');
    
    const dropTableSQL = 'DROP TABLE IF EXISTS public.leads CASCADE;';
    const createTableSQL = `
      CREATE TABLE public.leads (
        id BIGSERIAL PRIMARY KEY,
        lead_id TEXT,
        nome TEXT,
        telefone TEXT,
        email TEXT,
        origem TEXT,
        status TEXT,
        observacoes TEXT,
        data_entrada_agendamento TIMESTAMPTZ,
        data_hora_agendamento_bposs TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    
    // Tentar executar via fetch direto para a API REST
    const supabaseUrl = env.VITE_SUPABASE_URL;
    const supabaseKey = env.VITE_SUPABASE_ANON_KEY;
    
    console.log('\n📡 Tentando inserção via API REST direta...');
    
    // Inserir dados em lotes pequenos via API REST
    const batchSize = 10;
    const totalBatches = Math.ceil(mappedData.length / batchSize);
    let totalInserted = 0;
    let totalErrors = 0;
    
    for (let i = 0; i < totalBatches; i++) {
      const start = i * batchSize;
      const end = Math.min(start + batchSize, mappedData.length);
      const batch = mappedData.slice(start, end);
      
      console.log(`\n📦 Inserindo lote ${i + 1}/${totalBatches} (${batch.length} registros)...`);
      
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/leads`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(batch)
        });
        
        if (response.ok) {
          console.log(`✅ Lote ${i + 1} inserido com sucesso via API REST`);
          totalInserted += batch.length;
        } else {
          const errorText = await response.text();
          console.error(`❌ Erro no lote ${i + 1} via API REST:`, response.status, errorText);
          
          // Tentar inserção individual
          console.log(`🔄 Tentando inserção individual para lote ${i + 1}...`);
          
          for (let j = 0; j < batch.length; j++) {
            try {
              const singleResponse = await fetch(`${supabaseUrl}/rest/v1/leads`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'apikey': supabaseKey,
                  'Authorization': `Bearer ${supabaseKey}`,
                  'Prefer': 'return=minimal'
                },
                body: JSON.stringify([batch[j]])
              });
              
              if (singleResponse.ok) {
                totalInserted++;
              } else {
                const singleErrorText = await singleResponse.text();
                console.error(`❌ Erro no registro ${start + j + 1}:`, singleResponse.status, singleErrorText);
                totalErrors++;
              }
            } catch (singleErr) {
              console.error(`❌ Erro inesperado no registro ${start + j + 1}:`, singleErr.message);
              totalErrors++;
            }
          }
        }
      } catch (batchErr) {
        console.error(`❌ Erro inesperado no lote ${i + 1}:`, batchErr.message);
        totalErrors += batch.length;
      }
      
      // Pausa entre lotes
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
        .limit(5);
      
      console.log('\n📋 Exemplos de registros inseridos:');
      sampleData?.forEach((record, index) => {
        console.log(`Registro ${index + 1}:`, JSON.stringify(record, null, 2));
      });
    } else {
      console.log('\n⚠️ Nenhum registro foi inserido.');
      console.log('\n💡 Possíveis soluções:');
      console.log('1. Verificar se a tabela existe no Supabase');
      console.log('2. Verificar as políticas RLS no Supabase Dashboard');
      console.log('3. Verificar as permissões da API key');
      console.log('4. Tentar usar uma service_role key se disponível');
    }
    
  } catch (error) {
    console.error('❌ Erro durante importação:', error);
  }
}

// Executar importação
importBypassRLS();