import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Hook para gerenciar acesso público com paywall
export function usePublicAccess() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isAuthenticated = !!session?.user;
  const isLoading = status === 'loading';

  // Função para verificar se o usuário pode fazer download
  const canDownload = () => {
    return isAuthenticated;
  };

  // Função para redirecionar para login quando necessário
  const requireAuthForAction = (action: 'download' | 'save' | 'upgrade', redirectPath?: string) => {
    if (!isAuthenticated) {
      const currentPath = window.location.pathname;
      const redirectUrl = redirectPath || currentPath;
      
      // Armazenar a ação que o usuário estava tentando fazer
      sessionStorage.setItem('pendingAction', JSON.stringify({
        action,
        redirectUrl,
        timestamp: Date.now()
      }));

      // Redirecionar para sign-in
      router.push(`/sign-in?redirect=${encodeURIComponent(redirectUrl)}&action=${action}`);
      return false;
    }
    return true;
  };

  // Função para obter limite de downloads gratuitos
  const getFreeDownloadLimit = () => {
    const user = session?.user as any;
    
    if (user?.plan === 'pro' || user?.plan === 'enterprise') {
      return { hasLimit: false, remaining: -1, total: -1 };
    }
    
    // Usuários free têm limite de 3 downloads
    const limit = 3;
    const used = user?.downloadsUsed || 0;
    const remaining = Math.max(0, limit - used);
    
    return { 
      hasLimit: true, 
      remaining, 
      total: limit, 
      used,
      canDownload: remaining > 0 
    };
  };

  // Função para verificar se precisa de upgrade
  const needsUpgrade = () => {
    if (!isAuthenticated) return false;
    
    const { hasLimit, canDownload } = getFreeDownloadLimit();
    return hasLimit && !canDownload;
  };

  return {
    isAuthenticated,
    isLoading,
    canDownload,
    requireAuthForAction,
    getFreeDownloadLimit,
    needsUpgrade,
    user: session?.user
  };
}

// Tipos para o modal
export interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: 'download' | 'save' | 'upgrade';
  onSignIn: () => void;
  onSignUp: () => void;
}

// Mensagens para diferentes ações
export const getActionMessage = (action: 'download' | 'save' | 'upgrade') => {
  const actionMessages = {
    download: {
      title: 'Download Your CV/Letter',
      description: 'Create a free account to download your professionally crafted CV or cover letter.',
      cta: 'Sign up for free downloads'
    },
    save: {
      title: 'Save Your Progress', 
      description: 'Create an account to save your work and access it from anywhere.',
      cta: 'Sign up to save'
    },
    upgrade: {
      title: 'Unlock Unlimited Downloads',
      description: 'You\'ve reached your free download limit. Upgrade to Pro for unlimited downloads.',
      cta: 'Upgrade to Pro'
    }
  };

  return actionMessages[action];
};
