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

async function checkTableStructure() {
  try {
    console.log('🔍 Verificando estrutura da tabela leads...');
    
    // Carregar variáveis de ambiente
    const env = loadEnvVars();
    
    // Criar cliente Supabase
    const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
    
    // Tentar fazer uma consulta simples para ver se a tabela existe
    console.log('\n1. Testando acesso à tabela leads...');
    const { data: testData, error: testError } = await supabase
      .from('leads')
      .select('*')
      .limit(1);
    
    if (testError) {
      console.error('❌ Erro ao acessar tabela leads:', testError);
      console.log('Código do erro:', testError.code);
      console.log('Mensagem:', testError.message);
      console.log('Detalhes:', testError.details);
      console.log('Hint:', testError.hint);
    } else {
      console.log('✅ Tabela leads acessível');
      console.log('Dados de exemplo:', testData);
    }
    
    // Tentar inserir um registro muito simples
    console.log('\n2. Testando inserção simples...');
    const simpleRecord = {
      nome: 'Teste',
      telefone: '123456789',
      email: 'teste@teste.com'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('leads')
      .insert([simpleRecord])
      .select();
    
    if (insertError) {
      console.error('❌ Erro na inserção simples:', insertError);
      console.log('Código do erro:', insertError.code);
      console.log('Mensagem:', insertError.message);
      console.log('Detalhes:', insertError.details);
      console.log('Hint:', insertError.hint);
    } else {
      console.log('✅ Inserção simples bem-sucedida:', insertData);
      
      // Remover o registro de teste
      if (insertData && insertData[0] && insertData[0].id) {
        await supabase
          .from('leads')
          .delete()
          .eq('id', insertData[0].id);
        console.log('🗑️ Registro de teste removido');
      }
    }
    
    // Verificar políticas RLS
    console.log('\n3. Verificando políticas de segurança...');
    const { data: rlsData, error: rlsError } = await supabase
      .rpc('check_table_policies', { table_name: 'leads' })
      .single();
    
    if (rlsError) {
      console.log('⚠️ Não foi possível verificar políticas RLS:', rlsError.message);
    } else {
      console.log('📋 Políticas RLS:', rlsData);
    }
    
    // Tentar inserir com diferentes campos
    console.log('\n4. Testando inserção com campos mínimos...');
    const minimalRecord = {
      nome: 'Teste Minimal'
    };
    
    const { data: minimalData, error: minimalError } = await supabase
      .from('leads')
      .insert([minimalRecord])
      .select();
    
    if (minimalError) {
      console.error('❌ Erro na inserção minimal:', minimalError);
      console.log('Código do erro:', minimalError.code);
      console.log('Mensagem:', minimalError.message);
      console.log('Detalhes:', minimalError.details);
      console.log('Hint:', minimalError.hint);
    } else {
      console.log('✅ Inserção minimal bem-sucedida:', minimalData);
      
      // Remover o registro de teste
      if (minimalData && minimalData[0] && minimalData[0].id) {
        await supabase
          .from('leads')
          .delete()
          .eq('id', minimalData[0].id);
        console.log('🗑️ Registro de teste minimal removido');
      }
    }
    
    // Verificar se há registros na tabela
    console.log('\n5. Verificando registros existentes...');
    const { data: existingData, error: existingError, count } = await supabase
      .from('leads')
      .select('*', { count: 'exact' })
      .limit(5);
    
    if (existingError) {
      console.error('❌ Erro ao verificar registros existentes:', existingError);
    } else {
      console.log(`📊 Total de registros na tabela: ${count}`);
      console.log('Primeiros registros:', existingData);
    }
    
  } catch (error) {
    console.error('❌ Erro durante verificação:', error);
  }
}

// Executar verificação
checkTableStructure();