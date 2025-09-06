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

async function testTable() {
  try {
    console.log('🔍 Testando conexão e estrutura da tabela...');
    
    // Carregar variáveis de ambiente
    const env = loadEnvVars();
    console.log('URL:', env.VITE_SUPABASE_URL);
    console.log('Key:', env.VITE_SUPABASE_ANON_KEY ? 'Configurada' : 'Não encontrada');
    
    // Criar cliente Supabase
    const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
    
    // Verificar se a tabela existe
    console.log('\n📋 Verificando se a tabela leads existe...');
    const { data: tableCheck, error: tableError } = await supabase
      .from('leads')
      .select('count', { count: 'exact', head: true });
    
    if (tableError) {
      console.error('❌ Erro ao verificar tabela:', tableError);
      return;
    }
    
    console.log('✅ Tabela leads encontrada');
    console.log('Contagem atual:', tableCheck);
    
    // Verificar estrutura da tabela
    console.log('\n🔍 Verificando estrutura da tabela...');
    const { data: columns, error: columnsError } = await supabase
      .rpc('exec_sql', {
        sql_query: `
          SELECT column_name, data_type, is_nullable 
          FROM information_schema.columns 
          WHERE table_schema = 'public' AND table_name = 'leads'
          ORDER BY ordinal_position;
        `
      });
    
    if (columnsError) {
      console.log('⚠️ Não foi possível verificar estrutura via RPC:', columnsError.message);
    } else {
      console.log('Colunas da tabela:', columns);
    }
    
    // Testar inserção simples
    console.log('\n🧪 Testando inserção simples...');
    const testRecord = {
      lead_id: 'TEST_001',
      nome: 'Teste',
      telefone: '+5511999999999',
      email: 'teste@teste.com',
      origem: 'Teste',
      status: 'Teste',
      observacoes: 'Registro de teste'
    };
    
    console.log('Dados do teste:', JSON.stringify(testRecord, null, 2));
    
    const { data: insertData, error: insertError } = await supabase
      .from('leads')
      .insert([testRecord])
      .select();
    
    if (insertError) {
      console.error('❌ Erro na inserção de teste:', insertError);
    } else {
      console.log('✅ Inserção de teste bem-sucedida:', insertData);
      
      // Remover o registro de teste
      const { error: deleteError } = await supabase
        .from('leads')
        .delete()
        .eq('lead_id', 'TEST_001');
      
      if (deleteError) {
        console.warn('⚠️ Erro ao remover registro de teste:', deleteError.message);
      } else {
        console.log('🗑️ Registro de teste removido');
      }
    }
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  }
}

// Executar teste
testTable();