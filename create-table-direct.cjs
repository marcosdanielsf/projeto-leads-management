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

async function createTableDirect() {
  try {
    console.log('🚀 Criando tabela leads diretamente...');
    
    // Carregar variáveis de ambiente
    const env = loadEnvVars();
    
    // Criar cliente Supabase
    const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
    
    // SQL para criar a tabela
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS public.leads (
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
    
    console.log('📋 Executando SQL para criar tabela...');
    
    // Tentar executar o SQL usando rpc
    const { data: createResult, error: createError } = await supabase
      .rpc('exec_sql', { sql_query: createTableSQL });
    
    if (createError) {
      console.log('⚠️ RPC exec_sql não disponível, tentando método alternativo...');
      console.log('Erro RPC:', createError.message);
      
      // Método alternativo: usar o SQL Editor do Supabase
      console.log('\n📝 Execute o seguinte SQL no Supabase Dashboard:');
      console.log('=' .repeat(60));
      console.log(createTableSQL);
      console.log('=' .repeat(60));
      
      // Criar índices
      const indexSQL = `
        -- Criar índices
        CREATE INDEX IF NOT EXISTS idx_leads_lead_id ON public.leads(lead_id);
        CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
        CREATE INDEX IF NOT EXISTS idx_leads_telefone ON public.leads(telefone);
        CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
        CREATE INDEX IF NOT EXISTS idx_leads_origem ON public.leads(origem);
        CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at);
      `;
      
      console.log('\n📋 Índices para melhor performance:');
      console.log('=' .repeat(60));
      console.log(indexSQL);
      console.log('=' .repeat(60));
      
      // Função e trigger para updated_at
      const triggerSQL = `
        -- Função para atualizar updated_at
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ language 'plpgsql';
        
        -- Trigger para updated_at
        DROP TRIGGER IF EXISTS update_leads_updated_at ON public.leads;
        CREATE TRIGGER update_leads_updated_at
          BEFORE UPDATE ON public.leads
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
      `;
      
      console.log('\n⚙️ Trigger para updated_at:');
      console.log('=' .repeat(60));
      console.log(triggerSQL);
      console.log('=' .repeat(60));
      
      // RLS e políticas
      const rlsSQL = `
        -- Habilitar RLS
        ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
        
        -- Política para permitir todas as operações (ajuste conforme necessário)
        DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON public.leads;
        CREATE POLICY "Enable all operations for authenticated users"
          ON public.leads
          FOR ALL
          TO authenticated
          USING (true)
          WITH CHECK (true);
        
        -- Política para permitir leitura pública (opcional)
        DROP POLICY IF EXISTS "Enable read for anon users" ON public.leads;
        CREATE POLICY "Enable read for anon users"
          ON public.leads
          FOR SELECT
          TO anon
          USING (true);
      `;
      
      console.log('\n🔒 Políticas de segurança (RLS):');
      console.log('=' .repeat(60));
      console.log(rlsSQL);
      console.log('=' .repeat(60));
      
      console.log('\n💡 Instruções:');
      console.log('1. Acesse o Supabase Dashboard');
      console.log('2. Vá para SQL Editor');
      console.log('3. Cole e execute cada bloco SQL acima');
      console.log('4. Execute novamente este script para verificar');
      
    } else {
      console.log('✅ Tabela criada com sucesso via RPC:', createResult);
    }
    
    // Aguardar um pouco e verificar se a tabela foi criada
    console.log('\n🔍 Verificando se a tabela foi criada...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const { data: checkData, error: checkError } = await supabase
      .from('leads')
      .select('count', { count: 'exact', head: true });
    
    if (checkError) {
      if (checkError.code === '42P01') {
        console.log('❌ Tabela ainda não existe. Execute o SQL manualmente no Supabase Dashboard.');
      } else {
        console.log('⚠️ Erro ao verificar tabela:', checkError);
      }
    } else {
      console.log('✅ Tabela leads criada e acessível!');
      console.log('📊 Registros atuais:', checkData);
      
      // Testar inserção
      console.log('\n🧪 Testando inserção...');
      const testRecord = {
        nome: 'Teste Criação',
        telefone: '123456789',
        email: 'teste@criacao.com'
      };
      
      const { data: testData, error: testError } = await supabase
        .from('leads')
        .insert([testRecord])
        .select();
      
      if (testError) {
        console.error('❌ Erro no teste de inserção:', testError);
      } else {
        console.log('✅ Teste de inserção bem-sucedido:', testData);
        
        // Remover registro de teste
        if (testData && testData[0] && testData[0].id) {
          await supabase
            .from('leads')
            .delete()
            .eq('id', testData[0].id);
          console.log('🗑️ Registro de teste removido');
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Erro durante criação da tabela:', error);
  }
}

// Executar criação
createTableDirect();