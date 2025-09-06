'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { cn } from '../../lib/utils';

// Tipos de permissões
export type Permission = 
  | 'read' | 'write' | 'delete' | 'admin'
  | 'user.create' | 'user.edit' | 'user.delete' | 'user.view'
  | 'content.create' | 'content.edit' | 'content.delete' | 'content.publish'
  | 'analytics.view' | 'analytics.export'
  | 'settings.view' | 'settings.edit'
  | 'billing.view' | 'billing.edit';

// Tipos de funções
export type Role = 'guest' | 'user' | 'editor' | 'admin' | 'super_admin';

// Interface do usuário
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  permissions: Permission[];
  avatar?: string;
  isActive: boolean;
}

// Mapeamento de permissões por função
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  guest: ['read'],
  user: ['read', 'content.create', 'user.view'],
  editor: [
    'read', 'write', 
    'content.create', 'content.edit', 'content.publish',
    'user.view', 'analytics.view'
  ],
  admin: [
    'read', 'write', 'delete',
    'user.create', 'user.edit', 'user.view',
    'content.create', 'content.edit', 'content.delete', 'content.publish',
    'analytics.view', 'analytics.export',
    'settings.view', 'settings.edit',
    'billing.view'
  ],
  super_admin: [
    'read', 'write', 'delete', 'admin',
    'user.create', 'user.edit', 'user.delete', 'user.view',
    'content.create', 'content.edit', 'content.delete', 'content.publish',
    'analytics.view', 'analytics.export',
    'settings.view', 'settings.edit',
    'billing.view', 'billing.edit'
  ]
};

// Context de permissões
interface PermissionContextType {
  user: User | null;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: Role) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  setUser: (user: User | null) => void;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

// Provider de permissões
export const PermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const hasPermission = (permission: Permission): boolean => {
    if (!user || !user.isActive) return false;
    return user.permissions.includes(permission) || ROLE_PERMISSIONS[user.role].includes(permission);
  };

  const hasRole = (role: Role): boolean => {
    if (!user || !user.isActive) return false;
    return user.role === role;
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  return (
    <PermissionContext.Provider value={{
      user,
      hasPermission,
      hasRole,
      hasAnyPermission,
      setUser
    }}>
      {children}
    </PermissionContext.Provider>
  );
};

// Hook para usar permissões
export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
};

// Componente de proteção por permissão
interface ProtectedProps {
  permission?: Permission;
  permissions?: Permission[];
  role?: Role;
  requireAll?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Protected: React.FC<ProtectedProps> = ({
  permission,
  permissions,
  role,
  requireAll = false,
  fallback = null,
  children,
  className
}) => {
  const { hasPermission, hasRole, hasAnyPermission } = usePermissions();

  let hasAccess = true;

  if (role && !hasRole(role)) {
    hasAccess = false;
  }

  if (permission && !hasPermission(permission)) {
    hasAccess = false;
  }

  if (permissions) {
    if (requireAll) {
      hasAccess = permissions.every(p => hasPermission(p));
    } else {
      hasAccess = hasAnyPermission(permissions);
    }
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return (
    <div className={cn(className)}>
      {children}
    </div>
  );
};

// Componente de badge de função
interface RoleBadgeProps {
  role: Role;
  className?: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, className }) => {
  const roleConfig = {
    guest: {
      label: 'Visitante',
      color: 'bg-gray-100 text-gray-700 border-gray-200'
    },
    user: {
      label: 'Usuário',
      color: 'bg-blue-100 text-blue-700 border-blue-200'
    },
    editor: {
      label: 'Editor',
      color: 'bg-green-100 text-green-700 border-green-200'
    },
    admin: {
      label: 'Admin',
      color: 'bg-purple-100 text-purple-700 border-purple-200'
    },
    super_admin: {
      label: 'Super Admin',
      color: 'bg-red-100 text-red-700 border-red-200'
    }
  };

  const config = roleConfig[role];

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
      config.color,
      className
    )}>
      {config.label}
    </span>
  );
};

// Componente de lista de permissões
interface PermissionListProps {
  permissions: Permission[];
  className?: string;
}

export const PermissionList: React.FC<PermissionListProps> = ({ permissions, className }) => {
  const permissionLabels: Record<Permission, string> = {
    'read': 'Leitura',
    'write': 'Escrita',
    'delete': 'Exclusão',
    'admin': 'Administração',
    'user.create': 'Criar Usuários',
    'user.edit': 'Editar Usuários',
    'user.delete': 'Excluir Usuários',
    'user.view': 'Visualizar Usuários',
    'content.create': 'Criar Conteúdo',
    'content.edit': 'Editar Conteúdo',
    'content.delete': 'Excluir Conteúdo',
    'content.publish': 'Publicar Conteúdo',
    'analytics.view': 'Visualizar Analytics',
    'analytics.export': 'Exportar Analytics',
    'settings.view': 'Visualizar Configurações',
    'settings.edit': 'Editar Configurações',
    'billing.view': 'Visualizar Faturamento',
    'billing.edit': 'Editar Faturamento'
  };

  return (
    <div className={cn('space-y-1', className)}>
      {permissions.map((permission) => (
        <div
          key={permission}
          className="flex items-center space-x-2 text-sm text-gray-600"
        >
          <div className="w-2 h-2 bg-green-400 rounded-full" />
          <span>{permissionLabels[permission]}</span>
        </div>
      ))}
    </div>
  );
};

// Componente de seletor de função
interface RoleSelectorProps {
  value: Role;
  onChange: (role: Role) => void;
  disabled?: boolean;
  className?: string;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  value,
  onChange,
  disabled = false,
  className
}) => {
  const roles: { value: Role; label: string; description: string }[] = [
    {
      value: 'guest',
      label: 'Visitante',
      description: 'Acesso apenas para visualização'
    },
    {
      value: 'user',
      label: 'Usuário',
      description: 'Pode criar e editar próprio conteúdo'
    },
    {
      value: 'editor',
      label: 'Editor',
      description: 'Pode gerenciar conteúdo e visualizar analytics'
    },
    {
      value: 'admin',
      label: 'Administrador',
      description: 'Controle total exceto configurações de sistema'
    },
    {
      value: 'super_admin',
      label: 'Super Administrador',
      description: 'Acesso completo a todas as funcionalidades'
    }
  ];

  return (
    <div className={cn('space-y-2', className)}>
      {roles.map((role) => (
        <label
          key={role.value}
          className={cn(
            'flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors',
            value === role.value
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <input
            type="radio"
            name="role"
            value={role.value}
            checked={value === role.value}
            onChange={(e) => onChange(e.target.value as Role)}
            disabled={disabled}
            className="mt-1 text-blue-600 focus:ring-blue-500"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">{role.label}</span>
              <RoleBadge role={role.value} />
            </div>
            <p className="text-sm text-gray-500 mt-1">{role.description}</p>
            <div className="mt-2">
              <PermissionList permissions={ROLE_PERMISSIONS[role.value]} />
            </div>
          </div>
        </label>
      ))}
    </div>
  );
};

// Componente de demonstração
export const PermissionDemo: React.FC = () => {
  const { user, setUser } = usePermissions();
  const [selectedRole, setSelectedRole] = useState<Role>('user');

  const demoUser: User = {
    id: '1',
    name: 'João Silva',
    email: 'joao@exemplo.com',
    role: selectedRole,
    permissions: [],
    isActive: true
  };

  useEffect(() => {
    setUser({ ...demoUser, role: selectedRole });
  }, [selectedRole]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Sistema de Permissões
        </h2>
        <p className="text-gray-600">
          Controle de acesso granular baseado em funções e permissões
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Selecionar Função</h3>
            <RoleSelector
              value={selectedRole}
              onChange={setSelectedRole}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Componentes Protegidos</h3>
            <div className="space-y-4">
              <Protected permission="admin">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-medium text-red-900">Área Administrativa</h4>
                  <p className="text-red-700 text-sm">Apenas administradores podem ver isso</p>
                </div>
              </Protected>

              <Protected permissions={['content.create', 'content.edit']}>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-900">Editor de Conteúdo</h4>
                  <p className="text-green-700 text-sm">Visível para editores e administradores</p>
                </div>
              </Protected>

              <Protected permission="analytics.view">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900">Analytics</h4>
                  <p className="text-blue-700 text-sm">Dados analíticos do sistema</p>
                </div>
              </Protected>

              <Protected 
                permission="billing.edit"
                fallback={
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-500">Faturamento (Bloqueado)</h4>
                    <p className="text-gray-400 text-sm">Você não tem permissão para acessar</p>
                  </div>
                }
              >
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-medium text-purple-900">Configurações de Faturamento</h4>
                  <p className="text-purple-700 text-sm">Gerenciar planos e pagamentos</p>
                </div>
              </Protected>
            </div>
          </div>

          {user && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Usuário Atual</h3>
              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{user.name}</h4>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <RoleBadge role={user.role} />
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Permissões:</h5>
                  <PermissionList permissions={ROLE_PERMISSIONS[user.role]} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PermissionDemo;