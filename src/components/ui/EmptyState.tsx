import type { LucideIcon } from 'lucide-react';

/**
 * Props du composant EmptyState
 */
interface EmptyStateProps {
  /**
   * Icône à afficher (Lucide React)
   */
  icon: LucideIcon;
  
  /**
   * Titre principal de l'état vide
   */
  title: string;
  
  /**
   * Description secondaire (optionnelle)
   */
  description?: string;
  
  /**
   * Label du bouton d'action (optionnel)
   */
  actionLabel?: string;
  
  /**
   * Callback pour l'action (optionnel)
   */
  onAction?: () => void;
}

/**
 * Composant EmptyState
 * Affiche un état vide élégant avec une icône, du texte et un bouton d'action
 * 
 * Design : Moderne & Épuré
 * - Icône grise centrée
 * - Texte hiérarchisé (titre + description)
 * - Bouton d'action en dessous (optionnel)
 */
export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {/* Icône */}
      <div 
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{ backgroundColor: '#F3F4F6' }}
      >
        <Icon className="w-8 h-8" style={{ color: '#9CA3AF' }} />
      </div>

      {/* Titre */}
      <h3 
        className="text-lg font-semibold mb-2 text-center"
        style={{ color: '#111827' }}
      >
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p 
          className="text-sm text-center mb-6 max-w-md"
          style={{ color: '#6B7280' }}
        >
          {description}
        </p>
      )}

      {/* Bouton d'action */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-lg font-medium transition-colors text-sm"
          style={{ 
            backgroundColor: '#4F46E5',
            color: '#FFFFFF'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#4338CA';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#4F46E5';
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
