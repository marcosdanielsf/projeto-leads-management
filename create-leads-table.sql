-- Script SQL completo para criar a tabela leads no Supabase
-- Execute este script no Supabase Dashboard > SQL Editor

-- 1. Criar a tabela leads com todas as colunas
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

-- 2. Criar comentários para as colunas
COMMENT ON COLUMN public.leads.data_entrada_agendamento IS 'Data em que o agendamento foi feito/registrado no sistema';
COMMENT ON COLUMN public.leads.data_hora_agendamento_bposs IS 'Data e hora do agendamento - BPOSS (horário da reunião)';
COMMENT ON COLUMN public.leads.lead_id IS 'Identificador único do lead';

-- 3. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_leads_lead_id ON public.leads(lead_id);
CREATE INDEX IF NOT EXISTS idx_leads_data_entrada_agendamento ON public.leads(data_entrada_agendamento);
CREATE INDEX IF NOT EXISTS idx_leads_data_hora_agendamento_bposs ON public.leads(data_hora_agendamento_bposs);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_origem ON public.leads(origem);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at);

-- 4. Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. Criar trigger para atualizar updated_at automaticamente
DROP TRIGGER IF EXISTS update_leads_updated_at ON public.leads;
CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Habilitar RLS (Row Level Security)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 7. Criar políticas de RLS (ajuste conforme suas necessidades de segurança)
CREATE POLICY "Enable read access for all users" ON public.leads
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.leads
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON public.leads
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON public.leads
    FOR DELETE USING (auth.role() = 'authenticated');

-- 8. Verificar se a tabela foi criada corretamente
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'leads'
ORDER BY ordinal_position;

-- Script concluído!
-- Após executar este script, você pode usar o script import-csv-data.cjs para importar os dados do CSV.