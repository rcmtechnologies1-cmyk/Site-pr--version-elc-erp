import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

// ============================================
// COMPOSANT UI : MODAL (MODALE)
// Fenêtre modale responsive avec overlay
// ============================================

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, maxWidth = 'md' }: ModalProps) {
  // Bloquer le scroll du body quand la modale est ouverte
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Fermer la modale avec la touche Échap
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Contenu de la modale */}
      <div 
        className={`relative bg-white rounded-lg shadow-xl w-full ${maxWidthClasses[maxWidth]} max-h-[90vh] overflow-hidden flex flex-col`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 
            id="modal-title" 
            className="text-xl font-semibold text-[#111827]"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-[#6B7280] hover:text-[#111827] transition-colors p-1 rounded-lg hover:bg-gray-100"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
