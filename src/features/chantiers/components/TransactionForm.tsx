import { useState } from 'react';
import type { Transaction } from '@/types';

// ============================================
// INTERFACES TYPESCRIPT
// ============================================

interface TransactionFormProps {
  onSubmit: (data: Omit<Transaction, 'id'>) => void;
  onCancel: () => void;
}

type TransactionType = 'RECETTE' | 'DEPENSE';

// ============================================
// COMPOSANT FORMULAIRE (DUMB COMPONENT)
// Formulaire de saisie d'une nouvelle transaction
// ============================================

export function TransactionForm({ onSubmit, onCancel }: TransactionFormProps) {
  // ============================================
  // ÉTAT DU FORMULAIRE
  // ============================================
  const [formData, setFormData] = useState({
    type: 'RECETTE' as TransactionType,
    date: new Date().toISOString().split('T')[0], // Date du jour par défaut
    description: '',
    amount: '',
    paymentMethod: 'Espèces'
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

    if (!formData.description.trim()) {
      newErrors.description = 'La description est obligatoire';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Le montant doit être supérieur à 0';
    }

    if (!formData.date) {
      newErrors.date = 'La date est obligatoire';
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
    const transaction: Omit<Transaction, 'id'> = {
      projectId: '', // Sera rempli par le composant parent
      type: formData.type,
      date: formData.date,
      description: formData.description.trim(),
      amount: parseFloat(formData.amount),
      paymentMethod: formData.paymentMethod
    };

    onSubmit(transaction);
  };

  // ============================================
  // STYLES DYNAMIQUES SELON LE TYPE
  // ============================================
  
  const typeColor = formData.type === 'RECETTE' ? '#10B981' : '#EF4444';
  const typeColorBg = formData.type === 'RECETTE' ? '#ECFDF5' : '#FEE2E2';

  // ============================================
  // RENDER
  // ============================================

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* ============================================
          CHAMP : Type de transaction
          ============================================ */}
      <div>
        <label 
          className="block text-sm font-medium mb-2"
          style={{ color: '#111827' }}
        >
          Type de transaction *
        </label>
        <select
          value={formData.type}
          onChange={(e) => handleChange('type', e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border transition-all focus:outline-none focus:ring-2"
          style={{
            borderColor: '#E5E7EB',
            backgroundColor: typeColorBg,
            color: typeColor,
            fontWeight: '500'
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
          <option value="RECETTE">💰 Recette (Encaissement)</option>
          <option value="DEPENSE">💸 Dépense (Décaissement)</option>
        </select>
      </div>

      {/* ============================================
          CHAMP : Date
          ============================================ */}
      <div>
        <label 
          className="block text-sm font-medium mb-2"
          style={{ color: '#111827' }}
        >
          Date *
        </label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => handleChange('date', e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border transition-all focus:outline-none focus:ring-2"
          style={{
            borderColor: errors.date ? '#EF4444' : '#E5E7EB',
            color: '#111827'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#4F46E5';
            e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = errors.date ? '#EF4444' : '#E5E7EB';
            e.target.style.boxShadow = 'none';
          }}
        />
        {errors.date && (
          <p className="text-sm mt-1" style={{ color: '#EF4444' }}>
            {errors.date}
          </p>
        )}
      </div>

      {/* ============================================
          CHAMP : Description
          ============================================ */}
      <div>
        <label 
          className="block text-sm font-medium mb-2"
          style={{ color: '#111827' }}
        >
          Description *
        </label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Ex: Achat ciment, Paiement main d'œuvre..."
          className="w-full px-4 py-2.5 rounded-lg border transition-all focus:outline-none focus:ring-2"
          style={{
            borderColor: errors.description ? '#EF4444' : '#E5E7EB',
            color: '#111827'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#4F46E5';
            e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = errors.description ? '#EF4444' : '#E5E7EB';
            e.target.style.boxShadow = 'none';
          }}
        />
        {errors.description && (
          <p className="text-sm mt-1" style={{ color: '#EF4444' }}>
            {errors.description}
          </p>
        )}
      </div>

      {/* ============================================
          CHAMP : Montant
          ============================================ */}
      <div>
        <label 
          className="block text-sm font-medium mb-2"
          style={{ color: '#111827' }}
        >
          Montant (FCFA) *
        </label>
        <input
          type="number"
          value={formData.amount}
          onChange={(e) => handleChange('amount', e.target.value)}
          placeholder="0"
          min="0"
          step="1"
          className="w-full px-4 py-2.5 rounded-lg border transition-all focus:outline-none focus:ring-2"
          style={{
            borderColor: errors.amount ? '#EF4444' : '#E5E7EB',
            color: formData.type === 'RECETTE' ? '#10B981' : '#EF4444',
            fontWeight: '600',
            fontSize: '1.125rem'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#4F46E5';
            e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = errors.amount ? '#EF4444' : '#E5E7EB';
            e.target.style.boxShadow = 'none';
          }}
        />
        {errors.amount && (
          <p className="text-sm mt-1" style={{ color: '#EF4444' }}>
            {errors.amount}
          </p>
        )}
      </div>

      {/* ============================================
          CHAMP : Moyen de paiement
          ============================================ */}
      <div>
        <label 
          className="block text-sm font-medium mb-2"
          style={{ color: '#111827' }}
        >
          Moyen de paiement *
        </label>
        <select
          value={formData.paymentMethod}
          onChange={(e) => handleChange('paymentMethod', e.target.value)}
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
          <option value="Espèces">💵 Espèces</option>
          <option value="Chèque">📝 Chèque</option>
          <option value="Virement bancaire">🏦 Virement bancaire</option>
          <option value="Mobile Money">📱 Mobile Money</option>
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
          Enregistrer
        </button>
      </div>
    </form>
  );
}
