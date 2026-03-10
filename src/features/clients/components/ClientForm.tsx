import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Client } from '@/types';

// ============================================
// COMPOSANT DUMB : FORMULAIRE CLIENT
// Utilisé pour ajouter ou modifier un client
// ============================================

interface ClientFormProps {
  onSubmit: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  initialData?: Client; // Pour l'édition (optionnel)
}

export function ClientForm({ onSubmit, onCancel, initialData }: ClientFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    address: initialData?.address || '',
    type: initialData?.type || 'PRIVE' as 'PUBLIC' | 'PRIVE'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ============================================
  // VALIDATION
  // ============================================

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du client est requis';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Le numéro de téléphone est requis';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'L\'adresse est requise';
    }

    // Validation email (optionnel mais format valide si renseigné)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
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

    onSubmit({
      name: formData.name,
      phone: formData.phone,
      email: formData.email || undefined,
      address: formData.address,
      type: formData.type
    });
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
      {/* Nom du client */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[#111827] mb-1">
          Nom du Client <span className="text-red-600">*</span>
        </label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Ex: M. Koffi Mensah"
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && (
          <p className="text-sm text-red-600 mt-1">{errors.name}</p>
        )}
      </div>

      {/* Type de client */}
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-[#111827] mb-1">
          Type de Client <span className="text-red-600">*</span>
        </label>
        <select
          id="type"
          value={formData.type}
          onChange={(e) => handleChange('type', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
        >
          <option value="PRIVE">Privé (Particulier, Entreprise)</option>
          <option value="PUBLIC">Public (Ministère, Collectivité)</option>
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
          placeholder="Ex: +228 90 12 34 56"
          className={errors.phone ? 'border-red-500' : ''}
        />
        {errors.phone && (
          <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
        )}
      </div>

      {/* Email (optionnel) */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#111827] mb-1">
          Email (Optionnel)
        </label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="Ex: client@example.com"
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-sm text-red-600 mt-1">{errors.email}</p>
        )}
      </div>

      {/* Adresse */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-[#111827] mb-1">
          Adresse <span className="text-red-600">*</span>
        </label>
        <textarea
          id="address"
          value={formData.address}
          onChange={(e) => handleChange('address', e.target.value)}
          placeholder="Ex: Quartier Adidogomé, Lomé"
          rows={2}
          className={`w-full px-3 py-2 border ${
            errors.address ? 'border-red-500' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent`}
        />
        {errors.address && (
          <p className="text-sm text-red-600 mt-1">{errors.address}</p>
        )}
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
          {initialData ? 'Modifier' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  );
}
