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

async function executeSQLFile() {
  try {
    console.log('🚀 Executando SQL para criar a tabela leads...');
    
    // Carregar variáveis de ambiente
    const env = loadEnvVars();
    
    // Criar cliente Supabase
    const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
    
    // Ler o arquivo SQL
    const sqlPath = path.join(__dirname, 'create-leads-table.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Dividir o SQL em comandos individuais
    const sqlCommands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd && !cmd.startsWith('--') && cmd !== '');
    
    console.log(`📋 Executando ${sqlCommands.length} comandos SQL...`);
    
    // Executar cada comando SQL
    for (let i = 0; i < sqlCommands.length; i++) {
      const command = sqlCommands[i];
      
      if (command.trim() === '') continue;
      
      console.log(`\n⚡ Executando comando ${i + 1}/${sqlCommands.length}...`);
      console.log(`SQL: ${command.substring(0, 100)}${command.length > 100 ? '...' : ''}`);
      
      try {
        // Para comandos CREATE TABLE, usar o cliente diretamente
        if (command.toUpperCase().includes('CREATE TABLE')) {
          const { data, error } = await supabase.rpc('exec_sql', {
            sql_query: command
          });
          
          if (error) {
            console.log(`❌ Erro no comando ${i + 1}:`, error.message);
            // Tentar executar diretamente se RPC falhar
            console.log('🔄 Tentando execução alternativa...');
            const result = await fetch(`${env.VITE_SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${env.VITE_SUPABASE_ANON_KEY}`,
                'apikey': env.VITE_SUPABASE_ANON_KEY
              },
              body: JSON.stringify({ sql_query: command })
            });
            
            if (!result.ok) {
              console.log(`❌ Falha na execução alternativa:`, await result.text());
            } else {
              console.log(`✅ Comando ${i + 1} executado com sucesso (alternativo)`);
            }
          } else {
            console.log(`✅ Comando ${i + 1} executado com sucesso`);
          }
        } else {
          // Para outros comandos, tentar RPC
          const { data, error } = await supabase.rpc('exec_sql', {
            sql_query: command
          });
          
          if (error) {
            console.log(`⚠️ Comando ${i + 1} falhou (pode ser normal):`, error.message);
          } else {
            console.log(`✅ Comando ${i + 1} executado com sucesso`);
          }
        }
      } catch (err) {
        console.log(`❌ Erro inesperado no comando ${i + 1}:`, err.message);
      }
      
      // Pequena pausa entre comandos
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // Verificar se a tabela foi criada
    console.log('\n🔍 Verificando se a tabela foi criada...');
    const { data: tableCheck, error: tableError } = await supabase
      .from('leads')
      .select('count', { count: 'exact', head: true });
    
    if (tableError) {
      console.error('❌ Tabela não foi criada:', tableError.message);
      
      // Tentar criar a tabela manualmente
      console.log('🔧 Tentando criar tabela manualmente...');
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS public.leads (
          id BIGSERIAL PRIMARY KEY,
          lead_id TEXT UNIQUE,
          nome TEXT,
          telefone TEXT,
          email TEXT,
          origem TEXT,
          status TEXT,
          observacoes TEXT,
          data_entrada_agendamento TIMESTAMP WITH TIME ZONE,
          data_hora_agendamento_bposs TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;
      
      try {
        const response = await fetch(`${env.VITE_SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${env.VITE_SUPABASE_ANON_KEY}`,
            'apikey': env.VITE_SUPABASE_ANON_KEY
          },
          body: JSON.stringify({ sql_query: createTableSQL })
        });
        
        if (response.ok) {
          console.log('✅ Tabela criada manualmente com sucesso!');
        } else {
          console.log('❌ Falha ao criar tabela manualmente:', await response.text());
        }
      } catch (err) {
        console.log('❌ Erro ao criar tabela manualmente:', err.message);
      }
    } else {
      console.log('✅ Tabela leads criada com sucesso!');
      console.log('📊 Registros atuais na tabela:', tableCheck);
    }
    
    console.log('\n🎉 Execução do SQL concluída!');
    
  } catch (error) {
    console.error('❌ Erro durante a execução do SQL:', error.message);
  }
}

// Executar
executeSQLFile();