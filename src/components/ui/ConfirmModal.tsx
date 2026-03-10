import { X, AlertTriangle } from 'lucide-react';

/**
 * Props du composant ConfirmModal
 */
interface ConfirmModalProps {
  /**
   * État d'ouverture de la modale
   */
  isOpen: boolean;
  
  /**
   * Callback pour fermer la modale
   */
  onClose: () => void;
  
  /**
   * Callback de confirmation
   */
  onConfirm: () => void;
  
  /**
   * Titre de la modale
   */
  title: string;
  
  /**
   * Message de confirmation
   */
  message: string;
  
  /**
   * Si true, affiche le bouton de confirmation en rouge (danger)
   * @default true
   */
  isDanger?: boolean;
}

/**
 * Composant ConfirmModal
 * Modale de confirmation pour les actions destructives (suppression, etc.)
 * 
 * Design : Moderne & Épuré
 * - Plus petite que la Modal classique
 * - Bouton "Annuler" (Gris) et "Confirmer" ou "Supprimer" (Rouge si isDanger)
 * - Icône d'avertissement en haut
 */
export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isDanger = true
}: ConfirmModalProps) {
  if (!isOpen) return null;

  /**
   * Gère la confirmation et ferme la modale
   */
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  /**
   * Empêche la fermeture lors du clic sur le contenu
   */
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      {/* Contenu de la modale */}
      <div
        className="w-full max-w-md rounded-xl shadow-2xl"
        style={{ backgroundColor: '#FFFFFF' }}
        onClick={handleContentClick}
      >
        {/* Header avec icône d'avertissement */}
        <div className="flex flex-col items-center p-6 pb-4">
          {/* Icône d'avertissement */}
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
            style={{ 
              backgroundColor: isDanger ? '#FEE2E2' : '#EEF2FF'
            }}
          >
            <AlertTriangle
              className="w-7 h-7"
              style={{ 
                color: isDanger ? '#EF4444' : '#4F46E5'
              }}
            />
          </div>

          {/* Titre */}
          <h3
            className="text-xl font-semibold mb-2 text-center"
            style={{ color: '#111827' }}
          >
            {title}
          </h3>

          {/* Message */}
          <p
            className="text-sm text-center"
            style={{ color: '#6B7280' }}
          >
            {message}
          </p>
        </div>

        {/* Footer avec boutons */}
        <div className="flex gap-3 p-6 pt-4 border-t" style={{ borderColor: '#E5E7EB' }}>
          {/* Bouton Annuler */}
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors text-sm"
            style={{
              backgroundColor: '#F3F4F6',
              color: '#6B7280'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#E5E7EB';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#F3F4F6';
            }}
          >
            Annuler
          </button>

          {/* Bouton Confirmer/Supprimer */}
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors text-sm"
            style={{
              backgroundColor: isDanger ? '#EF4444' : '#4F46E5',
              color: '#FFFFFF'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDanger ? '#DC2626' : '#4338CA';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isDanger ? '#EF4444' : '#4F46E5';
            }}
          >
            {isDanger ? 'Supprimer' : 'Confirmer'}
          </button>
        </div>
      </div>
    </div>
  );
}
