const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Ler variáveis do arquivo .env
const envContent = fs.readFileSync('.env', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const supabase = createClient(envVars.VITE_SUPABASE_URL, envVars.VITE_SUPABASE_ANON_KEY);

async function runMigrations() {
  try {
    console.log('🚀 Iniciando execução das migrações SQL...');
    
    const migrationsDir = './supabase/migrations';
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();
    
    console.log('📁 Migrações encontradas:', files);
    
    for (const file of files) {
      const sqlPath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(sqlPath, 'utf8');
      
      console.log(`\n⚡ Executando: ${file}`);
      
      // Dividir o SQL em comandos individuais
      const commands = sql.split(';').filter(cmd => cmd.trim().length > 0);
      
      for (const command of commands) {
        const trimmedCommand = command.trim();
        if (trimmedCommand) {
          try {
            const { data, error } = await supabase.rpc('exec_sql', { 
              sql_query: trimmedCommand + ';' 
            });
            
            if (error) {
              console.log(`❌ Erro no comando: ${error.message}`);
              console.log(`📝 Comando: ${trimmedCommand.substring(0, 100)}...`);
            } else {
              console.log(`✅ Comando executado com sucesso`);
            }
          } catch (err) {
            console.log(`❌ Erro de execução: ${err.message}`);
          }
        }
      }
      
      console.log(`✅ ${file} processado`);
    }
    
    console.log('\n🎉 Todas as migrações foram processadas!');
    console.log('\n📋 Verificando se a tabela foi criada...');
    
    // Verificar se a tabela existe
    const { data: tableCheck, error: tableError } = await supabase
      .from('leads')
      .select('count', { count: 'exact', head: true });
    
    if (tableError) {
      console.log('❌ Tabela leads ainda não existe:', tableError.message);
      console.log('\n💡 Execute o SQL manualmente no Supabase Dashboard:');
      console.log('1. Acesse https://supabase.com/dashboard');
      console.log('2. Vá para SQL Editor');
      console.log('3. Execute o SQL fornecido pelo script create-complete-table.js');
    } else {
      console.log('✅ Tabela leads criada com sucesso!');
      console.log(`📊 Registros na tabela: ${tableCheck?.count || 0}`);
    }
    
  } catch (err) {
    console.log('❌ Erro geral:', err.message);
    console.log('\n💡 Tente executar o SQL manualmente no Supabase Dashboard.');
  }
}

runMigrations();