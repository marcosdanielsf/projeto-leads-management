import React, { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, Filter } from 'lucide-react'
import { LeadsService } from '../../services/leadsService'
import { Lead } from '../../lib/supabase'

const LeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStage, setFilterStage] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [formData, setFormData] = useState<Partial<Lead>>({})

  useEffect(() => {
    loadLeads()
  }, [])

  const loadLeads = async () => {
    try {
      setLoading(true)
      const data = await LeadsService.getAllLeads()
      setLeads(data)
    } catch (error) {
      console.error('Erro ao carregar leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      if (editingLead) {
        await LeadsService.updateLead(editingLead.id, formData)
      } else {
        await LeadsService.createLead(formData as Omit<Lead, 'id' | 'created_at' | 'updated_at'>)
      }
      await loadLeads()
      setShowModal(false)
      setEditingLead(null)
      setFormData({})
    } catch (error) {
      console.error('Erro ao salvar lead:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar este lead?')) {
      try {
        await LeadsService.deleteLead(id)
        await loadLeads()
      } catch (error) {
        console.error('Erro ao deletar lead:', error)
      }
    }
  }

  const openModal = (lead?: Lead) => {
    if (lead) {
      setEditingLead(lead)
      setFormData(lead)
    } else {
      setEditingLead(null)
      setFormData({
        usuario_responsavel: '',
        contato_principal: '',
        fonte_lead: '',
        etapa_funil: 'lead qualificado',
        estado_contato: '',
        permissao_trabalho: 'Não',
        email_comercial: '',
        telefone_comercial: ''
      })
    }
    setShowModal(true)
  }

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.contato_principal?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email_comercial?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStage = !filterStage || lead.etapa_funil === filterStage
    return matchesSearch && matchesStage
  })

  const stages = [...new Set(leads.map(lead => lead.etapa_funil))]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Leads</h1>
          <p className="text-gray-600 mt-1">Visualize e gerencie todos os leads do sistema</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Lead</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="md:w-64">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                value={filterStage}
                onChange={(e) => setFilterStage(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="">Todas as etapas</option>
                {stages.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Leads */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Responsável
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Etapa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permissão
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{lead.contato_principal}</div>
                      <div className="text-sm text-gray-500">{lead.email_comercial}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {lead.usuario_responsavel}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      lead.etapa_funil === 'meeting realizado' ? 'bg-green-100 text-green-800' :
                      lead.etapa_funil === 'lead qualificado' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {lead.etapa_funil}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {lead.estado_contato}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      lead.permissao_trabalho === 'Sim' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {lead.permissao_trabalho}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openModal(lead)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(lead.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Edição/Criação */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingLead ? 'Editar Lead' : 'Novo Lead'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contato Principal *
                </label>
                <input
                  type="text"
                  value={formData.contato_principal || ''}
                  onChange={(e) => setFormData({...formData, contato_principal: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Responsável *
                </label>
                <input
                  type="text"
                  value={formData.usuario_responsavel || ''}
                  onChange={(e) => setFormData({...formData, usuario_responsavel: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email_comercial || ''}
                  onChange={(e) => setFormData({...formData, email_comercial: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={formData.telefone_comercial || ''}
                  onChange={(e) => setFormData({...formData, telefone_comercial: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Etapa do Funil *
                </label>
                <select
                  value={formData.etapa_funil || ''}
                  onChange={(e) => setFormData({...formData, etapa_funil: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="lead qualificado">Lead Qualificado</option>
                  <option value="agendamento">Agendamento</option>
                  <option value="meeting realizado">Meeting Realizado</option>
                  <option value="proposta enviada">Proposta Enviada</option>
                  <option value="fechamento">Fechamento</option>
                  <option value="lead não qualificado">Lead Não Qualificado</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <input
                  type="text"
                  value={formData.estado_contato || ''}
                onChange={(e) => setFormData({...formData, estado_contato: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: SP, RJ, MG"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Permissão de Trabalho *
                </label>
                <select
                  value={formData.permissao_trabalho || ''}
                  onChange={(e) => setFormData({...formData, permissao_trabalho: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="Não">Não</option>
                  <option value="Sim">Sim</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fonte do Lead
                </label>
                <input
                  type="text"
                  value={formData.fonte_lead || ''}
                  onChange={(e) => setFormData({...formData, fonte_lead: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Website, Facebook, Google Ads"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {editingLead ? 'Atualizar' : 'Criar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LeadsPage