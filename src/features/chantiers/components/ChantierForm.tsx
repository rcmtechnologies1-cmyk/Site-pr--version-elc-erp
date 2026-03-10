import { useState, useEffect } from 'react';
import type { Project, Client } from '@/types';

// ============================================
// INTERFACES TYPESCRIPT
// ============================================

interface ChantierFormProps {
  onSubmit: (data: Omit<Project, 'id'>) => void;
  onCancel: () => void;
  initialValues?: Project; // ✨ Nouveau : pour l'édition
  clients: Client[]; // ✨ Liste des clients pour le Select
}

type ProjectStatus = 'en cours' | 'en attente' | 'terminé';

// ============================================
// COMPOSANT FORMULAIRE (DUMB COMPONENT)
// Formulaire de création/édition d'un chantier
// ============================================

export function ChantierForm({ onSubmit, onCancel, initialValues, clients }: ChantierFormProps) {
  // ============================================
  // ÉTAT DU FORMULAIRE
  // ============================================
  const [formData, setFormData] = useState({
    name: initialValues?.name || '',
    client: initialValues?.clientName || '',
    location: initialValues?.location || '',
    budgetTotal: initialValues?.budgetTotal?.toString() || '',
    status: (initialValues?.status as ProjectStatus) || 'en cours',
    startDate: initialValues?.startDate || new Date().toISOString().split('T')[0],
    endDate: initialValues?.endDate || ''
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

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du chantier est obligatoire';
    }

    if (!formData.client.trim()) {
      newErrors.client = 'Le nom du client est obligatoire';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'La localisation est obligatoire';
    }

    if (!formData.budgetTotal || parseFloat(formData.budgetTotal) <= 0) {
      newErrors.budgetTotal = 'Le budget doit être supérieur à 0';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'La date de début est obligatoire';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'La date de fin est obligatoire';
    }

    // Validation des dates : endDate doit être après startDate
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (end < start) {
        newErrors.endDate = 'La date de fin doit être après la date de début';
      }
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
    const project: Omit<Project, 'id'> = {
      name: formData.name.trim(),
      clientName: formData.client.trim(),
      location: formData.location.trim(),
      budgetTotal: parseFloat(formData.budgetTotal),
      status: formData.status,
      startDate: formData.startDate,
      endDate: formData.endDate
    };

    onSubmit(project);
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* ============================================
          CHAMP : Nom du chantier
          ============================================ */}
      <div>
        <label 
          className="block text-sm font-medium mb-2"
          style={{ color: '#111827' }}
        >
          Nom du chantier *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Ex: Construction immeuble R+3"
          className="w-full px-4 py-2.5 rounded-lg border transition-all focus:outline-none focus:ring-2"
          style={{
            borderColor: errors.name ? '#EF4444' : '#E5E7EB',
            color: '#111827'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#4F46E5';
            e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = errors.name ? '#EF4444' : '#E5E7EB';
            e.target.style.boxShadow = 'none';
          }}
        />
        {errors.name && (
          <p className="text-sm mt-1" style={{ color: '#EF4444' }}>
            {errors.name}
          </p>
        )}
      </div>

      {/* ============================================
          CHAMP : Client
          ============================================ */}
      <div>
        <label 
          className="block text-sm font-medium mb-2"
          style={{ color: '#111827' }}
        >
          Client *
        </label>
        <select
          value={formData.client}
          onChange={(e) => handleChange('client', e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border transition-all focus:outline-none focus:ring-2"
          style={{
            borderColor: errors.client ? '#EF4444' : '#E5E7EB',
            color: '#111827'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#4F46E5';
            e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = errors.client ? '#EF4444' : '#E5E7EB';
            e.target.style.boxShadow = 'none';
          }}
        >
          <option value="">Sélectionnez un client</option>
          {clients.map(client => (
            <option key={client.id} value={client.name}>{client.name}</option>
          ))}
        </select>
        {errors.client && (
          <p className="text-sm mt-1" style={{ color: '#EF4444' }}>
            {errors.client}
          </p>
        )}
      </div>

      {/* ============================================
          CHAMP : Localisation
          ============================================ */}
      <div>
        <label 
          className="block text-sm font-medium mb-2"
          style={{ color: '#111827' }}
        >
          Localisation *
        </label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="Ex: Lomé, Togo"
          className="w-full px-4 py-2.5 rounded-lg border transition-all focus:outline-none focus:ring-2"
          style={{
            borderColor: errors.location ? '#EF4444' : '#E5E7EB',
            color: '#111827'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#4F46E5';
            e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = errors.location ? '#EF4444' : '#E5E7EB';
            e.target.style.boxShadow = 'none';
          }}
        />
        {errors.location && (
          <p className="text-sm mt-1" style={{ color: '#EF4444' }}>
            {errors.location}
          </p>
        )}
      </div>

      {/* ============================================
          CHAMP : Budget Total
          ============================================ */}
      <div>
        <label 
          className="block text-sm font-medium mb-2"
          style={{ color: '#111827' }}
        >
          Budget Total (FCFA) *
        </label>
        <input
          type="number"
          value={formData.budgetTotal}
          onChange={(e) => handleChange('budgetTotal', e.target.value)}
          placeholder="0"
          min="0"
          step="1"
          className="w-full px-4 py-2.5 rounded-lg border transition-all focus:outline-none focus:ring-2"
          style={{
            borderColor: errors.budgetTotal ? '#EF4444' : '#E5E7EB',
            color: '#4F46E5',
            fontWeight: '600',
            fontSize: '1.125rem'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#4F46E5';
            e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = errors.budgetTotal ? '#EF4444' : '#E5E7EB';
            e.target.style.boxShadow = 'none';
          }}
        />
        {errors.budgetTotal && (
          <p className="text-sm mt-1" style={{ color: '#EF4444' }}>
            {errors.budgetTotal}
          </p>
        )}
      </div>

      {/* ============================================
          GRILLE 2 COLONNES : Dates
          ============================================ */}
      <div className="grid grid-cols-2 gap-4">
        {/* Date de début */}
        <div>
          <label 
            className="block text-sm font-medium mb-2"
            style={{ color: '#111827' }}
          >
            Date de début *
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border transition-all focus:outline-none focus:ring-2"
            style={{
              borderColor: errors.startDate ? '#EF4444' : '#E5E7EB',
              color: '#111827'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#4F46E5';
              e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = errors.startDate ? '#EF4444' : '#E5E7EB';
              e.target.style.boxShadow = 'none';
            }}
          />
          {errors.startDate && (
            <p className="text-sm mt-1" style={{ color: '#EF4444' }}>
              {errors.startDate}
            </p>
          )}
        </div>

        {/* Date de fin */}
        <div>
          <label 
            className="block text-sm font-medium mb-2"
            style={{ color: '#111827' }}
          >
            Date de fin *
          </label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border transition-all focus:outline-none focus:ring-2"
            style={{
              borderColor: errors.endDate ? '#EF4444' : '#E5E7EB',
              color: '#111827'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#4F46E5';
              e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = errors.endDate ? '#EF4444' : '#E5E7EB';
              e.target.style.boxShadow = 'none';
            }}
          />
          {errors.endDate && (
            <p className="text-sm mt-1" style={{ color: '#EF4444' }}>
              {errors.endDate}
            </p>
          )}
        </div>
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
          <option value="en cours">🚧 En cours</option>
          <option value="en attente">⏸️ En attente</option>
          <option value="terminé">✅ Terminé</option>
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

        {/* Bouton Créer/Modifier */}
        <button
          type="submit"
          className="flex-1 px-4 py-2.5 rounded-lg transition-all hover:opacity-90"
          style={{
            backgroundColor: '#4F46E5',
            color: '#FFFFFF',
            fontWeight: '600'
          }}
        >
          {initialValues ? 'Modifier le chantier' : 'Créer le chantier'}
        </button>
      </div>
    </form>
  );
}