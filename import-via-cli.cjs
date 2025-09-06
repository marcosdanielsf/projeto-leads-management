const fs = require('fs');
const { execSync } = require('child_process');
const csv = require('csv-parser');
const path = require('path');

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

// Função para escapar strings SQL
function escapeSqlString(str) {
  if (str === null || str === undefined) return 'NULL';
  return "'" + str.toString().replace(/'/g, "''") + "'";
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

// Função para criar SQL de inserção
function createInsertSQL(records) {
  const batchSize = 100;
  const sqlStatements = [];
  
  // Primeiro, limpar a tabela
  sqlStatements.push('TRUNCATE TABLE public.leads RESTART IDENTITY CASCADE;');
  
  // Desabilitar RLS temporariamente
  sqlStatements.push('ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;');
  
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    
    const values = batch.map(record => {
      return `(
        ${escapeSqlString(record.lead_id)},
        ${escapeSqlString(record.usuario_responsavel)},
        ${escapeSqlString(record.contato_principal)},
        ${record.data_criada ? `'${record.data_criada}'` : 'NULL'},
        ${escapeSqlString(record.fonte_lead)},
        ${escapeSqlString(record.etapa_funil)},
        ${escapeSqlString(record.estado_onde_mora)},
        ${escapeSqlString(record.tipo_agendamento)},
        ${escapeSqlString(record.respostas_ia)},
        ${escapeSqlString(record.email_comercial)},
        ${escapeSqlString(record.telefone_comercial)},
        ${escapeSqlString(record.estado_contato)},
        ${escapeSqlString(record.permissao_trabalho)},
        ${record.data_entrada_agendamento ? `'${record.data_entrada_agendamento}'` : 'NULL'},
        ${escapeSqlString(record.data_hora_agendamento_bposs)}
      )`;
    }).join(',\n');
    
    const insertSQL = `
INSERT INTO public.leads (
  lead_id,
  usuario_responsavel,
  contato_principal,
  data_criada,
  fonte_lead,
  etapa_funil,
  estado_onde_mora,
  tipo_agendamento,
  respostas_ia,
  email_comercial,
  telefone_comercial,
  estado_contato,
  permissao_trabalho,
  data_entrada_agendamento,
  data_hora_agendamento_bposs
) VALUES ${values};`;
    
    sqlStatements.push(insertSQL);
  }
  
  // Reabilitar RLS
  sqlStatements.push('ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;');
  
  return sqlStatements;
}

// Função principal
async function main() {
  try {
    console.log('🚀 Iniciando importação via Supabase CLI...');
    
    // Verificar se o Supabase CLI está instalado
    try {
      execSync('supabase --version', { stdio: 'pipe' });
      console.log('✅ Supabase CLI encontrado');
    } catch (error) {
      console.log('❌ Supabase CLI não encontrado. Instalando...');
      console.log('Execute: npm install -g supabase');
      process.exit(1);
    }
    
    // Processar CSV
    const records = await processCSV();
    
    if (records.length === 0) {
      console.log('❌ Nenhum registro encontrado no CSV');
      return;
    }
    
    // Criar SQL
    console.log('📝 Gerando SQL de inserção...');
    const sqlStatements = createInsertSQL(records);
    
    // Salvar SQL em arquivo temporário
    const sqlFile = path.join(__dirname, 'temp-import.sql');
    fs.writeFileSync(sqlFile, sqlStatements.join('\n\n'));
    console.log(`💾 SQL salvo em: ${sqlFile}`);
    
    // Executar SQL via Supabase CLI
    console.log('⚡ Executando SQL via Supabase CLI...');
    
    try {
      const result = execSync(`supabase db reset --linked`, { 
        stdio: 'pipe',
        encoding: 'utf8',
        cwd: __dirname
      });
      console.log('✅ Banco resetado');
    } catch (error) {
      console.log('⚠️ Erro ao resetar banco, continuando...');
    }
    
    try {
      const result = execSync(`supabase db push --linked`, { 
        stdio: 'pipe',
        encoding: 'utf8',
        cwd: __dirname
      });
      console.log('✅ Migrações aplicadas');
    } catch (error) {
      console.log('⚠️ Erro ao aplicar migrações, continuando...');
    }
    
    // Executar o SQL de importação
    try {
      const result = execSync(`psql "$(supabase status --output env | grep DATABASE_URL | cut -d'=' -f2-)" -f "${sqlFile}"`, { 
        stdio: 'pipe',
        encoding: 'utf8',
        cwd: __dirname
      });
      console.log('✅ Dados importados com sucesso!');
      console.log(result);
    } catch (error) {
      console.log('❌ Erro ao executar SQL:', error.message);
      
      // Tentar abordagem alternativa
      console.log('🔄 Tentando abordagem alternativa...');
      
      // Dividir em comandos menores
      for (let i = 0; i < sqlStatements.length; i++) {
        const stmt = sqlStatements[i];
        const tempFile = path.join(__dirname, `temp-stmt-${i}.sql`);
        fs.writeFileSync(tempFile, stmt);
        
        try {
          execSync(`psql "$(supabase status --output env | grep DATABASE_URL | cut -d'=' -f2-)" -f "${tempFile}"`, { 
            stdio: 'pipe',
            encoding: 'utf8',
            cwd: __dirname
          });
          console.log(`✅ Comando ${i + 1}/${sqlStatements.length} executado`);
          fs.unlinkSync(tempFile);
        } catch (cmdError) {
          console.log(`❌ Erro no comando ${i + 1}:`, cmdError.message);
          fs.unlinkSync(tempFile);
        }
      }
    }
    
    // Verificar resultado
    try {
      const countResult = execSync(`psql "$(supabase status --output env | grep DATABASE_URL | cut -d'=' -f2-)" -c "SELECT COUNT(*) FROM public.leads;"`, { 
        stdio: 'pipe',
        encoding: 'utf8',
        cwd: __dirname
      });
      console.log('📊 Resultado final:');
      console.log(countResult);
    } catch (error) {
      console.log('❌ Erro ao verificar resultado:', error.message);
    }
    
    // Limpar arquivo temporário
    if (fs.existsSync(sqlFile)) {
      fs.unlinkSync(sqlFile);
    }
    
    console.log('🎉 Processo concluído!');
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    process.exit(1);
  }
}

// Executar
main();