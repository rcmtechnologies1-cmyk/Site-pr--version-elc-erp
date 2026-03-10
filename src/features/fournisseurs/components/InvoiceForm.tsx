import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SupplierInvoice, Project } from '@/types';

// ============================================
// COMPOSANT DUMB : FORMULAIRE FACTURE FOURNISSEUR
// Utilisé pour enregistrer une nouvelle facture
// ============================================

interface InvoiceFormProps {
  supplierId: string; // ID du fournisseur (contexte)
  projects: Project[]; // ✨ NOUVEAU : Liste des chantiers disponibles
  onSubmit: (invoice: Omit<SupplierInvoice, 'id' | 'paidAmount' | 'status'>) => void;
  onCancel: () => void;
}

export function InvoiceForm({ supplierId, projects, onSubmit, onCancel }: InvoiceFormProps) {
  const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD

  const [formData, setFormData] = useState({
    invoiceNumber: '',
    date: today,
    description: '',
    totalAmount: '',
    dueDate: '',
    projectId: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ============================================
  // VALIDATION
  // ============================================

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.invoiceNumber.trim()) {
      newErrors.invoiceNumber = 'Le numéro de facture est requis';
    }

    if (!formData.date) {
      newErrors.date = 'La date d\'émission est requise';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    if (!formData.totalAmount || parseFloat(formData.totalAmount) <= 0) {
      newErrors.totalAmount = 'Le montant doit être supérieur à 0';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'La date d\'échéance est requise';
    } else if (new Date(formData.dueDate) < new Date(formData.date)) {
      newErrors.dueDate = 'L\'échéance doit être après la date d\'émission';
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
      supplierId,
      invoiceNumber: formData.invoiceNumber,
      date: formData.date,
      description: formData.description,
      totalAmount: parseFloat(formData.totalAmount),
      dueDate: formData.dueDate,
      projectId: formData.projectId || undefined
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
      {/* Numéro de facture */}
      <div>
        <label htmlFor="invoiceNumber" className="block text-sm font-medium text-[#111827] mb-1">
          N° de Facture <span className="text-red-600">*</span>
        </label>
        <Input
          id="invoiceNumber"
          type="text"
          value={formData.invoiceNumber}
          onChange={(e) => handleChange('invoiceNumber', e.target.value)}
          placeholder="Ex: FACT-2026-001"
          className={errors.invoiceNumber ? 'border-red-500' : ''}
        />
        {errors.invoiceNumber && (
          <p className="text-sm text-red-600 mt-1">{errors.invoiceNumber}</p>
        )}
      </div>

      {/* Date d'émission */}
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-[#111827] mb-1">
          Date d'Émission <span className="text-red-600">*</span>
        </label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => handleChange('date', e.target.value)}
          className={errors.date ? 'border-red-500' : ''}
        />
        {errors.date && (
          <p className="text-sm text-red-600 mt-1">{errors.date}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-[#111827] mb-1">
          Description <span className="text-red-600">*</span>
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Ex: Ciment CEM II 42.5 (200 sacs) + Sable fin (15 m³)"
          rows={3}
          className={`w-full px-3 py-2 border ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent`}
        />
        {errors.description && (
          <p className="text-sm text-red-600 mt-1">{errors.description}</p>
        )}
      </div>

      {/* Montant Total */}
      <div>
        <label htmlFor="totalAmount" className="block text-sm font-medium text-[#111827] mb-1">
          Montant Total (FCFA) <span className="text-red-600">*</span>
        </label>
        <Input
          id="totalAmount"
          type="number"
          step="1"
          min="0"
          value={formData.totalAmount}
          onChange={(e) => handleChange('totalAmount', e.target.value)}
          placeholder="Ex: 1000000 (1M FCFA)"
          className={errors.totalAmount ? 'border-red-500' : ''}
        />
        {errors.totalAmount && (
          <p className="text-sm text-red-600 mt-1">{errors.totalAmount}</p>
        )}
        {formData.totalAmount && parseFloat(formData.totalAmount) >= 1000000 && (
          <p className="text-sm text-[#6B7280] mt-1">
            ≈ {(parseFloat(formData.totalAmount) / 1000000).toFixed(1)}M FCFA
          </p>
        )}
      </div>

      {/* Date d'échéance */}
      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-[#111827] mb-1">
          Date d'Échéance <span className="text-red-600">*</span>
        </label>
        <Input
          id="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={(e) => handleChange('dueDate', e.target.value)}
          className={errors.dueDate ? 'border-red-500' : ''}
        />
        {errors.dueDate && (
          <p className="text-sm text-red-600 mt-1">{errors.dueDate}</p>
        )}
      </div>

      {/* ✨ NOUVEAU : Sélection du Chantier (Optionnel) */}
      <div>
        <label htmlFor="projectId" className="block text-sm font-medium text-[#111827] mb-1">
          Lié au Chantier (Optionnel)
        </label>
        <select
          id="projectId"
          value={formData.projectId}
          onChange={(e) => handleChange('projectId', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
        >
          <option value="">— Aucun chantier —</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name} ({project.status})
            </option>
          ))}
        </select>
        <p className="text-xs text-[#9CA3AF] mt-1">
          💡 Si vous sélectionnez un chantier, les paiements seront automatiquement comptabilisés dans ses dépenses
        </p>
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
          Enregistrer Facture
        </Button>
      </div>
    </form>
  );
}