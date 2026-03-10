import { X } from 'lucide-react';
import { useEffect } from 'react';

// ============================================
// INTERFACES TYPESCRIPT
// ============================================

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

// ============================================
// COMPOSANT UI (DUMB COMPONENT)
// Modal réutilisable pour toute l'application
// ============================================

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // ============================================
  // EFFET: Bloquer le scroll du body quand la modal est ouverte
  // ============================================
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup au démontage
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // ============================================
  // HANDLER: Fermer la modal si on clique sur l'overlay
  // ============================================
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Fermer uniquement si on clique sur l'overlay, pas sur le contenu
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // ============================================
  // HANDLER: Fermer avec la touche Escape
  // ============================================
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // ============================================
  // RENDER
  // ============================================
  if (!isOpen) return null;

  return (
    // Overlay sombre semi-transparent
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(2px)'
      }}
      onClick={handleOverlayClick}
    >
      {/* Conteneur de la modal - Responsive */}
      <div
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        style={{
          animation: 'slideIn 0.2s ease-out'
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 sm:p-6 border-b"
          style={{ borderColor: '#E5E7EB' }}
        >
          <h2 
            className="text-lg sm:text-xl font-semibold"
            style={{ color: '#111827' }}
          >
            {title}
          </h2>

          {/* Bouton Fermer */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors hover:bg-gray-100"
            style={{ color: '#6B7280' }}
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </div>

      {/* Animation CSS inline */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}