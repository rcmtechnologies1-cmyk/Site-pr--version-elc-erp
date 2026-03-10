import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RouteGuard } from '@/components/auth/RouteGuard';
import { LoginPage } from '@/features/auth/LoginPage';
import { Dashboard } from '@/features/dashboard/Dashboard';
import { ChantiersList } from '@/features/chantiers/ChantiersList';
import { ChantierDetails } from '@/features/chantiers/ChantierDetails';
import { PersonnelList } from '@/features/personnel/PersonnelList';
import { SuppliersList } from '@/features/fournisseurs/SuppliersList';
import { SupplierDetails } from '@/features/fournisseurs/SupplierDetails';
import { ClientsList } from '@/features/clients/ClientsList';
import { SettingsPage } from '@/features/settings/SettingsPage'; // ✨ Import du module Paramètres
import { MainLayout } from '@/components/layout/MainLayout';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { 
  MOCK_PROJECTS, 
  MOCK_TRANSACTIONS, 
  MOCK_SUPPLIERS, 
  MOCK_SUPPLIER_INVOICES, 
  MOCK_SUPPLIER_PAYMENTS 
} from '@/data/mockData';
import { MOCK_CLIENTS } from '@/data/mockClients';
import type { Project, Transaction, Supplier, SupplierInvoice, SupplierPayment, Client } from '@/types';
import '@/styles/index.css';

// ============================================
// COMPOSANT PRINCIPAL AVEC REACT ROUTER
// Gère le routage ET l'état global (projets/transactions/fournisseurs)
// L'authentification est maintenant gérée par AuthContext
// ============================================

export default function App() {
  // ============================================
  // ÉTAT GLOBAL - PERSISTENCE AVEC LOCALSTORAGE
  // ============================================

  // Initialisation des projets depuis localStorage ou MOCK_PROJECTS
  const [projects, setProjects] = useState<Project[]>(() => {
    const stored = localStorage.getItem('elc_btp_projects');
    return stored ? JSON.parse(stored) : MOCK_PROJECTS;
  });

  // Initialisation des transactions depuis localStorage ou MOCK_TRANSACTIONS
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const stored = localStorage.getItem('elc_btp_transactions');
    return stored ? JSON.parse(stored) : MOCK_TRANSACTIONS;
  });

  // 🔧 DEBUG : Fonction pour réinitialiser les données (DEV MODE)
  // Accessible via console : window.resetELCData()
  useEffect(() => {
    (window as any).resetELCData = () => {
      console.log('🔄 Réinitialisation des données...');
      localStorage.removeItem('elc_btp_projects');
      localStorage.removeItem('elc_btp_transactions');
      localStorage.removeItem('elc_btp_suppliers');
      localStorage.removeItem('elc_btp_invoices');
      localStorage.removeItem('elc_btp_payments');
      localStorage.removeItem('elc_btp_clients');
      console.log('✅ Données réinitialisées ! Rechargez la page (F5)');
    };
  }, []);

  // ✨ NOUVEAUX ÉTATS POUR LE MODULE FOURNISSEURS
  
  // Initialisation des fournisseurs depuis localStorage ou MOCK_SUPPLIERS
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const stored = localStorage.getItem('elc_btp_suppliers');
    return stored ? JSON.parse(stored) : MOCK_SUPPLIERS;
  });

  // Initialisation des factures depuis localStorage ou MOCK_SUPPLIER_INVOICES
  const [invoices, setInvoices] = useState<SupplierInvoice[]>(() => {
    const stored = localStorage.getItem('elc_btp_invoices');
    return stored ? JSON.parse(stored) : MOCK_SUPPLIER_INVOICES;
  });

  // Initialisation des paiements depuis localStorage ou MOCK_SUPPLIER_PAYMENTS
  const [payments, setPayments] = useState<SupplierPayment[]>(() => {
    const stored = localStorage.getItem('elc_btp_payments');
    return stored ? JSON.parse(stored) : MOCK_SUPPLIER_PAYMENTS;
  });

  // ✨ NOUVEAUX ÉTATS POUR LE MODULE CLIENTS
  
  // Initialisation des clients depuis localStorage ou MOCK_CLIENTS
  const [clients, setClients] = useState<Client[]>(() => {
    const stored = localStorage.getItem('elc_btp_clients');
    return stored ? JSON.parse(stored) : MOCK_CLIENTS;
  });

  // ============================================
  // EFFET: Sauvegarde automatique dans localStorage
  // ============================================
  
  useEffect(() => {
    localStorage.setItem('elc_btp_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('elc_btp_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // ✨ NOUVEAUX EFFETS POUR LE MODULE FOURNISSEURS

  useEffect(() => {
    localStorage.setItem('elc_btp_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('elc_btp_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('elc_btp_payments', JSON.stringify(payments));
  }, [payments]);

  // ✨ NOUVEAUX EFFETS POUR LE MODULE CLIENTS

  useEffect(() => {
    localStorage.setItem('elc_btp_clients', JSON.stringify(clients));
  }, [clients]);

  // ============================================
  // HANDLERS - GESTION DES PROJETS
  // ============================================
  
  /**
   * Ajoute un nouveau projet
   */
  const handleAddProject = (newProject: Project) => {
    setProjects([newProject, ...projects]);
  };

  /**
   * Met à jour un projet existant
   */
  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(projects.map(p => 
      p.id === updatedProject.id ? updatedProject : p
    ));
  };

  /**
   * Supprime un projet
   */
  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
    // Supprimer aussi les transactions associées
    setTransactions(transactions.filter(t => t.projectId !== projectId));
  };

  // ============================================
  // HANDLERS - GESTION DES TRANSACTIONS
  // ============================================
  
  /**
   * Ajoute une nouvelle transaction
   */
  const handleAddTransaction = (newTransaction: Transaction) => {
    setTransactions([newTransaction, ...transactions]);
  };

  /**
   * Met à jour une transaction existante
   */
  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
    setTransactions(transactions.map(t => 
      t.id === updatedTransaction.id ? updatedTransaction : t
    ));
  };

  /**
   * Supprime une transaction
   */
  const handleDeleteTransaction = (transactionId: string) => {
    setTransactions(transactions.filter(t => t.id !== transactionId));
  };

  // ============================================
  // ✨ HANDLERS - GESTION DES FOURNISSEURS
  // ============================================
  
  /**
   * Ajoute un nouveau fournisseur
   */
  const handleAddSupplier = (newSupplier: Supplier) => {
    setSuppliers([newSupplier, ...suppliers]);
  };

  /**
   * Met à jour un fournisseur existant
   */
  const handleUpdateSupplier = (updatedSupplier: Supplier) => {
    setSuppliers(suppliers.map(s => 
      s.id === updatedSupplier.id ? updatedSupplier : s
    ));
  };

  /**
   * Supprime un fournisseur
   */
  const handleDeleteSupplier = (supplierId: string) => {
    setSuppliers(suppliers.filter(s => s.id !== supplierId));
    // Supprimer aussi les factures et paiements associés
    const invoiceIds = invoices.filter(i => i.supplierId === supplierId).map(i => i.id);
    setInvoices(invoices.filter(i => i.supplierId !== supplierId));
    setPayments(payments.filter(p => !invoiceIds.includes(p.invoiceId)));
  };

  // ============================================
  // ✨ HANDLERS - GESTION DES FACTURES FOURNISSEURS
  // ============================================
  
  /**
   * Ajoute une nouvelle facture
   */
  const handleAddInvoice = (newInvoice: SupplierInvoice) => {
    setInvoices([newInvoice, ...invoices]);
  };

  /**
   * Met à jour une facture existante
   */
  const handleUpdateInvoice = (updatedInvoice: SupplierInvoice) => {
    setInvoices(invoices.map(i => 
      i.id === updatedInvoice.id ? updatedInvoice : i
    ));
  };

  /**
   * Supprime une facture
   */
  const handleDeleteInvoice = (invoiceId: string) => {
    setInvoices(invoices.filter(i => i.id !== invoiceId));
    // Supprimer aussi les paiements associés
    setPayments(payments.filter(p => p.invoiceId !== invoiceId));
  };

  // ============================================
  // ✨ HANDLERS - GESTION DES PAIEMENTS (LOGIQUE MÉTIER CRITIQUE)
  // ============================================
  
  /**
   * Ajoute un nouveau paiement et met à jour la facture correspondante
   * 🎯 LOGIQUE MÉTIER CRITIQUE (UNIFICATION FINANCIÈRE) :
   * - Ajoute le paiement à la liste payments
   * - Met à jour paidAmount de la facture
   * - Met à jour le statut de la facture (PAYEE, PARTIELLE, NON_PAYEE)
   * - ✨ GÉNÈRE AUTOMATIQUEMENT UNE TRANSACTION DE DÉPENSE (Lien Fournisseurs → Trésorerie)
   */
  const handleAddPayment = (newPayment: SupplierPayment) => {
    // 1. Ajouter le paiement à la liste
    setPayments([newPayment, ...payments]);

    // 2. Trouver la facture correspondante
    const invoice = invoices.find(i => i.id === newPayment.invoiceId);
    
    if (invoice) {
      // 3. Trouver le fournisseur
      const supplier = suppliers.find(s => s.id === invoice.supplierId);

      // 4. Calculer le nouveau montant payé
      const newPaidAmount = invoice.paidAmount + newPayment.amount;

      // 5. Déterminer le nouveau statut
      let newStatus: 'PAYEE' | 'PARTIELLE' | 'NON_PAYEE';
      if (newPaidAmount >= invoice.totalAmount) {
        newStatus = 'PAYEE';
      } else if (newPaidAmount > 0) {
        newStatus = 'PARTIELLE';
      } else {
        newStatus = 'NON_PAYEE';
      }

      // 6. Mettre à jour la facture
      const updatedInvoice: SupplierInvoice = {
        ...invoice,
        paidAmount: newPaidAmount,
        status: newStatus
      };

      setInvoices(invoices.map(i => 
        i.id === newPayment.invoiceId ? updatedInvoice : i
      ));

      // ✨ 7. GÉNÉRATION AUTOMATIQUE D'UNE TRANSACTION DE DÉPENSE
      // Ceci crée la boucle comptable parfaite !
      const newTransaction: Transaction = {
        id: `TRX-${Date.now()}`,
        type: 'DEPENSE',
        amount: newPayment.amount,
        date: newPayment.date,
        description: `Paiement Facture ${invoice.invoiceNumber} - ${supplier?.name || 'Fournisseur'}`,
        project: invoice.projectId || 'Frais Généraux',
        category: 'Fournisseurs'
      };

      // Ajouter la transaction à la liste globale
      setTransactions(prev => [newTransaction, ...prev]);
    }
  };

  /**
   * Met à jour un paiement existant
   */
  const handleUpdatePayment = (updatedPayment: SupplierPayment) => {
    setPayments(payments.map(p => 
      p.id === updatedPayment.id ? updatedPayment : p
    ));
  };

  /**
   * Supprime un paiement et recalcule la facture
   */
  const handleDeletePayment = (paymentId: string) => {
    const payment = payments.find(p => p.id === paymentId);
    
    if (payment) {
      // Retirer le paiement
      setPayments(payments.filter(p => p.id !== paymentId));

      // Recalculer la facture
      const invoice = invoices.find(i => i.id === payment.invoiceId);
      
      if (invoice) {
        const newPaidAmount = invoice.paidAmount - payment.amount;

        let newStatus: 'PAYEE' | 'PARTIELLE' | 'NON_PAYEE';
        if (newPaidAmount >= invoice.totalAmount) {
          newStatus = 'PAYEE';
        } else if (newPaidAmount > 0) {
          newStatus = 'PARTIELLE';
        } else {
          newStatus = 'NON_PAYEE';
        }

        const updatedInvoice: SupplierInvoice = {
          ...invoice,
          paidAmount: newPaidAmount,
          status: newStatus
        };

        setInvoices(invoices.map(i => 
          i.id === payment.invoiceId ? updatedInvoice : i
        ));
      }
    }
  };

  // ============================================
  // ✨ HANDLERS - GESTION DES CLIENTS
  // ============================================
  
  /**
   * Ajoute un nouveau client
   */
  const handleAddClient = (newClient: Client) => {
    setClients([newClient, ...clients]);
  };

  // ============================================
  // RENDER: Configuration des Routes
  // ============================================
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Route: Page de connexion */}
            <Route 
              path="/login" 
              element={
                <LoginPage 
                  defaultEmail="comptable@elcbtp.com"
                />
              } 
            />

            {/* Routes protégées avec MainLayout (Sidebar) */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              {/* Redirection par défaut vers Dashboard */}
              <Route index element={<Navigate to="/dashboard" replace />} />

              {/* Route: Dashboard - Accessible à tous */}
              <Route 
                path="dashboard" 
                element={<Dashboard projects={projects} transactions={transactions} clients={clients} onAddProject={handleAddProject} />} 
              />

              {/* Route: Liste des chantiers - SECRETAIRE, DIRECTEUR, ADMIN */}
              <Route 
                path="chantiers" 
                element={
                  <RouteGuard module="projects">
                    <ChantiersList 
                      projects={projects}
                      onAddProject={handleAddProject}
                      onUpdateProject={handleUpdateProject}
                      onDeleteProject={handleDeleteProject}
                      clients={clients} // ✨ Passer la liste des clients
                    />
                  </RouteGuard>
                } 
              />

              {/* Route: Détails d'un chantier (dynamique) - SECRETAIRE, DIRECTEUR, ADMIN */}
              <Route 
                path="chantiers/:id" 
                element={
                  <RouteGuard module="projects">
                    <ChantierDetails 
                      projects={projects}
                      transactions={transactions}
                      onAddTransaction={handleAddTransaction}
                    />
                  </RouteGuard>
                } 
              />

              {/* Route: Liste du personnel - SECRETAIRE, DIRECTEUR, ADMIN */}
              <Route 
                path="personnel" 
                element={
                  <RouteGuard module="personnel">
                    <PersonnelList />
                  </RouteGuard>
                } 
              />

              {/* Route: Liste des fournisseurs - COMPTABLE, DIRECTEUR, ADMIN */}
              <Route 
                path="fournisseurs" 
                element={
                  <RouteGuard module="suppliers">
                    <SuppliersList 
                      suppliers={suppliers}
                      invoices={invoices}
                      onAddSupplier={handleAddSupplier}
                    />
                  </RouteGuard>
                } 
              />

              {/* Route: Détails d'un fournisseur (dynamique) - COMPTABLE, DIRECTEUR, ADMIN */}
              <Route 
                path="fournisseurs/:id" 
                element={
                  <RouteGuard module="suppliers">
                    <SupplierDetails 
                      suppliers={suppliers}
                      invoices={invoices}
                      payments={payments}
                      projects={projects}
                      onAddInvoice={handleAddInvoice}
                      onAddPayment={handleAddPayment}
                    />
                  </RouteGuard>
                } 
              />

              {/* Route: Liste des clients - SECRETAIRE, DIRECTEUR, ADMIN */}
              <Route 
                path="clients" 
                element={
                  <RouteGuard module="clients">
                    <ClientsList 
                      clients={clients}
                      onAddClient={handleAddClient}
                    />
                  </RouteGuard>
                } 
              />

              {/* Routes futures (placeholders) */}
              <Route 
                path="factures" 
                element={
                  <RouteGuard module="invoices">
                    <div className="p-8">
                      <h1 className="text-2xl font-semibold text-[#111827] mb-4">
                        Factures
                      </h1>
                      <p className="text-[#6B7280]">
                        Page en cours de développement...
                      </p>
                    </div>
                  </RouteGuard>
                } 
              />
              <Route 
                path="finance" 
                element={
                  <RouteGuard module="finance">
                    <div className="p-8">
                      <h1 className="text-2xl font-semibold text-[#111827] mb-4">
                        Finance
                      </h1>
                      <p className="text-[#6B7280]">
                        Page en cours de développement...
                      </p>
                    </div>
                  </RouteGuard>
                } 
              />
              <Route 
                path="parametres" 
                element={
                  <RouteGuard module="settings">
                    <SettingsPage />
                  </RouteGuard>
                } 
              />

              {/* Route 404 - Page non trouvée */}
              <Route 
                path="*" 
                element={
                  <div className="p-8">
                    <h1 className="text-2xl font-semibold text-[#111827] mb-4">
                      Page non trouvée
                    </h1>
                    <p className="text-[#6B7280] mb-4">
                      La page que vous recherchez n'existe pas.
                    </p>
                    <a 
                      href="/dashboard" 
                      className="text-[#4F46E5] hover:underline"
                    >
                      Retour au tableau de bord
                    </a>
                  </div>
                } 
              />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      
      {/* Toast Notifications Provider */}
      <ToastProvider />
    </>
  );
}