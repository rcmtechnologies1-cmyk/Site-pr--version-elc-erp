import { useState, useEffect } from 'react';
import type { User } from '@/types';

// ============================================
// INTERFACES TYPESCRIPT
// ============================================

interface UserFormProps {
  initialValues?: Partial<User> | null;
  onSubmit: (data: Omit<User, 'id'>) => void;
  onCancel: () => void;
}

// ============================================
// COMPOSANT USERFORM (DUMB)
// Formulaire de création/édition d'utilisateur
// ============================================

export function UserForm({ initialValues, onSubmit, onCancel }: UserFormProps) {
  // ============================================
  // ÉTAT LOCAL
  // ============================================

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'SECRETAIRE' as User['role'],
    status: 'ACTIF' as User['status']
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ============================================
  // EFFET: Pré-remplissage en mode édition
  // ============================================

  useEffect(() => {
    if (initialValues) {
      setFormData({
        name: initialValues.name || '',
        email: initialValues.email || '',
        password: initialValues.password || '',
        role: initialValues.role || 'SECRETAIRE',
        status: initialValues.status || 'ACTIF'
      });
    }
  }, [initialValues]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Nettoyer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom complet est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.password.trim() && !initialValues) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    // Générer les initiales à partir du nom
    const nameParts = formData.name.trim().split(' ');
    const initials = nameParts
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);

    onSubmit({
      ...formData,
      initials
    });
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nom complet */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[#111827] mb-2">
          Nom Complet <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className={`
            w-full px-4 py-2.5 rounded-lg border transition-colors
            ${errors.name 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
              : 'border-[#E5E7EB] focus:border-[#4F46E5] focus:ring-[#E0E7FF]'
            }
            focus:outline-none focus:ring-2
          `}
          placeholder="Ex: Marie Dupont"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#111827] mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className={`
            w-full px-4 py-2.5 rounded-lg border transition-colors
            ${errors.email 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
              : 'border-[#E5E7EB] focus:border-[#4F46E5] focus:ring-[#E0E7FF]'
            }
            focus:outline-none focus:ring-2
          `}
          placeholder="utilisateur@elcbtp.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      {/* Mot de passe */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-[#111827] mb-2">
          Mot de passe {!initialValues && <span className="text-red-500">*</span>}
        </label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          className={`
            w-full px-4 py-2.5 rounded-lg border transition-colors
            ${errors.password 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
              : 'border-[#E5E7EB] focus:border-[#4F46E5] focus:ring-[#E0E7FF]'
            }
            focus:outline-none focus:ring-2
          `}
          placeholder={initialValues ? 'Laisser vide pour ne pas modifier' : 'Minimum 6 caractères'}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      {/* Rôle */}
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-[#111827] mb-2">
          Rôle <span className="text-red-500">*</span>
        </label>
        <select
          id="role"
          value={formData.role}
          onChange={(e) => handleChange('role', e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-[#E5E7EB] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#E0E7FF] focus:outline-none transition-colors"
        >
          <option value="ADMIN">Administrateur</option>
          <option value="DIRECTEUR">Directeur</option>
          <option value="COMPTABLE">Comptable</option>
          <option value="SECRETAIRE">Secrétaire</option>
        </select>
      </div>

      {/* Statut */}
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-[#111827] mb-2">
          Statut <span className="text-red-500">*</span>
        </label>
        <select
          id="status"
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-[#E5E7EB] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#E0E7FF] focus:outline-none transition-colors"
        >
          <option value="ACTIF">Actif</option>
          <option value="INACTIF">Inactif</option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-[#E5E7EB]">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 border border-[#E5E7EB] text-[#6B7280] rounded-lg hover:bg-[#F9FAFB] transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2.5 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition-colors"
        >
          {initialValues ? 'Modifier' : 'Créer'}
        </button>
      </div>
    </form>
  );
}
