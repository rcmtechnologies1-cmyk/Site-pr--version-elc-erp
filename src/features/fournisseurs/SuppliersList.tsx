import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Search, Plus, Package, AlertTriangle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/Modal';
import { SupplierForm } from './components/SupplierForm';
import { toast } from '@/lib/toast';
import type { Supplier, SupplierInvoice } from '@/types';

// ============================================
// INTERFACES TYPESCRIPT
// ============================================

interface SuppliersListProps {
  suppliers: Supplier[];
  invoices: SupplierInvoice[];
  onAddSupplier: (supplier: Supplier) => void;
}

// ============================================
// COMPOSANT SMART : LISTE DES FOURNISSEURS
// Gère l'état, les calculs, et l'affichage
// REÇOIT les données depuis App.tsx (état global)
// ============================================

export function SuppliersList({ suppliers, invoices, onAddSupplier }: SuppliersListProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);

  // ============================================
  // CALCULS - KPI GLOBAUX
  // ============================================

  /**
   * Dette Totale de l'Entreprise
   * Somme de tous les restes à payer (totalAmount - paidAmount)
   */
  const totalCompanyDebt = useMemo(() => {
    return invoices.reduce((sum, invoice) => {
      const remainingAmount = invoice.totalAmount - invoice.paidAmount;
      return sum + remainingAmount;
    }, 0);
  }, [invoices]);

  /**
   * Nombre de Factures en Retard
   * Factures dont la date d'échéance est dépassée ET qui ne sont pas entièrement payées
   */
  const overdueInvoicesCount = useMemo(() => {
    const today = new Date('2026-03-02'); // Date actuelle du système
    return invoices.filter(invoice => {
      const dueDate = new Date(invoice.dueDate);
      const isOverdue = dueDate < today;
      const isNotFullyPaid = invoice.status !== 'PAYEE';
      return isOverdue && isNotFullyPaid;
    }).length;
  }, [invoices]);

  /**
   * Nombre de Factures Non Payées
   */
  const unpaidInvoicesCount = useMemo(() => {
    return invoices.filter(invoice => invoice.status !== 'PAYEE').length;
  }, [invoices]);

  // ============================================
  // RECHERCHE - FILTRAGE DES FOURNISSEURS
  // ============================================

  /**
   * Calcule la dette actuelle pour chaque fournisseur (DYNAMIQUE)
   */
  const suppliersWithDebt = useMemo(() => {
    return suppliers.map(supplier => {
      // Trouver toutes les factures de ce fournisseur
      const supplierInvoices = invoices.filter(inv => inv.supplierId === supplier.id);
      
      // Calculer la dette (somme des restes à payer)
      const debt = supplierInvoices.reduce((sum, inv) => {
        return sum + (inv.totalAmount - inv.paidAmount);
      }, 0);

      return {
        ...supplier,
        totalDebt: debt
      };
    });
  }, [suppliers, invoices]);

  const filteredSuppliers = useMemo(() => {
    if (!searchTerm.trim()) return suppliersWithDebt;

    const term = searchTerm.toLowerCase();
    return suppliersWithDebt.filter(supplier =>
      supplier.name.toLowerCase().includes(term) ||
      supplier.category.toLowerCase().includes(term) ||
      supplier.phone.includes(term) ||
      supplier.email.toLowerCase().includes(term)
    );
  }, [suppliersWithDebt, searchTerm]);

  // ============================================
  // HANDLERS - ACTIONS UTILISATEUR
  // ============================================

  const handleSupplierClick = (supplierId: string) => {
    navigate(`/fournisseurs/${supplierId}`);
  };

  const handleAddSupplier = () => {
    setIsAddSupplierModalOpen(true);
  };

  const handleSupplierFormSubmit = (supplierData: Omit<Supplier, 'id' | 'totalDebt'>) => {
    const newSupplier: Supplier = {
      ...supplierData,
      id: `SUP-${Date.now()}`, // Génère un ID unique
      totalDebt: 0 // Nouvelle fournisseur sans dette initialement
    };
    onAddSupplier(newSupplier);
    setIsAddSupplierModalOpen(false);
    toast.success('Fournisseur ajouté avec succès');
  };

  // ============================================
  // UTILS - FORMATAGE
  // ============================================

  /**
   * Formate un montant en FCFA (en millions si > 1M)
   */
  const formatAmount = (amount: number): string => {
    if (amount === 0) return '0 FCFA';
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M FCFA`;
    }
    return `${(amount / 1000).toFixed(0)}K FCFA`;
  };

  /**
   * Traduit la catégorie en français
   */
  const getCategoryLabel = (category: Supplier['category']): string => {
    const labels = {
      MATERIAUX: 'Matériaux',
      ENGINS: 'Engins',
      SERVICES: 'Services',
      AUTRES: 'Autres'
    };
    return labels[category] || category;
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* ============================================
          HEADER
          ============================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#111827] mb-2">
            Fournisseurs & Dettes
          </h1>
          <p className="text-sm text-[#6B7280]">
            Gestion des achats à crédit et suivi des paiements
          </p>
        </div>

        <Button
          onClick={handleAddSupplier}
          className="bg-[#4F46E5] hover:bg-[#4338CA] text-white flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Nouveau Fournisseur
        </Button>
      </div>

      {/* ============================================
          KPI - INDICATEURS FINANCIERS
          ============================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* KPI 1 : Dette Totale (ROUGE - CRITIQUE) */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-[#6B7280] mb-1">
                Dette Totale Entreprise
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-red-600 mb-1">
                {formatAmount(totalCompanyDebt)}
              </p>
              <p className="text-xs text-[#9CA3AF]">
                À payer aux fournisseurs
              </p>
            </div>
            <div className="bg-red-100 rounded-full p-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>

        {/* KPI 2 : Factures en Retard */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-[#6B7280] mb-1">
                Factures en Retard
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1">
                {overdueInvoicesCount}
              </p>
              <p className="text-xs text-[#9CA3AF]">
                Échéance dépassée
              </p>
            </div>
            <div className="bg-orange-100 rounded-full p-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>

        {/* KPI 3 : Factures Non Payées */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-[#6B7280] mb-1">
                Factures Non Payées
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-[#111827] mb-1">
                {unpaidInvoicesCount}
              </p>
              <p className="text-xs text-[#9CA3AF]">
                Partielles ou impayées
              </p>
            </div>
            <div className="bg-gray-100 rounded-full p-2">
              <Package className="w-5 h-5 text-[#6B7280]" />
            </div>
          </div>
        </div>
      </div>

      {/* ============================================
          BARRE DE RECHERCHE
          ============================================ */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
          <Input
            type="text"
            placeholder="Rechercher un fournisseur (nom, catégorie, téléphone...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* ============================================
          TABLEAU DES FOURNISSEURS
          ============================================ */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Header du tableau (desktop uniquement) */}
        <div className="hidden md:grid md:grid-cols-5 gap-4 p-4 border-b border-gray-200 bg-[#F9FAFB] font-medium text-sm text-[#6B7280]">
          <div>Fournisseur</div>
          <div>Catégorie</div>
          <div>Contact</div>
          <div>Dette Actuelle</div>
          <div className="text-right">Actions</div>
        </div>

        {/* Liste des fournisseurs */}
        <div className="divide-y divide-gray-200">
          {filteredSuppliers.length === 0 ? (
            <div className="p-8 text-center text-[#6B7280]">
              <Package className="w-12 h-12 mx-auto mb-3 text-[#D1D5DB]" />
              <p className="font-medium">Aucun fournisseur trouvé</p>
              <p className="text-sm mt-1">
                Essayez de modifier votre recherche ou ajoutez un nouveau fournisseur.
              </p>
            </div>
          ) : (
            filteredSuppliers.map((supplier) => (
              <div
                key={supplier.id}
                onClick={() => handleSupplierClick(supplier.id)}
                className="p-4 hover:bg-[#F9FAFB] cursor-pointer transition-colors md:grid md:grid-cols-5 md:gap-4 md:items-center"
              >
                {/* Nom du fournisseur */}
                <div className="mb-2 md:mb-0">
                  <p className="font-semibold text-[#111827]">{supplier.name}</p>
                  <p className="text-sm text-[#6B7280] md:hidden">
                    {getCategoryLabel(supplier.category)}
                  </p>
                </div>

                {/* Catégorie (desktop uniquement) */}
                <div className="hidden md:block">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EEF2FF] text-[#4F46E5]">
                    {getCategoryLabel(supplier.category)}
                  </span>
                </div>

                {/* Contact */}
                <div className="text-sm text-[#6B7280] mb-2 md:mb-0">
                  <p>{supplier.phone}</p>
                  <p className="text-xs hidden md:block">{supplier.email}</p>
                </div>

                {/* Dette Actuelle */}
                <div className="mb-2 md:mb-0">
                  <p
                    className={`font-bold ${
                      supplier.totalDebt > 0 ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    {formatAmount(supplier.totalDebt)}
                  </p>
                  <p className="text-xs text-[#9CA3AF]">
                    {supplier.totalDebt > 0 ? 'À payer' : 'Aucune dette'}
                  </p>
                </div>

                {/* Action */}
                <div className="md:text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-[#4F46E5] border-[#4F46E5] hover:bg-[#EEF2FF] w-full md:w-auto"
                  >
                    Voir Factures
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer / Stats */}
      <div className="mt-6 text-center text-sm text-[#9CA3AF]">
        <p>
          Total : {filteredSuppliers.length} fournisseur{filteredSuppliers.length > 1 ? 's' : ''}
          {searchTerm && ` (filtré${filteredSuppliers.length > 1 ? 's' : ''})`}
        </p>
      </div>

      {/* Modal d'ajout de fournisseur */}
      <Modal
        isOpen={isAddSupplierModalOpen}
        onClose={() => setIsAddSupplierModalOpen(false)}
        title="Ajouter un nouveau fournisseur"
      >
        <SupplierForm 
          onSubmit={handleSupplierFormSubmit}
          onCancel={() => setIsAddSupplierModalOpen(false)}
        />
      </Modal>
    </div>
  );
}