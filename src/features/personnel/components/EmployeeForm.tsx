import { useState } from 'react';
import type { Employee } from '@/types';

// ============================================
// INTERFACES TYPESCRIPT
// ============================================

interface EmployeeFormProps {
  onSubmit: (data: Omit<Employee, 'id'>) => void;
  onCancel: () => void;
  initialValues?: Employee; // ✨ Nouveau : pour l'édition
}

type EmployeeStatus = 'ACTIF' | 'INACTIF';

// ============================================
// COMPOSANT FORMULAIRE (DUMB COMPONENT)
// Formulaire de création/édition d'un employé
// ============================================

export function EmployeeForm({ onSubmit, onCancel, initialValues }: EmployeeFormProps) {
  // ============================================
  // ÉTAT DU FORMULAIRE
  // ============================================
  const [formData, setFormData] = useState({
    fullName: initialValues?.fullName || '',
    role: initialValues?.role || '',
    phone: initialValues?.phone || '',
    dailyRate: initialValues?.dailyRate?.toString() || '',
    status: (initialValues?.status as EmployeeStatus) || 'ACTIF'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ============================================
  // HANDLERS: Gestion des changements
  // ============================================
  
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // ============================================
  // VALIDATION
  // ============================================
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Le nom complet est obligatoire';
    }

    if (!formData.role.trim()) {
      newErrors.role = 'Le poste/rôle est obligatoire';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Le numéro de téléphone est obligatoire';
    } else if (!/^[+]?[0-9\s-]{8,}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Numéro de téléphone invalide';
    }

    if (!formData.dailyRate || parseFloat(formData.dailyRate) <= 0) {
      newErrors.dailyRate = 'Le taux journalier doit être supérieur à 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============================================
  // HANDLER: Soumission du formulaire
  // ============================================
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Préparer les données pour le parent
    const employee: Omit<Employee, 'id'> = {
      fullName: formData.fullName.trim(),
      role: formData.role.trim(),
      phone: formData.phone.trim(),
      dailyRate: parseFloat(formData.dailyRate),
      status: formData.status
    };

    onSubmit(employee);
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* ============================================
          CHAMP : Nom complet
          ============================================ */}
      <div>
        <label 
          className="block text-sm font-medium mb-2"
          style={{ color: '#111827' }}
        >
          Nom complet *
        </label>
        <input
          type="text"
          value={formData.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          placeholder="Ex: Koffi Mensah"
          className="w-full px-4 py-2.5 rounded-lg border transition-all focus:outline-none focus:ring-2"
          style={{
            borderColor: errors.fullName ? '#EF4444' : '#E5E7EB',
            color: '#111827'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#4F46E5';
            e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = errors.fullName ? '#EF4444' : '#E5E7EB';
            e.target.style.boxShadow = 'none';
          }}
        />
        {errors.fullName && (
          <p className="text-sm mt-1" style={{ color: '#EF4444' }}>
            {errors.fullName}
          </p>
        )}
      </div>

      {/* ============================================
          CHAMP : Poste/Rôle
          ============================================ */}
      <div>
        <label 
          className="block text-sm font-medium mb-2"
          style={{ color: '#111827' }}
        >
          Poste / Rôle *
        </label>
        <select
          value={formData.role}
          onChange={(e) => handleChange('role', e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border transition-all focus:outline-none focus:ring-2"
          style={{
            borderColor: errors.role ? '#EF4444' : '#E5E7EB',
            color: '#111827'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#4F46E5';
            e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = errors.role ? '#EF4444' : '#E5E7EB';
            e.target.style.boxShadow = 'none';
          }}
        >
          <option value="">Sélectionnez un poste...</option>
          <option value="Maçon">🧱 Maçon</option>
          <option value="Chef Maçon">👷 Chef Maçon</option>
          <option value="Manœuvre">⚒️ Manœuvre</option>
          <option value="Ferrailleur">🔩 Ferrailleur</option>
          <option value="Électricien">⚡ Électricien</option>
          <option value="Plombier">🚰 Plombier</option>
          <option value="Peintre">🎨 Peintre</option>
          <option value="Chauffeur">🚛 Chauffeur</option>
          <option value="Comptable">📊 Comptable</option>
          <option value="Ingénieur">📐 Ingénieur</option>
          <option value="Autre">Autre</option>
        </select>
        {errors.role && (
          <p className="text-sm mt-1" style={{ color: '#EF4444' }}>
            {errors.role}
          </p>
        )}
      </div>

      {/* ============================================
          CHAMP : Téléphone
          ============================================ */}
      <div>
        <label 
          className="block text-sm font-medium mb-2"
          style={{ color: '#111827' }}
        >
          Téléphone *
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="+228 90 12 34 56"
          className="w-full px-4 py-2.5 rounded-lg border transition-all focus:outline-none focus:ring-2"
          style={{
            borderColor: errors.phone ? '#EF4444' : '#E5E7EB',
            color: '#111827'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#4F46E5';
            e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = errors.phone ? '#EF4444' : '#E5E7EB';
            e.target.style.boxShadow = 'none';
          }}
        />
        {errors.phone && (
          <p className="text-sm mt-1" style={{ color: '#EF4444' }}>
            {errors.phone}
          </p>
        )}
      </div>

      {/* ============================================
          CHAMP : Taux Journalier
          ============================================ */}
      <div>
        <label 
          className="block text-sm font-medium mb-2"
          style={{ color: '#111827' }}
        >
          Taux Journalier (FCFA) *
        </label>
        <input
          type="number"
          value={formData.dailyRate}
          onChange={(e) => handleChange('dailyRate', e.target.value)}
          placeholder="0"
          min="0"
          step="500"
          className="w-full px-4 py-2.5 rounded-lg border transition-all focus:outline-none focus:ring-2"
          style={{
            borderColor: errors.dailyRate ? '#EF4444' : '#E5E7EB',
            color: '#4F46E5',
            fontWeight: '600',
            fontSize: '1.125rem'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#4F46E5';
            e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = errors.dailyRate ? '#EF4444' : '#E5E7EB';
            e.target.style.boxShadow = 'none';
          }}
        />
        {errors.dailyRate && (
          <p className="text-sm mt-1" style={{ color: '#EF4444' }}>
            {errors.dailyRate}
          </p>
        )}
        <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
          💡 Taux typiques : Manœuvre 3500, Maçon 6000, Chef Maçon 8000, Électricien 9000 FCFA/jour
        </p>
      </div>

      {/* ============================================
          CHAMP : Statut
          ============================================ */}
      <div>
        <label 
          className="block text-sm font-medium mb-2"
          style={{ color: '#111827' }}
        >
          Statut *
        </label>
        <select
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border transition-all focus:outline-none focus:ring-2"
          style={{
            borderColor: '#E5E7EB',
            color: '#111827'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#4F46E5';
            e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#E5E7EB';
            e.target.style.boxShadow = 'none';
          }}
        >
          <option value="ACTIF">✅ Actif</option>
          <option value="INACTIF">⏸️ Inactif</option>
        </select>
      </div>

      {/* ============================================
          BOUTONS D'ACTION
          ============================================ */}
      <div className="flex gap-3 pt-4">
        {/* Bouton Annuler */}
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 rounded-lg border transition-all hover:bg-gray-50"
          style={{
            borderColor: '#E5E7EB',
            color: '#6B7280',
            fontWeight: '500'
          }}
        >
          Annuler
        </button>

        {/* Bouton Enregistrer */}
        <button
          type="submit"
          className="flex-1 px-4 py-2.5 rounded-lg transition-all hover:opacity-90"
          style={{
            backgroundColor: '#4F46E5',
            color: '#FFFFFF',
            fontWeight: '600'
          }}
        >
          {initialValues ? 'Modifier l\'employé' : 'Ajouter l\'employé'}
        </button>
      </div>
    </form>
  );
}