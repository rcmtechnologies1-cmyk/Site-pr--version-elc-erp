import { toast as sonnerToast } from 'sonner';

/**
 * Utilitaires pour afficher des notifications Toast
 * Wrapper autour de Sonner pour une API simplifiée
 */
export const toast = {
  /**
   * Toast de succès (bordure verte)
   */
  success: (message: string) => {
    sonnerToast.success(message, {
      icon: '✅',
    });
  },

  /**
   * Toast d'erreur (bordure rouge)
   */
  error: (message: string) => {
    sonnerToast.error(message, {
      icon: '❌',
    });
  },

  /**
   * Toast d'information (bordure bleue)
   */
  info: (message: string) => {
    sonnerToast.info(message, {
      icon: 'ℹ️',
    });
  },

  /**
   * Toast d'avertissement (bordure orange)
   */
  warning: (message: string) => {
    sonnerToast.warning(message, {
      icon: '⚠️',
    });
  },

  /**
   * Toast personnalisé
   */
  custom: (message: string, options?: any) => {
    sonnerToast(message, options);
  },
};
