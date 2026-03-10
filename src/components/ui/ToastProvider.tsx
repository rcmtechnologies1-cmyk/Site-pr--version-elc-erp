import { Toaster } from 'sonner';

/**
 * Provider pour les notifications Toast
 * Utilise Sonner (déjà installé) avec un design personnalisé
 * 
 * Design : Moderne, fond blanc, ombre portée, bordure gauche colorée
 * - Vert pour succès
 * - Rouge pour erreur
 * - Bleu pour info
 */
export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        style: {
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderLeft: '4px solid currentColor',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          padding: '16px',
          fontSize: '14px',
          color: '#111827',
        },
        classNames: {
          success: 'border-l-[#10B981]',
          error: 'border-l-[#EF4444]',
          info: 'border-l-[#4F46E5]',
          warning: 'border-l-[#F59E0B]',
        },
      }}
    />
  );
}
