-- Script final para importação de dados no Supabase Dashboard
-- Execute este script diretamente no SQL Editor do Supabase Dashboard

-- 1. Primeiro, vamos garantir que a tabela existe
DROP TABLE IF EXISTS public.leads CASCADE;

-- 2. Criar a tabela leads
CREATE TABLE public.leads (
    id BIGSERIAL PRIMARY KEY,
    lead_id TEXT,
    usuario_responsavel TEXT,
    contato_principal TEXT NOT NULL,
    data_criada DATE,
    fonte_lead TEXT,
    etapa_funil TEXT NOT NULL,
    estado_onde_mora TEXT,
    tipo_agendamento TEXT,
    respostas_ia TEXT,
    email_comercial TEXT,
    telefone_comercial TEXT,
    estado_contato TEXT,
    permissao_trabalho TEXT NOT NULL,
    data_entrada_agendamento DATE,
    data_hora_agendamento_bposs TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Criar índices para melhor performance
CREATE INDEX idx_leads_lead_id ON public.leads(lead_id);
CREATE INDEX idx_leads_contato_principal ON public.leads(contato_principal);
CREATE INDEX idx_leads_etapa_funil ON public.leads(etapa_funil);
CREATE INDEX idx_leads_data_criada ON public.leads(data_criada);
CREATE INDEX idx_leads_created_at ON public.leads(created_at);

-- 4. Criar trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 5. Configurar RLS (Row Level Security)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 6. Criar políticas RLS
CREATE POLICY "Enable read access for all users" ON public.leads
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.leads
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON public.leads
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON public.leads
    FOR DELETE USING (auth.role() = 'authenticated');

-- 7. TEMPORARIAMENTE desabilitar RLS para inserção em massa
ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;

-- 8. Inserir dados de exemplo (você precisará substituir pelos dados reais do CSV)
-- Este é apenas um exemplo de como inserir os dados
-- Você deve copiar os dados do CSV e formatá-los como INSERT statements

/*
Para inserir os dados do CSV, você precisa:
1. Abrir o arquivo leads_filtrado_revisado.csv
2. Converter cada linha em um INSERT statement
3. Executar os INSERTs em lotes de 100-500 registros

Exemplo de formato:
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
) VALUES 
('LEAD001', 'Usuario1', 'Contato Principal', '2024-01-01', 'Website', 'Qualificado', 'SP', 'Online', 'Sim', 'email@test.com', '11999999999', 'Ativo', 'Sim', '2024-01-02', '2024-01-02 10:00:00'),
('LEAD002', 'Usuario2', 'Outro Contato', '2024-01-02', 'Facebook', 'Interessado', 'RJ', 'Presencial', 'Não', 'email2@test.com', '21999999999', 'Ativo', 'Sim', '2024-01-03', '2024-01-03 14:00:00');
*/

-- 9. Após inserir todos os dados, reabilitar RLS
-- ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 10. Verificar se os dados foram inseridos
-- SELECT COUNT(*) FROM public.leads;
-- SELECT * FROM public.leads LIMIT 10;

-- INSTRUÇÕES PARA USO:
-- 1. Copie este script
-- 2. Vá para o Supabase Dashboard > SQL Editor
-- 3. Cole e execute este script
-- 4. Prepare os dados do CSV em formato SQL INSERT
-- 5. Execute os INSERTs em lotes
-- 6. Descomente e execute a linha para reabilitar RLS
-- 7. Verifique os dados com as queries de verificação