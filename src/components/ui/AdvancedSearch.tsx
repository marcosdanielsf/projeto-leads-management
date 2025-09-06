'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { cn } from '../../lib/utils';

// Tipos de filtros
export type FilterType = 'text' | 'select' | 'multiselect' | 'date' | 'daterange' | 'number' | 'boolean' | 'tags';

// Interface para opções de filtro
export interface FilterOption {
  value: string | number | boolean;
  label: string;
  count?: number;
}

// Interface para configuração de filtro
export interface FilterConfig {
  key: string;
  label: string;
  type: FilterType;
  options?: FilterOption[];
  placeholder?: string;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
}

// Interface para valores de filtro
export type FilterValue = string | number | boolean | string[] | number[] | Date | [Date, Date] | null;

// Interface para estado de filtros
export interface FilterState {
  [key: string]: FilterValue;
}

// Interface para configuração de ordenação
export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

// Interface para resultado de pesquisa
export interface SearchResult<T = Record<string, unknown>> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Hook para pesquisa avançada
export const useAdvancedSearch = <T extends Record<string, unknown>>(
  data: T[],
  filterConfigs: FilterConfig[],
  searchFields: (keyof T)[],
  initialPageSize: number = 10
) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({});
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Função para aplicar filtros
  const applyFilters = useCallback((items: T[], filterState: FilterState): T[] => {
    return items.filter(item => {
      return Object.entries(filterState).every(([key, value]) => {
        if (value === null || value === undefined || value === '') return true;
        
        const filterConfig = filterConfigs.find(config => config.key === key);
        if (!filterConfig) return true;
        
        const itemValue = item[key];
        
        switch (filterConfig.type) {
          case 'text':
            return String(itemValue).toLowerCase().includes(String(value).toLowerCase());
          
          case 'select':
            return itemValue === value;
          
          case 'multiselect': {
            if (Array.isArray(value) && value.length === 0) return true;
            const itemValueStr = String(itemValue);
            return Array.isArray(value) ? value.map(String).includes(itemValueStr) : itemValueStr === String(value);
          }
          
          case 'boolean': {
            return itemValue === value;
          }
          
          case 'number': {
            return Number(itemValue) === Number(value);
          }
          
          case 'date': {
            if (value instanceof Date) {
              const itemDateValue = itemValue;
              if (typeof itemDateValue === 'string' || typeof itemDateValue === 'number' || itemDateValue instanceof Date) {
                const itemDate = new Date(itemDateValue);
                return itemDate.toDateString() === value.toDateString();
              }
            }
            return true;
          }
          
          case 'daterange': {
            if (Array.isArray(value) && value.length === 2) {
              const itemDateValue = itemValue;
              if (typeof itemDateValue === 'string' || typeof itemDateValue === 'number' || itemDateValue instanceof Date) {
                const itemDate = new Date(itemDateValue);
                const [start, end] = value;
                return itemDate >= start && itemDate <= end;
              }
            }
            return true;
          }
          
          case 'tags': {
            if (Array.isArray(value) && value.length === 0) return true;
            if (Array.isArray(itemValue) && Array.isArray(value)) {
              return value.some(tag => itemValue.includes(tag));
            }
            return true;
          }
          
          default: {
            return true;
          }
        }
      });
    });
  }, [filterConfigs]);

  // Função para aplicar pesquisa de texto
  const applyTextSearch = useCallback((items: T[], query: string): T[] => {
    if (!query.trim()) return items;
    
    const lowerQuery = query.toLowerCase();
    return items.filter(item => {
      return searchFields.some(field => {
        const value = item[field];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(lowerQuery);
      });
    });
  }, [searchFields]);

  // Função para aplicar ordenação
  const applySorting = useCallback((items: T[], sort: SortConfig | null): T[] => {
    if (!sort) return items;
    
    return [...items].sort((a, b) => {
      const aValue = a[sort.key];
      const bValue = b[sort.key];
      
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      let comparison = 0;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime();
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }
      
      return sort.direction === 'desc' ? -comparison : comparison;
    });
  }, []);

  // Resultado filtrado e paginado
  const result = useMemo((): SearchResult<T> => {
    let filteredItems = applyTextSearch(data, searchQuery);
    filteredItems = applyFilters(filteredItems, filters);
    filteredItems = applySorting(filteredItems, sortConfig);
    
    const total = filteredItems.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const items = filteredItems.slice(startIndex, endIndex);
    
    return {
      items,
      total,
      page: currentPage,
      pageSize,
      totalPages
    };
  }, [data, searchQuery, filters, sortConfig, currentPage, pageSize, applyTextSearch, applyFilters, applySorting]);

  // Funções de controle
  const updateFilter = useCallback((key: string, value: FilterValue) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset para primeira página
  }, []);

  const clearFilter = useCallback((key: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
    setCurrentPage(1);
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({});
    setSearchQuery('');
    setCurrentPage(1);
  }, []);

  const updateSort = useCallback((key: string) => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        return prev.direction === 'asc' 
          ? { key, direction: 'desc' }
          : null;
      }
      return { key, direction: 'asc' };
    });
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    filters,
    updateFilter,
    clearFilter,
    clearAllFilters,
    sortConfig,
    updateSort,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    result,
    hasActiveFilters: Object.keys(filters).length > 0 || searchQuery.length > 0
  };
};

// Componente de campo de pesquisa
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Pesquisar...',
  className
}) => {
  return (
    <div className={cn('relative', className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

// Componente de filtro individual
interface FilterComponentProps {
  config: FilterConfig;
  value: FilterValue;
  onChange: (value: FilterValue) => void;
  onClear: () => void;
}

export const FilterComponent: React.FC<FilterComponentProps> = ({
  config,
  value,
  onChange,
  onClear
}) => {
  const renderFilter = () => {
    switch (config.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value as string || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={config.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        );
      
      case 'select':
        return (
          <select
            value={value as string || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">{config.placeholder || 'Selecione...'}</option>
            {config.options?.map((option) => (
              <option key={String(option.value)} value={String(option.value)}>
                {option.label} {option.count && `(${option.count})`}
              </option>
            ))}
          </select>
        );
      
      case 'multiselect': {
        const selectedValues = Array.isArray(value) ? value.map(String) : [];
        return (
          <div className="space-y-2">
            {config.options?.map((option) => (
              <label key={String(option.value)} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(String(option.value))}
                  onChange={(e) => {
                    const optionValueStr = String(option.value);
                    const newValues = e.target.checked
                      ? [...selectedValues, optionValueStr]
                      : selectedValues.filter(v => v !== optionValueStr);
                    onChange(newValues as FilterValue);
                  }}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">
                  {option.label} {option.count && `(${option.count})`}
                </span>
              </label>
            ))}
          </div>
        );
      }
      
      case 'boolean':
        return (
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name={config.key}
                checked={value === true}
                onChange={() => onChange(true)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">Sim</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name={config.key}
                checked={value === false}
                onChange={() => onChange(false)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">Não</span>
            </label>
          </div>
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={value as number || ''}
            onChange={(e) => onChange(Number(e.target.value))}
            placeholder={config.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          {config.label}
        </label>
        {config.clearable && value !== null && value !== undefined && value !== '' && (
          <button
            onClick={onClear}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Limpar
          </button>
        )}
      </div>
      {renderFilter()}
    </div>
  );
};

// Componente de painel de filtros
interface FilterPanelProps {
  configs: FilterConfig[];
  filters: FilterState;
  onFilterChange: (key: string, value: FilterValue) => void;
  onFilterClear: (key: string) => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
  className?: string;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  configs,
  filters,
  onFilterChange,
  onFilterClear,
  onClearAll,
  hasActiveFilters,
  className
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Limpar todos
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        {configs.map((config) => (
          <FilterComponent
            key={config.key}
            config={config}
            value={filters[config.key]}
            onChange={(value) => onFilterChange(config.key, value)}
            onClear={() => onFilterClear(config.key)}
          />
        ))}
      </div>
    </div>
  );
};

// Componente de paginação
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  total: number;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  total,
  className
}) => {
  const pageSizeOptions = [10, 25, 50, 100];
  
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, total);

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-700">
          Mostrando {startItem} a {endItem} de {total} resultados
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Itens por página:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Anterior
        </button>
        
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const page = i + 1;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                'px-3 py-1 border text-sm rounded',
                currentPage === page
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 hover:bg-gray-50'
              )}
            >
              {page}
            </button>
          );
        })}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Próximo
        </button>
      </div>
    </div>
  );
};

// Componente de demonstração
export const AdvancedSearchDemo: React.FC = () => {
  // Dados de exemplo
  const sampleData = [
    { id: 1, name: 'João Silva', email: 'joao@exemplo.com', role: 'admin', active: true, created: new Date('2023-01-15'), score: 95 },
    { id: 2, name: 'Maria Santos', email: 'maria@exemplo.com', role: 'user', active: true, created: new Date('2023-02-20'), score: 87 },
    { id: 3, name: 'Pedro Costa', email: 'pedro@exemplo.com', role: 'editor', active: false, created: new Date('2023-03-10'), score: 92 },
    { id: 4, name: 'Ana Oliveira', email: 'ana@exemplo.com', role: 'user', active: true, created: new Date('2023-04-05'), score: 78 },
    { id: 5, name: 'Carlos Ferreira', email: 'carlos@exemplo.com', role: 'admin', active: true, created: new Date('2023-05-12'), score: 89 }
  ];

  // Configuração dos filtros
  const filterConfigs: FilterConfig[] = [
    {
      key: 'role',
      label: 'Função',
      type: 'select',
      options: [
        { value: 'admin', label: 'Administrador', count: 2 },
        { value: 'editor', label: 'Editor', count: 1 },
        { value: 'user', label: 'Usuário', count: 2 }
      ],
      placeholder: 'Selecione uma função'
    },
    {
      key: 'active',
      label: 'Status',
      type: 'boolean'
    },
    {
      key: 'score',
      label: 'Pontuação Mínima',
      type: 'number',
      placeholder: 'Ex: 80'
    }
  ];

  const {
    searchQuery,
    setSearchQuery,
    filters,
    updateFilter,
    clearFilter,
    clearAllFilters,
    sortConfig,
    updateSort,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    result,
    hasActiveFilters
  } = useAdvancedSearch(sampleData, filterConfigs, ['name', 'email']);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Sistema de Pesquisa Avançada
        </h2>
        <p className="text-gray-600">
          Pesquisa, filtragem e ordenação inteligente de dados
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <FilterPanel
            configs={filterConfigs}
            filters={filters}
            onFilterChange={updateFilter}
            onFilterClear={clearFilter}
            onClearAll={clearAllFilters}
            hasActiveFilters={hasActiveFilters}
            className="bg-white p-4 rounded-lg border border-gray-200"
          />
        </div>

        <div className="lg:col-span-3 space-y-4">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Pesquisar por nome ou email..."
          />

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['name', 'email', 'role', 'active', 'score', 'created'].map((key) => (
                      <th
                        key={key}
                        onClick={() => updateSort(key)}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        <div className="flex items-center space-x-1">
                          <span>
                            {key === 'name' && 'Nome'}
                            {key === 'email' && 'Email'}
                            {key === 'role' && 'Função'}
                            {key === 'active' && 'Status'}
                            {key === 'score' && 'Pontuação'}
                            {key === 'created' && 'Criado em'}
                          </span>
                          {sortConfig?.key === key && (
                            <span className="text-blue-600">
                              {sortConfig.direction === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {result.items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn(
                          'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                          item.role === 'admin' && 'bg-red-100 text-red-800',
                          item.role === 'editor' && 'bg-green-100 text-green-800',
                          item.role === 'user' && 'bg-blue-100 text-blue-800'
                        )}>
                          {item.role === 'admin' && 'Administrador'}
                          {item.role === 'editor' && 'Editor'}
                          {item.role === 'user' && 'Usuário'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn(
                          'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                          item.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        )}>
                          {item.active ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.score}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.created.toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {result.items.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum resultado encontrado</h3>
                  <p className="mt-1 text-sm text-gray-500">Tente ajustar seus filtros ou termo de pesquisa.</p>
                </div>
              </div>
            )}
          </div>

          {result.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={result.totalPages}
              onPageChange={setCurrentPage}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
              total={result.total}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearchDemo;