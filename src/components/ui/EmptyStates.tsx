import React from 'react';
import { cn } from '../../lib/utils';
import { 
  Search, 
  Users, 
  ShoppingCart, 
  Mail, 
  Calendar, 
  Image, 
  Database,
  Wifi,
  AlertCircle,
  Plus,
  RefreshCw,
  ArrowRight
} from 'lucide-react';

interface EmptyStateProps {
  variant?: 'search' | 'data' | 'users' | 'cart' | 'messages' | 'calendar' | 'media' | 'error' | 'offline' | 'maintenance';
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  illustration?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  variant = 'data',
  title,
  description,
  action,
  secondaryAction,
  illustration,
  className
}) => {
  const getIllustration = () => {
    if (illustration) return illustration;

    const iconProps = {
      className: "w-16 h-16 text-white/40",
      strokeWidth: 1.5
    };

    switch (variant) {
      case 'search':
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl" />
            <Search {...iconProps} className="relative w-16 h-16 text-blue-400" />
          </div>
        );
      case 'users':
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-xl" />
            <Users {...iconProps} className="relative w-16 h-16 text-green-400" />
          </div>
        );
      case 'cart':
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-xl" />
            <ShoppingCart {...iconProps} className="relative w-16 h-16 text-orange-400" />
          </div>
        );
      case 'messages':
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-full blur-xl" />
            <Mail {...iconProps} className="relative w-16 h-16 text-pink-400" />
          </div>
        );
      case 'calendar':
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-full blur-xl" />
            <Calendar {...iconProps} className="relative w-16 h-16 text-indigo-400" />
          </div>
        );
      case 'media':
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl" />
            <Image {...iconProps} className="relative w-16 h-16 text-purple-400" />
          </div>
        );
      case 'error':
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-xl" />
            <AlertCircle {...iconProps} className="relative w-16 h-16 text-red-400" />
          </div>
        );
      case 'offline':
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-500/20 to-slate-500/20 rounded-full blur-xl" />
            <Wifi {...iconProps} className="relative w-16 h-16 text-gray-400" />
          </div>
        );
      case 'maintenance':
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-xl" />
            <RefreshCw {...iconProps} className="relative w-16 h-16 text-yellow-400 animate-spin" />
          </div>
        );
      default:
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-neon-500/20 to-cyan-500/20 rounded-full blur-xl" />
            <Database {...iconProps} className="relative w-16 h-16 text-neon-400" />
          </div>
        );
    }
  };

  const getActionButtonClasses = (variant: string = 'primary') => {
    const baseClasses = 'px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2';
    
    switch (variant) {
      case 'primary':
        return cn(
          baseClasses,
          'bg-gradient-to-r from-neon-500 to-cyan-500',
          'text-navy-900 hover:from-neon-400 hover:to-cyan-400',
          'shadow-lg hover:shadow-neon-500/25',
          'transform hover:scale-105'
        );
      case 'secondary':
        return cn(
          baseClasses,
          'bg-white/10 text-white border border-white/20',
          'hover:bg-white/20 hover:border-white/30'
        );
      case 'outline':
        return cn(
          baseClasses,
          'border-2 border-neon-500/50 text-neon-400',
          'hover:border-neon-500 hover:bg-neon-500/10'
        );
      default:
        return cn(baseClasses, 'bg-gray-600 text-white hover:bg-gray-500');
    }
  };

  return (
    <div className={cn(
      'flex flex-col items-center justify-center',
      'text-center p-8 space-y-6',
      'min-h-[400px]',
      className
    )}>
      {/* Illustration */}
      <div className="flex justify-center mb-4">
        {getIllustration()}
      </div>

      {/* Content */}
      <div className="space-y-3 max-w-md">
        <h3 className="text-2xl font-bold text-white">
          {title}
        </h3>
        <p className="text-white/70 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          {action && (
            <button
              onClick={action.onClick}
              className={getActionButtonClasses(action.variant)}
            >
              <Plus className="w-4 h-4" />
              {action.label}
            </button>
          )}
          
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className={getActionButtonClasses('secondary')}
            >
              {secondaryAction.label}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Estados vazios pré-configurados
export const SearchEmptyState: React.FC<Omit<EmptyStateProps, 'variant' | 'title' | 'description'> & Partial<Pick<EmptyStateProps, 'title' | 'description'>>> = (props) => (
  <EmptyState
    variant="search"
    title={props.title || "Nenhum resultado encontrado"}
    description={props.description || "Não encontramos nada com esses termos. Tente ajustar sua pesquisa ou explorar outras opções."}
    {...props}
  />
);

export const DataEmptyState: React.FC<Omit<EmptyStateProps, 'variant' | 'title' | 'description'> & Partial<Pick<EmptyStateProps, 'title' | 'description'>>> = (props) => (
  <EmptyState
    variant="data"
    title={props.title || "Nenhum dado disponível"}
    description={props.description || "Ainda não há informações para exibir aqui. Comece adicionando alguns dados."}
    {...props}
  />
);

export const UsersEmptyState: React.FC<Omit<EmptyStateProps, 'variant' | 'title' | 'description'> & Partial<Pick<EmptyStateProps, 'title' | 'description'>>> = (props) => (
  <EmptyState
    variant="users"
    title={props.title || "Nenhum usuário encontrado"}
    description={props.description || "Sua equipe ainda está vazia. Convide pessoas para colaborar no seu projeto."}
    {...props}
  />
);

export const CartEmptyState: React.FC<Omit<EmptyStateProps, 'variant' | 'title' | 'description'> & Partial<Pick<EmptyStateProps, 'title' | 'description'>>> = (props) => (
  <EmptyState
    variant="cart"
    title={props.title || "Seu carrinho está vazio"}
    description={props.description || "Parece que você ainda não adicionou nada ao carrinho. Explore nossos produtos incríveis!"}
    {...props}
  />
);

export const MessagesEmptyState: React.FC<Omit<EmptyStateProps, 'variant' | 'title' | 'description'> & Partial<Pick<EmptyStateProps, 'title' | 'description'>>> = (props) => (
  <EmptyState
    variant="messages"
    title={props.title || "Nenhuma mensagem ainda"}
    description={props.description || "Sua caixa de entrada está limpa! Quando você receber mensagens, elas aparecerão aqui."}
    {...props}
  />
);

export const CalendarEmptyState: React.FC<Omit<EmptyStateProps, 'variant' | 'title' | 'description'> & Partial<Pick<EmptyStateProps, 'title' | 'description'>>> = (props) => (
  <EmptyState
    variant="calendar"
    title={props.title || "Nenhum evento agendado"}
    description={props.description || "Seu calendário está livre! Que tal agendar uma reunião ou criar um novo evento?"}
    {...props}
  />
);

export const MediaEmptyState: React.FC<Omit<EmptyStateProps, 'variant' | 'title' | 'description'> & Partial<Pick<EmptyStateProps, 'title' | 'description'>>> = (props) => (
  <EmptyState
    variant="media"
    title={props.title || "Nenhuma mídia encontrada"}
    description={props.description || "Ainda não há imagens ou vídeos aqui. Faça upload dos seus arquivos para começar."}
    {...props}
  />
);

export const ErrorEmptyState: React.FC<Omit<EmptyStateProps, 'variant' | 'title' | 'description'> & Partial<Pick<EmptyStateProps, 'title' | 'description'>>> = (props) => (
  <EmptyState
    variant="error"
    title={props.title || "Algo deu errado"}
    description={props.description || "Encontramos um problema inesperado. Nossa equipe foi notificada e está trabalhando na solução."}
    {...props}
  />
);

export const OfflineEmptyState: React.FC<Omit<EmptyStateProps, 'variant' | 'title' | 'description'> & Partial<Pick<EmptyStateProps, 'title' | 'description'>>> = (props) => (
  <EmptyState
    variant="offline"
    title={props.title || "Você está offline"}
    description={props.description || "Verifique sua conexão com a internet e tente novamente. Alguns recursos podem não estar disponíveis."}
    {...props}
  />
);

export const MaintenanceEmptyState: React.FC<Omit<EmptyStateProps, 'variant' | 'title' | 'description'> & Partial<Pick<EmptyStateProps, 'title' | 'description'>>> = (props) => (
  <EmptyState
    variant="maintenance"
    title={props.title || "Em manutenção"}
    description={props.description || "Estamos fazendo algumas melhorias! O sistema estará disponível novamente em breve."}
    {...props}
  />
);

// Componente de demonstração
interface EmptyStatesShowcaseProps {
  className?: string;
}

export const EmptyStatesShowcase: React.FC<EmptyStatesShowcaseProps> = ({ className }) => {
  const states = [
    {
      component: SearchEmptyState,
      title: "Pesquisa",
      action: { label: "Nova Pesquisa", onClick: () => console.log('Nova pesquisa') }
    },
    {
      component: DataEmptyState,
      title: "Dados",
      action: { label: "Adicionar Dados", onClick: () => console.log('Adicionar dados') }
    },
    {
      component: UsersEmptyState,
      title: "Usuários",
      action: { label: "Convidar Usuários", onClick: () => console.log('Convidar usuários') }
    },
    {
      component: CartEmptyState,
      title: "Carrinho",
      action: { label: "Explorar Produtos", onClick: () => console.log('Explorar produtos') }
    },
    {
      component: MessagesEmptyState,
      title: "Mensagens",
      action: { label: "Enviar Mensagem", onClick: () => console.log('Enviar mensagem') }
    },
    {
      component: CalendarEmptyState,
      title: "Calendário",
      action: { label: "Criar Evento", onClick: () => console.log('Criar evento') }
    }
  ];

  return (
    <div className={cn('space-y-12', className)}>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          Estados Vazios com Personalidade
        </h2>
        <p className="text-white/70 max-w-2xl mx-auto">
          Cada estado vazio foi cuidadosamente projetado para manter o engajamento do usuário
          e fornecer orientações claras sobre os próximos passos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {states.map(({ component: Component, title, action }, index) => (
          <div key={index} className="bg-navy-800/50 rounded-xl border border-white/10 overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <h3 className="font-semibold text-white">{title}</h3>
            </div>
            <div className="p-4">
              <Component action={action} className="min-h-[300px]" />
            </div>
          </div>
        ))}
      </div>

      {/* Estados especiais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-900/20 rounded-xl border border-red-500/20 overflow-hidden">
          <div className="p-4 border-b border-red-500/20">
            <h3 className="font-semibold text-red-400">Estado de Erro</h3>
          </div>
          <ErrorEmptyState 
            action={{ label: "Tentar Novamente", onClick: () => console.log('Tentar novamente') }}
            className="min-h-[250px]"
          />
        </div>

        <div className="bg-gray-900/20 rounded-xl border border-gray-500/20 overflow-hidden">
          <div className="p-4 border-b border-gray-500/20">
            <h3 className="font-semibold text-gray-400">Estado Offline</h3>
          </div>
          <OfflineEmptyState 
            action={{ label: "Reconectar", onClick: () => console.log('Reconectar') }}
            className="min-h-[250px]"
          />
        </div>

        <div className="bg-yellow-900/20 rounded-xl border border-yellow-500/20 overflow-hidden">
          <div className="p-4 border-b border-yellow-500/20">
            <h3 className="font-semibold text-yellow-400">Manutenção</h3>
          </div>
          <MaintenanceEmptyState 
            secondaryAction={{ label: "Status da Manutenção", onClick: () => console.log('Status') }}
            className="min-h-[250px]"
          />
        </div>
      </div>
    </div>
  );
};

export default {
  EmptyState,
  SearchEmptyState,
  DataEmptyState,
  UsersEmptyState,
  CartEmptyState,
  MessagesEmptyState,
  CalendarEmptyState,
  MediaEmptyState,
  ErrorEmptyState,
  OfflineEmptyState,
  MaintenanceEmptyState,
  EmptyStatesShowcase
};