import React, { useState } from 'react'
import { Database, Upload, Trash2, CheckCircle, AlertCircle } from 'lucide-react'
import { seedDatabase, clearAndSeedDatabase } from '../utils/seedData'

export const DatabaseManager: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSeedDatabase = async () => {
    setLoading(true)
    setMessage(null)
    
    try {
      await seedDatabase()
      setMessage({ type: 'success', text: 'Banco de dados populado com sucesso!' })
    } catch {
      setMessage({ type: 'error', text: 'Erro ao popular banco de dados. Verifique se está conectado ao Supabase.' })
    } finally {
      setLoading(false)
    }
  }

  const handleClearDatabase = async () => {
    if (!window.confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
      return
    }
    
    setLoading(true)
    setMessage(null)
    
    try {
      const result = await clearAndSeedDatabase()
      setMessage({ type: result.success ? 'success' : 'error', text: result.message })
    } catch (error) {
      setMessage({ type: 'error', text: `Erro ao recriar dados: ${error instanceof Error ? error.message : 'Erro desconhecido'}` })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Database className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Gerenciamento do Banco</h3>
      </div>
      
      <p className="text-gray-600 mb-6">
        Use estas opções para popular o banco com dados de exemplo ou limpar todos os dados.
      </p>
      
      {message && (
        <div className={`mb-4 p-4 rounded-md flex items-center space-x-2 ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-500" />
          )}
          <span className={`text-sm ${
            message.type === 'success' ? 'text-green-700' : 'text-red-700'
          }`}>
            {message.text}
          </span>
        </div>
      )}
      
      <div className="flex space-x-4">
        <button
          onClick={handleSeedDatabase}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Upload className="h-4 w-4" />
          )}
          <span>Popular com Dados de Exemplo</span>
        </button>
        
        <button
          onClick={handleClearDatabase}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          <span>Limpar Banco</span>
        </button>
      </div>
      
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-sm text-yellow-700">
          <strong>Nota:</strong> Para usar o banco de dados real, certifique-se de que:
          <br />• As variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão configuradas
          <br />• O projeto Supabase está ativo e acessível
          <br />• A tabela 'leads' foi criada no banco
        </p>
      </div>
    </div>
  )
}