import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Supplier } from '@/types';

// ============================================
// COMPOSANT DUMB : FORMULAIRE FOURNISSEUR
// Utilisé pour créer ou éditer un fournisseur
// ============================================

interface SupplierFormProps {
  onSubmit: (supplier: Omit<Supplier, 'id' | 'totalDebt'>) => void;
  onCancel: () => void;
  initialData?: Supplier;
}

export function SupplierForm({ onSubmit, onCancel, initialData }: SupplierFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || 'MATERIAUX' as Supplier['category'],
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    address: initialData?.address || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ============================================
  // VALIDATION
  // ============================================

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du fournisseur est requis';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============================================
  // HANDLERS
  // ============================================

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur du champ lors de la modification
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nom du fournisseur */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[#111827] mb-1">
          Nom du Fournisseur <span className="text-red-600">*</span>
        </label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Ex: CIMTOGO"
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && (
          <p className="text-sm text-red-600 mt-1">{errors.name}</p>
        )}
      </div>

      {/* Catégorie */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-[#111827] mb-1">
          Catégorie <span className="text-red-600">*</span>
        </label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
        >
          <option value="MATERIAUX">Matériaux</option>
          <option value="ENGINS">Engins</option>
          <option value="SERVICES">Services</option>
          <option value="AUTRES">Autres</option>
        </select>
      </div>

      {/* Téléphone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-[#111827] mb-1">
          Téléphone <span className="text-red-600">*</span>
        </label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="+228 90 12 34 56"
          className={errors.phone ? 'border-red-500' : ''}
        />
        {errors.phone && (
          <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#111827] mb-1">
          Email <span className="text-red-600">*</span>
        </label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="commercial@fournisseur.tg"
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-sm text-red-600 mt-1">{errors.email}</p>
        )}
      </div>

      {/* Adresse */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-[#111827] mb-1">
          Adresse (Optionnel)
        </label>
        <Input
          id="address"
          type="text"
          value={formData.address}
          onChange={(e) => handleChange('address', e.target.value)}
          placeholder="Zone Portuaire, Lomé, Togo"
        />
      </div>

      {/* Boutons d'action */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Annuler
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-[#4F46E5] hover:bg-[#4338CA] text-white"
        >
          {initialData ? 'Modifier' : 'Ajouter'}
        </Button>
      </div>
    </form>
  );
}
