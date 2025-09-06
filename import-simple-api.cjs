const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const https = require('https');

// Função para carregar variáveis de ambiente
function loadEnv() {
  try {
    const envPath = path.join(__dirname, '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        envVars[key.trim()] = value.trim();
      }
    });
    
    return envVars;
  } catch (error) {
    console.log('⚠️ Arquivo .env não encontrado, usando variáveis do sistema');
    return process.env;
  }
}

// Função para fazer requisições HTTP
function makeRequest(url, options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (error) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Função para converter data
function convertDate(dateStr) {
  if (!dateStr || dateStr.trim() === '') return null;
  
  try {
    // Formato esperado: DD/MM/YYYY
    const [day, month, year] = dateStr.split('/');
    if (day && month && year) {
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return null;
  } catch (error) {
    return null;
  }
}

// Função para processar CSV
function processCSV() {
  return new Promise((resolve, reject) => {
    const records = [];
    const csvPath = path.join(__dirname, 'public', 'leads_filtrado_revisado.csv');
    
    console.log(`📁 Lendo arquivo: ${csvPath}`);
    
    if (!fs.existsSync(csvPath)) {
      reject(new Error(`Arquivo não encontrado: ${csvPath}`));
      return;
    }
    
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        // Mapear colunas do CSV para campos da tabela
        const record = {
          lead_id: row['lead_id'] || null,
          usuario_responsavel: row['usuario_responsavel'] || null,
          contato_principal: row['contato_principal (obrigatório)'] || null,
          data_criada: convertDate(row['data_criada']),
          fonte_lead: row['fonte_lead'] || null,
          etapa_funil: row['etapa_funil (obrigatório)'] || null,
          estado_onde_mora: row['estado onde mora'] || null,
          tipo_agendamento: row['tipo_agendamento'] || null,
          respostas_ia: row['respostas_ia'] || null,
          email_comercial: row['email_comercial'] || null,
          telefone_comercial: row['telefone_comercial'] || null,
          estado_contato: row['estado_contato'] || null,
          permissao_trabalho: row['permissao_trabalho (obrigatório)'] || null,
          data_entrada_agendamento: convertDate(row['data_entrada_agendamento']),
          data_hora_agendamento_bposs: row['data_hora_agendamento_bposs'] || null
        };
        
        records.push(record);
      })
      .on('end', () => {
        console.log(`✅ CSV processado: ${records.length} registros`);
        resolve(records);
      })
      .on('error', reject);
  });
}

// Função para executar SQL direto
async function executeSQL(supabaseUrl, serviceKey, sql) {
  const url = `${supabaseUrl}/rest/v1/rpc/exec_sql`;
  
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${serviceKey}`,
      'apikey': serviceKey
    }
  };
  
  try {
    const response = await makeRequest(url, options, { sql });
    return response;
  } catch (error) {
    throw error;
  }
}

// Função para inserir dados via API REST
async function insertData(supabaseUrl, serviceKey, records) {
  const url = `${supabaseUrl}/rest/v1/leads`;
  
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${serviceKey}`,
      'apikey': serviceKey,
      'Prefer': 'return=minimal'
    }
  };
  
  const batchSize = 50;
  let totalInserted = 0;
  let errors = 0;
  
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    console.log(`📦 Inserindo lote ${Math.floor(i/batchSize) + 1}/${Math.ceil(records.length/batchSize)} (${batch.length} registros)...`);
    
    try {
      const response = await makeRequest(url, options, batch);
      
      if (response.status === 201) {
        totalInserted += batch.length;
        console.log(`✅ Lote inserido com sucesso`);
      } else {
        console.log(`❌ Erro no lote:`, response.status, response.data);
        errors += batch.length;
        
        // Tentar inserção individual
        console.log('🔄 Tentando inserção individual...');
        for (const record of batch) {
          try {
            const singleResponse = await makeRequest(url, options, [record]);
            if (singleResponse.status === 201) {
              totalInserted++;
              errors--;
            } else {
              console.log(`❌ Erro no registro individual:`, singleResponse.status, singleResponse.data);
            }
          } catch (singleError) {
            console.log(`❌ Erro no registro individual:`, singleError.message);
          }
        }
      }
    } catch (error) {
      console.log(`❌ Erro no lote:`, error.message);
      errors += batch.length;
    }
    
    // Pequena pausa entre lotes
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return { totalInserted, errors };
}

// Função principal
async function main() {
  try {
    console.log('🚀 Iniciando importação via API REST...');
    
    // Carregar variáveis de ambiente
    const env = loadEnv();
    const supabaseUrl = env.VITE_SUPABASE_URL;
    const anonKey = env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !anonKey) {
      console.log('❌ Variáveis de ambiente não encontradas');
      console.log('Certifique-se de que VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão definidas');
      return;
    }
    
    console.log('✅ Variáveis de ambiente carregadas');
    console.log(`📍 URL: ${supabaseUrl}`);
    
    // Processar CSV
    const records = await processCSV();
    
    if (records.length === 0) {
      console.log('❌ Nenhum registro encontrado no CSV');
      return;
    }
    
    console.log(`📊 Total de registros a importar: ${records.length}`);
    
    // Primeiro, tentar limpar a tabela usando a chave anon
    console.log('🧹 Tentando limpar tabela...');
    try {
      const deleteUrl = `${supabaseUrl}/rest/v1/leads`;
      const deleteOptions = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${anonKey}`,
          'apikey': anonKey,
          'Prefer': 'return=minimal'
        }
      };
      
      const deleteResponse = await makeRequest(deleteUrl, deleteOptions);
      console.log(`✅ Tabela limpa (status: ${deleteResponse.status})`);
    } catch (error) {
      console.log('⚠️ Não foi possível limpar a tabela:', error.message);
    }
    
    // Inserir dados
    console.log('📥 Iniciando inserção de dados...');
    const result = await insertData(supabaseUrl, anonKey, records);
    
    console.log('\n📊 Resumo da importação:');
    console.log(`✅ Registros inseridos: ${result.totalInserted}`);
    console.log(`❌ Erros: ${result.errors}`);
    console.log(`📈 Taxa de sucesso: ${((result.totalInserted / records.length) * 100).toFixed(2)}%`);
    
    // Verificar total na tabela
    try {
      const countUrl = `${supabaseUrl}/rest/v1/leads?select=count`;
      const countOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${anonKey}`,
          'apikey': anonKey
        }
      };
      
      const countResponse = await makeRequest(countUrl, countOptions);
      console.log(`📊 Total de registros na tabela: ${JSON.stringify(countResponse.data)}`);
    } catch (error) {
      console.log('⚠️ Não foi possível verificar o total:', error.message);
    }
    
    if (result.totalInserted > 0) {
      console.log('🎉 Importação concluída com sucesso!');
    } else {
      console.log('❌ Nenhum registro foi inserido. Verifique as configurações.');
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    process.exit(1);
  }
}

// Executar
main();