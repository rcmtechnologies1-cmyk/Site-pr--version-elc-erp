import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { SupplierInvoice } from '@/types';

// ============================================
// COMPOSANT DUMB : FORMULAIRE PAIEMENT
// Utilisé pour enregistrer un paiement sur une facture
// ============================================

interface PaymentFormProps {
  invoice: SupplierInvoice; // Facture à payer
  onSubmit: (payment: {
    invoiceId: string;
    date: string;
    amount: number;
    paymentMethod: string;
    reference?: string;
  }) => void;
  onCancel: () => void;
}

export function PaymentForm({ invoice, onSubmit, onCancel }: PaymentFormProps) {
  const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
  const remainingAmount = invoice.totalAmount - invoice.paidAmount;

  const [formData, setFormData] = useState({
    date: today,
    amount: '',
    paymentMethod: 'Virement bancaire',
    reference: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ============================================
  // VALIDATION
  // ============================================

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = 'La date de paiement est requise';
    }

    const amount = parseFloat(formData.amount);
    if (!formData.amount || amount <= 0) {
      newErrors.amount = 'Le montant doit être supérieur à 0';
    } else if (amount > remainingAmount) {
      newErrors.amount = `Le montant ne peut pas dépasser le reste à payer (${formatAmount(remainingAmount)})`;
    }

    if (!formData.paymentMethod.trim()) {
      newErrors.paymentMethod = 'Le mode de paiement est requis';
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
      invoiceId: invoice.id,
      date: formData.date,
      amount: parseFloat(formData.amount),
      paymentMethod: formData.paymentMethod,
      reference: formData.reference || undefined
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
  // UTILS
  // ============================================

  const formatAmount = (amount: number): string => {
    if (amount === 0) return '0 FCFA';
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M FCFA`;
    }
    return `${(amount / 1000).toFixed(0)}K FCFA`;
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Résumé de la facture */}
      <div className="bg-[#F9FAFB] border border-gray-200 rounded-lg p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-[#6B7280]">Facture :</span>
          <span className="font-medium text-[#111827]">{invoice.invoiceNumber}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#6B7280]">Montant Total :</span>
          <span className="font-medium text-[#111827]">{formatAmount(invoice.totalAmount)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#6B7280]">Déjà Payé :</span>
          <span className="font-medium text-green-600">{formatAmount(invoice.paidAmount)}</span>
        </div>
        <div className="flex justify-between text-base pt-2 border-t border-gray-300">
          <span className="font-semibold text-[#111827]">Reste à Payer :</span>
          <span className="font-bold text-red-600">{formatAmount(remainingAmount)}</span>
        </div>
      </div>

      {/* Date du paiement */}
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-[#111827] mb-1">
          Date du Paiement <span className="text-red-600">*</span>
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

      {/* Montant du paiement */}
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-[#111827] mb-1">
          Montant du Paiement (FCFA) <span className="text-red-600">*</span>
        </label>
        <Input
          id="amount"
          type="number"
          step="1"
          min="0"
          max={remainingAmount}
          value={formData.amount}
          onChange={(e) => handleChange('amount', e.target.value)}
          placeholder={`Ex: ${remainingAmount} (Paiement complet)`}
          className={errors.amount ? 'border-red-500' : ''}
        />
        {errors.amount && (
          <p className="text-sm text-red-600 mt-1">{errors.amount}</p>
        )}
        {formData.amount && parseFloat(formData.amount) > 0 && (
          <div className="mt-2 space-y-1">
            <p className="text-sm text-[#6B7280]">
              ≈ {(parseFloat(formData.amount) / 1000000).toFixed(1)}M FCFA
            </p>
            {parseFloat(formData.amount) === remainingAmount && (
              <p className="text-sm text-green-600 font-medium">
                ✓ Paiement complet (facture sera marquée PAYÉE)
              </p>
            )}
            {parseFloat(formData.amount) < remainingAmount && (
              <p className="text-sm text-orange-600 font-medium">
                ⚠ Paiement partiel (reste : {formatAmount(remainingAmount - parseFloat(formData.amount))})
              </p>
            )}
          </div>
        )}
      </div>

      {/* Mode de paiement */}
      <div>
        <label htmlFor="paymentMethod" className="block text-sm font-medium text-[#111827] mb-1">
          Mode de Paiement <span className="text-red-600">*</span>
        </label>
        <select
          id="paymentMethod"
          value={formData.paymentMethod}
          onChange={(e) => handleChange('paymentMethod', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
        >
          <option value="Virement bancaire">Virement bancaire</option>
          <option value="Chèque">Chèque</option>
          <option value="Espèces">Espèces</option>
          <option value="Mobile Money">Mobile Money</option>
          <option value="Traite">Traite</option>
        </select>
      </div>

      {/* Référence (optionnel) */}
      <div>
        <label htmlFor="reference" className="block text-sm font-medium text-[#111827] mb-1">
          Référence de Paiement (Optionnel)
        </label>
        <Input
          id="reference"
          type="text"
          value={formData.reference}
          onChange={(e) => handleChange('reference', e.target.value)}
          placeholder="Ex: CHQ-456789, VIR-20260302-001"
        />
        <p className="text-xs text-[#9CA3AF] mt-1">
          N° de chèque, référence de virement, etc.
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
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
        >
          Enregistrer Paiement
        </Button>
      </div>
    </form>
  );
}
