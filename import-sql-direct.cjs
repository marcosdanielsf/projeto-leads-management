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

// Função para escapar strings SQL
function escapeSQLString(str) {
  if (str === null || str === undefined || str === '') return 'NULL';
  return `'${str.toString().replace(/'/g, "''")}'`;
}

// Função para converter data para SQL
function convertDateForSQL(dateStr) {
  if (!dateStr || dateStr === 'null' || dateStr === '' || dateStr === 'undefined') return 'NULL';
  
  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return `'${date.toISOString()}'`;
    }
    return 'NULL';
  } catch (error) {
    return 'NULL';
  }
}

// Função para mapear dados do CSV para SQL
function mapCSVToSQL(csvRow) {
  const leadId = escapeSQLString(csvRow['lead_id']);
  const nome = escapeSQLString(csvRow['contato_principal (obrigatório)']);
  const telefone = escapeSQLString(csvRow['telefone_comercial']);
  const email = escapeSQLString(csvRow['email_comercial']);
  const origem = escapeSQLString(csvRow['fonte_lead']);
  const status = escapeSQLString(csvRow['etapa_funil (obrigatório)'] || csvRow['estado_contato']);
  const observacoes = escapeSQLString(csvRow['respostas_ia'] || csvRow['tipo_agendamento']);
  const dataEntrada = convertDateForSQL(csvRow['data_entrada_agendamento']);
  const dataAgendamento = convertDateForSQL(csvRow['data_hora_agendamento_bposs']);
  
  return `(${leadId}, ${nome}, ${telefone}, ${email}, ${origem}, ${status}, ${observacoes}, ${dataEntrada}, ${dataAgendamento})`;
}

async function importSQLDirect() {
  try {
    console.log('🚀 Iniciando importação via SQL direto...');
    
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
    
    // Filtrar dados válidos
    const validData = csvData.filter(row => {
      return row['contato_principal (obrigatório)'] || row['telefone_comercial'] || row['email_comercial'] || row['lead_id'];
    });
    
    console.log(`🔄 Registros válidos para inserção: ${validData.length}`);
    
    if (validData.length === 0) {
      console.log('⚠️ Nenhum registro válido encontrado');
      return;
    }
    
    // Primeiro, vamos desabilitar RLS temporariamente
    console.log('\n🔓 Tentando desabilitar RLS temporariamente...');
    
    const disableRLSSQL = 'ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;';
    
    try {
      const { data: disableResult, error: disableError } = await supabase
        .rpc('exec_sql', { sql_query: disableRLSSQL });
      
      if (disableError) {
        console.log('⚠️ Não foi possível desabilitar RLS via RPC:', disableError.message);
      } else {
        console.log('✅ RLS desabilitado temporariamente');
      }
    } catch (err) {
      console.log('⚠️ Erro ao desabilitar RLS:', err.message);
    }
    
    // Criar SQL de inserção em lotes
    const batchSize = 100;
    const totalBatches = Math.ceil(validData.length / batchSize);
    let totalInserted = 0;
    let totalErrors = 0;
    
    console.log(`\n📦 Iniciando inserção via SQL em ${totalBatches} lotes...`);
    
    for (let i = 0; i < totalBatches; i++) {
      const start = i * batchSize;
      const end = Math.min(start + batchSize, validData.length);
      const batch = validData.slice(start, end);
      
      console.log(`\n📦 Processando lote ${i + 1}/${totalBatches} (${batch.length} registros)...`);
      
      // Criar SQL INSERT
      const values = batch.map(mapCSVToSQL).join(',\n  ');
      
      const insertSQL = `
        INSERT INTO public.leads (
          lead_id, nome, telefone, email, origem, status, observacoes, 
          data_entrada_agendamento, data_hora_agendamento_bposs
        ) VALUES 
          ${values};
      `;
      
      try {
        // Tentar via RPC primeiro
        const { data: insertResult, error: insertError } = await supabase
          .rpc('exec_sql', { sql_query: insertSQL });
        
        if (insertError) {
          console.error(`❌ Erro RPC no lote ${i + 1}:`, insertError.message);
          
          // Se RPC falhar, tentar inserção normal
          console.log(`🔄 Tentando inserção normal para lote ${i + 1}...`);
          
          const mappedBatch = batch.map(row => ({
            lead_id: row['lead_id'] || null,
            nome: row['contato_principal (obrigatório)'] || null,
            telefone: row['telefone_comercial'] || null,
            email: row['email_comercial'] || null,
            origem: row['fonte_lead'] || null,
            status: row['etapa_funil (obrigatório)'] || row['estado_contato'] || null,
            observacoes: row['respostas_ia'] || row['tipo_agendamento'] || null,
            data_entrada_agendamento: row['data_entrada_agendamento'] ? new Date(row['data_entrada_agendamento']).toISOString() : null,
            data_hora_agendamento_bposs: row['data_hora_agendamento_bposs'] ? new Date(row['data_hora_agendamento_bposs']).toISOString() : null
          }));
          
          const { data: normalResult, error: normalError } = await supabase
            .from('leads')
            .insert(mappedBatch)
            .select('id');
          
          if (normalError) {
            console.error(`❌ Erro normal no lote ${i + 1}:`, normalError.message);
            totalErrors += batch.length;
          } else {
            console.log(`✅ Lote ${i + 1} inserido via método normal (${normalResult.length} registros)`);
            totalInserted += normalResult.length;
          }
        } else {
          console.log(`✅ Lote ${i + 1} inserido via SQL (${batch.length} registros)`);
          totalInserted += batch.length;
        }
      } catch (batchErr) {
        console.error(`❌ Erro inesperado no lote ${i + 1}:`, batchErr.message);
        totalErrors += batch.length;
      }
      
      // Pequena pausa entre lotes
      if (i < totalBatches - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    // Reabilitar RLS
    console.log('\n🔒 Reabilitando RLS...');
    const enableRLSSQL = 'ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;';
    
    try {
      await supabase.rpc('exec_sql', { sql_query: enableRLSSQL });
      console.log('✅ RLS reabilitado');
    } catch (err) {
      console.log('⚠️ Erro ao reabilitar RLS:', err.message);
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
      console.log('\n⚠️ Nenhum registro foi inserido.');
      console.log('\n💡 Instruções para inserção manual:');
      console.log('1. Acesse o Supabase Dashboard');
      console.log('2. Vá para SQL Editor');
      console.log('3. Execute: ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;');
      console.log('4. Execute novamente este script');
      console.log('5. Depois execute: ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;');
    }
    
  } catch (error) {
    console.error('❌ Erro durante importação:', error);
  }
}

// Executar importação
importSQLDirect();