import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  Plus, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  CreditCard,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/Modal';
import { InvoiceForm } from './components/InvoiceForm';
import { PaymentForm } from './components/PaymentForm';
import { toast } from '@/lib/toast';
import { MOCK_PROJECTS } from '@/data/mockData';
import type { Supplier, SupplierInvoice, SupplierPayment, Project } from '@/types';

// ============================================
// INTERFACES TYPESCRIPT
// ============================================

interface SupplierDetailsProps {
  suppliers: Supplier[];
  invoices: SupplierInvoice[];
  payments: SupplierPayment[];
  projects: Project[]; // ✨ NOUVEAU : Liste des chantiers pour le Select
  onAddInvoice: (invoice: SupplierInvoice) => void;
  onAddPayment: (payment: SupplierPayment) => void;
}

// ============================================
// COMPOSANT SMART : DÉTAILS D'UN FOURNISSEUR
// Affiche les factures et permet les paiements
// REÇOIT les données depuis App.tsx (état global)
// ============================================

export function SupplierDetails({ 
  suppliers, 
  invoices, 
  payments,
  projects, 
  onAddInvoice, 
  onAddPayment 
}: SupplierDetailsProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // États locaux (UI uniquement)
  const [isAddInvoiceModalOpen, setIsAddInvoiceModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<SupplierInvoice | null>(null);

  // ============================================
  // DONNÉES - FOURNISSEUR
  // ============================================

  const supplier = useMemo(() => {
    return suppliers.find(s => s.id === id);
  }, [suppliers, id]);

  // Factures de ce fournisseur uniquement
  const supplierInvoices = useMemo(() => {
    return invoices.filter(inv => inv.supplierId === id);
  }, [invoices, id]);

  // ============================================
  // CALCULS - KPI DU FOURNISSEUR
  // ============================================

  /**
   * Dette totale envers ce fournisseur
   */
  const totalDebt = useMemo(() => {
    return supplierInvoices.reduce((sum, invoice) => {
      const remainingAmount = invoice.totalAmount - invoice.paidAmount;
      return sum + remainingAmount;
    }, 0);
  }, [supplierInvoices]);

  /**
   * Nombre de factures en retard
   */
  const overdueInvoicesCount = useMemo(() => {
    const today = new Date('2026-03-02');
    return supplierInvoices.filter(invoice => {
      const dueDate = new Date(invoice.dueDate);
      const isOverdue = dueDate < today;
      const isNotFullyPaid = invoice.status !== 'PAYEE';
      return isOverdue && isNotFullyPaid;
    }).length;
  }, [supplierInvoices]);

  // ============================================
  // HANDLERS - ACTIONS
  // ============================================

  const handleBack = () => {
    navigate('/fournisseurs');
  };

  const handleAddInvoice = () => {
    setIsAddInvoiceModalOpen(true);
  };

  const handlePayInvoice = (invoice: SupplierInvoice) => {
    setSelectedInvoice(invoice);
    setIsPaymentModalOpen(true);
  };

  /**
   * Soumission du formulaire d'ajout de facture
   */
  const handleInvoiceFormSubmit = (invoiceData: Omit<SupplierInvoice, 'id' | 'paidAmount' | 'status'>) => {
    const newInvoice: SupplierInvoice = {
      ...invoiceData,
      id: `INV-${Date.now()}`, // Génère un ID unique
      paidAmount: 0, // Aucun paiement initial
      status: 'NON_PAYEE' // Statut initial
    };

    // Ajouter la facture à la liste
    onAddInvoice(newInvoice);

    // Recalculer la dette du fournisseur
    recalculateSupplierDebt(id!);

    // Fermer la modale
    setIsAddInvoiceModalOpen(false);
  };

  /**
   * Soumission du formulaire de paiement
   */
  const handlePaymentFormSubmit = (paymentData: {
    invoiceId: string;
    date: string;
    amount: number;
    paymentMethod: string;
    reference?: string;
  }) => {
    // Ajouter le paiement à la liste
    const newPayment: SupplierPayment = {
      id: `PAY-${Date.now()}`, // Génère un ID unique
      invoiceId: paymentData.invoiceId,
      date: paymentData.date,
      amount: paymentData.amount,
      paymentMethod: paymentData.paymentMethod,
      reference: paymentData.reference
    };
    
    // Appeler le handler global (qui va générer automatiquement la transaction)
    onAddPayment(newPayment);

    // Afficher un toast de succès
    toast.success('💰 Paiement enregistré avec succès ! La dépense a été ajoutée à la trésorerie.');

    // Fermer la modale
    setIsPaymentModalOpen(false);
    setSelectedInvoice(null);
  };

  /**
   * Recalcule la dette totale d'un fournisseur
   */
  const recalculateSupplierDebt = (supplierId: string) => {
    const debt = invoices
      .filter(inv => inv.supplierId === supplierId)
      .reduce((sum, inv) => sum + (inv.totalAmount - inv.paidAmount), 0);

    const updatedSuppliers = suppliers.map(supplier => {
      if (supplier.id === supplierId) {
        return {
          ...supplier,
          totalDebt: debt
        };
      }
      return supplier;
    });

    // Mettre à jour les fournisseurs dans l'état global
    // (cette partie dépend de la façon dont vous gérez l'état global)
    // Par exemple, si vous utilisez un contexte ou un store Redux :
    // setSuppliers(updatedSuppliers);
  };

  // ============================================
  // UTILS - FORMATAGE
  // ============================================

  const formatAmount = (amount: number): string => {
    if (amount === 0) return '0 FCFA';
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M FCFA`;
    }
    return `${(amount / 1000).toFixed(0)}K FCFA`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  /**
   * Retourne le badge de statut d'une facture
   */
  const getStatusBadge = (status: SupplierInvoice['status']) => {
    const statusConfig = {
      PAYEE: {
        label: 'Payée',
        bgColor: 'bg-green-100',
        textColor: 'text-green-700',
        icon: CheckCircle
      },
      PARTIELLE: {
        label: 'Partielle',
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-700',
        icon: Clock
      },
      NON_PAYEE: {
        label: 'Non Payée',
        bgColor: 'bg-red-100',
        textColor: 'text-red-700',
        icon: AlertTriangle
      }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}
      >
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  /**
   * Vérifie si une facture est en retard
   */
  const isInvoiceOverdue = (invoice: SupplierInvoice): boolean => {
    const today = new Date('2026-03-02');
    const dueDate = new Date(invoice.dueDate);
    return dueDate < today && invoice.status !== 'PAYEE';
  };

  /**
   * Trouve le nom du projet lié à une facture
   */
  const getProjectName = (projectId?: string): string => {
    if (!projectId) return '—';
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Projet inconnu';
  };

  // ============================================
  // RENDER - GESTION DES CAS D'ERREUR
  // ============================================

  if (!supplier) {
    return (
      <div className="p-8 text-center">
        <Package className="w-16 h-16 mx-auto mb-4 text-[#D1D5DB]" />
        <h2 className="text-xl font-semibold text-[#111827] mb-2">
          Fournisseur introuvable
        </h2>
        <p className="text-[#6B7280] mb-6">
          Le fournisseur demandé n'existe pas ou a été supprimé.
        </p>
        <Button onClick={handleBack} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à la liste
        </Button>
      </div>
    );
  }

  // ============================================
  // RENDER - COMPOSANT PRINCIPAL
  // ============================================

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* ============================================
          HEADER AVEC RETOUR
          ============================================ */}
      <div className="mb-6">
        <Button
          onClick={handleBack}
          variant="ghost"
          className="mb-4 text-[#6B7280] hover:text-[#111827]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux fournisseurs
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#111827] mb-2">
              {supplier.name}
            </h1>
            <div className="space-y-1 text-sm text-[#6B7280]">
              <p>
                <span className="font-medium">Catégorie :</span>{' '}
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#EEF2FF] text-[#4F46E5]">
                  {supplier.category}
                </span>
              </p>
              <p>
                <span className="font-medium">Téléphone :</span> {supplier.phone}
              </p>
              <p>
                <span className="font-medium">Email :</span> {supplier.email}
              </p>
              {supplier.address && (
                <p>
                  <span className="font-medium">Adresse :</span> {supplier.address}
                </p>
              )}
            </div>
          </div>

          <Button
            onClick={handleAddInvoice}
            className="bg-[#4F46E5] hover:bg-[#4338CA] text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Enregistrer Facture
          </Button>
        </div>
      </div>

      {/* ============================================
          KPI DU FOURNISSEUR
          ============================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Dette totale */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-[#6B7280] mb-1">
                Dette Totale
              </p>
              <p
                className={`text-2xl sm:text-3xl font-bold mb-1 ${
                  totalDebt > 0 ? 'text-red-600' : 'text-green-600'
                }`}
              >
                {formatAmount(totalDebt)}
              </p>
              <p className="text-xs text-[#9CA3AF]">
                {totalDebt > 0 ? 'Reste à payer' : 'Aucune dette'}
              </p>
            </div>
            <div
              className={`rounded-full p-2 ${
                totalDebt > 0 ? 'bg-red-100' : 'bg-green-100'
              }`}
            >
              <CreditCard
                className={`w-5 h-5 ${
                  totalDebt > 0 ? 'text-red-600' : 'text-green-600'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Factures en retard */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-[#6B7280] mb-1">
                Factures en Retard
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1">
                {overdueInvoicesCount}
              </p>
              <p className="text-xs text-[#9CA3AF]">Échéance dépassée</p>
            </div>
            <div className="bg-orange-100 rounded-full p-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Total factures */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-[#6B7280] mb-1">
                Total Factures
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-[#111827] mb-1">
                {supplierInvoices.length}
              </p>
              <p className="text-xs text-[#9CA3AF]">Toutes factures</p>
            </div>
            <div className="bg-gray-100 rounded-full p-2">
              <FileText className="w-5 h-5 text-[#6B7280]" />
            </div>
          </div>
        </div>
      </div>

      {/* ============================================
          TABLEAU DES FACTURES
          ============================================ */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200 bg-[#F9FAFB]">
          <h2 className="font-semibold text-[#111827] flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Factures ({supplierInvoices.length})
          </h2>
        </div>

        {supplierInvoices.length === 0 ? (
          <div className="p-8 text-center text-[#6B7280]">
            <FileText className="w-12 h-12 mx-auto mb-3 text-[#D1D5DB]" />
            <p className="font-medium">Aucune facture enregistrée</p>
            <p className="text-sm mt-1">
              Commencez par enregistrer une facture pour ce fournisseur.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F9FAFB] border-b border-gray-200">
                <tr>
                  <th className="text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider p-3">
                    Date
                  </th>
                  <th className="text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider p-3">
                    N° Facture
                  </th>
                  <th className="text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider p-3">
                    Description
                  </th>
                  <th className="text-right text-xs font-medium text-[#6B7280] uppercase tracking-wider p-3">
                    Montant Total
                  </th>
                  <th className="text-right text-xs font-medium text-[#6B7280] uppercase tracking-wider p-3">
                    Déjà Payé
                  </th>
                  <th className="text-right text-xs font-medium text-[#6B7280] uppercase tracking-wider p-3">
                    Reste à Payer
                  </th>
                  <th className="text-center text-xs font-medium text-[#6B7280] uppercase tracking-wider p-3">
                    Statut
                  </th>
                  <th className="text-center text-xs font-medium text-[#6B7280] uppercase tracking-wider p-3">
                    Échéance
                  </th>
                  <th className="text-right text-xs font-medium text-[#6B7280] uppercase tracking-wider p-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {supplierInvoices.map((invoice) => {
                  const remainingAmount = invoice.totalAmount - invoice.paidAmount;
                  const isOverdue = isInvoiceOverdue(invoice);

                  return (
                    <tr
                      key={invoice.id}
                      className={`hover:bg-[#F9FAFB] transition-colors ${
                        isOverdue ? 'bg-red-50' : ''
                      }`}
                    >
                      {/* Date */}
                      <td className="p-3 text-sm text-[#111827] whitespace-nowrap">
                        {formatDate(invoice.date)}
                      </td>

                      {/* N° Facture */}
                      <td className="p-3 text-sm font-medium text-[#111827] whitespace-nowrap">
                        {invoice.invoiceNumber}
                      </td>

                      {/* Description */}
                      <td className="p-3 text-sm text-[#6B7280] max-w-xs truncate">
                        {invoice.description}
                      </td>

                      {/* Montant Total */}
                      <td className="p-3 text-sm text-right text-[#111827] whitespace-nowrap">
                        {formatAmount(invoice.totalAmount)}
                      </td>

                      {/* Déjà Payé */}
                      <td className="p-3 text-sm text-right text-green-600 whitespace-nowrap">
                        {formatAmount(invoice.paidAmount)}
                      </td>

                      {/* Reste à Payer */}
                      <td className="p-3 text-sm text-right whitespace-nowrap">
                        <span
                          className={`font-bold ${
                            remainingAmount > 0 ? 'text-red-600' : 'text-green-600'
                          }`}
                        >
                          {formatAmount(remainingAmount)}
                        </span>
                      </td>

                      {/* Statut */}
                      <td className="p-3 text-center">
                        {getStatusBadge(invoice.status)}
                      </td>

                      {/* Échéance */}
                      <td className="p-3 text-sm text-center whitespace-nowrap">
                        <div
                          className={`${
                            isOverdue ? 'text-red-600 font-semibold' : 'text-[#6B7280]'
                          }`}
                        >
                          {formatDate(invoice.dueDate)}
                          {isOverdue && (
                            <div className="text-xs text-red-500 mt-1">RETARD</div>
                          )}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="p-3 text-right">
                        {invoice.status !== 'PAYEE' && (
                          <Button
                            size="sm"
                            onClick={() => handlePayInvoice(invoice)}
                            className="bg-[#4F46E5] hover:bg-[#4338CA] text-white"
                          >
                            Payer
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ============================================
          MODALS
          ============================================ */}
      
      {/* Modal : Enregistrer Facture */}
      <Modal
        isOpen={isAddInvoiceModalOpen}
        onClose={() => setIsAddInvoiceModalOpen(false)}
        title="Enregistrer une Facture"
      >
        <InvoiceForm
          supplierId={id!}
          projects={projects}
          onSubmit={handleInvoiceFormSubmit}
          onCancel={() => setIsAddInvoiceModalOpen(false)}
        />
      </Modal>

      {/* Modal : Effectuer Paiement */}
      {selectedInvoice && (
        <Modal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedInvoice(null);
          }}
          title="Effectuer un Paiement"
        >
          <PaymentForm
            invoice={selectedInvoice}
            onSubmit={handlePaymentFormSubmit}
            onCancel={() => {
              setIsPaymentModalOpen(false);
              setSelectedInvoice(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
}