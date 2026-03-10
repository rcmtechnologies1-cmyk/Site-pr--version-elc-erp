import { useState } from 'react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { MOCK_PROJECT_DETAILS } from '@/data/mockData';
import { Modal } from '@/components/ui/Modal';
import { TransactionForm } from './components/TransactionForm';
import { toast } from '@/lib/toast';
import type { Transaction, Project } from '@/types';

// ============================================
// INTERFACES TYPESCRIPT
// ============================================

interface ChantierDetailsProps {
  projects: Project[];
  transactions: Transaction[];
  onAddTransaction: (transaction: Transaction) => void;
}

// ============================================
// COMPOSANT DÉTAILS CHANTIER (SMART)
// Gère le routage et l'affichage des détails
// REÇOIT les données depuis App.tsx (état global)
// ============================================

export function ChantierDetails({ projects, transactions, onAddTransaction }: ChantierDetailsProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // ============================================
  // ÉTAT LOCAL (uniquement pour l'UI)
  // ============================================
  
  // État pour gérer l'ouverture/fermeture de la modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ============================================
  // LOGIQUE: Récupération des données
  // ============================================

  // Vérification que le projet existe
  const projectExists = projects.find(p => p.id === id);
  
  if (!projectExists) {
    // Si le projet n'existe pas, rediriger vers la liste des chantiers
    navigate('/chantiers', { replace: true });
    return null;
  }

  // Pour la démo, on utilise toujours MOCK_PROJECT_DETAILS pour les détails
  // En production, on ferait: const project = await api.getProject(id)
  const project: ProjectDetails = {
    ...MOCK_PROJECT_DETAILS,
    id: id || '1',
    name: projectExists.name,
    clientName: projectExists.clientName,
    location: projectExists.location,
    budgetTotal: projectExists.budgetTotal,
    status: projectExists.status,
    startDate: projectExists.startDate,
    endDate: projectExists.endDate
  };

  // Filtrer les transactions pour ce projet (avec useMemo pour optimisation)
  const projectTransactions = useMemo(() => {
    return transactions.filter(t => t.projectId === id);
  }, [transactions, id]);

  // ============================================
  // CALCULS DÉRIVÉS (basés sur les transactions)
  // Les KPI se recalculent automatiquement quand transactions change
  // ============================================
  
  const totalEncaisse = projectTransactions
    .filter(t => t.type === 'RECETTE')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalDecaisse = projectTransactions
    .filter(t => t.type === 'DEPENSE')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const soldeActuel = project.budgetTotal - totalDecaisse;

  // ============================================
  // HANDLERS
  // ============================================

  /**
   * Retour vers la liste des chantiers
   */
  const handleBack = () => {
    navigate('/chantiers');
  };

  /**
   * Ajout d'une transaction
   * TODO: Ouvrir une modal et appeler l'API
   */
  const handleAddTransaction = () => {
    setIsModalOpen(true);
  };

  /**
   * Fermeture de la modal
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  /**
   * Ajout d'une transaction à partir du formulaire
   * @param transactionData Nouvelle transaction à ajouter
   */
  const handleSubmitTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    // Générer un ID fictif unique (timestamp + random)
    const newId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Créer la transaction complète avec l'ID
    const newTransaction: Transaction = {
      ...transactionData,
      id: newId,
      projectId: id || '1'
    };

    // Appeler le handler du parent (App.tsx) pour ajouter la transaction
    onAddTransaction(newTransaction);

    // Fermer la modal
    setIsModalOpen(false);

    // Afficher un message de succès
    toast.success('Transaction ajoutée avec succès');
  };

  /**
   * Suppression d'une transaction (pour la démo, affiche un message)
   * @param transactionId ID de la transaction à supprimer
   */
  const handleDeleteTransaction = (transactionId: string) => {
    // Pour la démo client, on affiche un message "feature à venir"
    toast.warning('La suppression sera activée lors de la connexion au serveur sécurisé.');
  };

  // ============================================
  // FONCTIONS UTILITAIRES
  // ============================================
  
  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR').format(amount);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // ============================================
  // BADGE DE STATUT
  // ============================================
  
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'en cours': { color: '#4F46E5', bgColor: '#EEF2FF', label: 'En cours' },
      'terminé': { color: '#10B981', bgColor: '#ECFDF5', label: 'Terminé' },
      'en attente': { color: '#F59E0B', bgColor: '#FFFBEB', label: 'En attente' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['en cours'];

    return (
      <div 
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg"
        style={{ backgroundColor: config.bgColor }}
      >
        <div 
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: config.color }}
        />
        <span 
          className="text-sm font-medium"
          style={{ color: config.color }}
        >
          {config.label}
        </span>
      </div>
    );
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="space-y-4 sm:space-y-6">
        {/* ============================================
            HEADER : Bouton retour + Titre + Actions
            ============================================ */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-3 flex-1">
            {/* Bouton Retour */}
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-sm transition-colors hover:text-[#111827]"
              style={{ color: '#6B7280' }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour aux chantiers</span>
            </button>

            {/* Titre + Badge Statut */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h1 
                className="text-2xl sm:text-3xl font-semibold"
                style={{ color: '#111827' }}
              >
                {project.name}
              </h1>
              {getStatusBadge(project.status)}
            </div>

            {/* Informations secondaires */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm" style={{ color: '#6B7280' }}>
              <span>Client : <span className="font-medium" style={{ color: '#111827' }}>{project.clientName}</span></span>
              <span className="hidden sm:inline">•</span>
              <span>{project.location}</span>
            </div>
          </div>

          {/* Bouton Nouvelle Transaction */}
          <button
            onClick={handleAddTransaction}
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-white transition-all hover:opacity-90 w-full sm:w-auto"
            style={{ 
              backgroundColor: '#4F46E5',
              borderRadius: '8px'
            }}
          >
            <Plus className="w-4 h-4" />
            <span className="font-medium">Nouvelle Transaction</span>
          </button>
        </div>

        {/* ============================================
            SECTION KPI : Grille Responsive
            ============================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1 : Budget Total */}
          <div 
            className="p-4 sm:p-6 rounded-xl"
            style={{ 
              backgroundColor: '#FFFFFF',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
            }}
          >
            <p className="text-sm mb-2" style={{ color: '#6B7280' }}>
              Budget Total
            </p>
            <p className="text-xl sm:text-2xl font-semibold mb-1" style={{ color: '#111827' }}>
              {formatAmount(project.budgetTotal)}
            </p>
            <p className="text-xs" style={{ color: '#6B7280' }}>
              FCFA
            </p>
          </div>

          {/* KPI 2 : Total Encaissé */}
          <div 
            className="p-4 sm:p-6 rounded-xl"
            style={{ 
              backgroundColor: '#FFFFFF',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
            }}
          >
            <p className="text-sm mb-2" style={{ color: '#6B7280' }}>
              Total Encaissé
            </p>
            <p className="text-xl sm:text-2xl font-semibold mb-1" style={{ color: '#10B981' }}>
              {formatAmount(totalEncaisse)}
            </p>
            <p className="text-xs" style={{ color: '#6B7280' }}>
              FCFA
            </p>
          </div>

          {/* KPI 3 : Total Décaissé */}
          <div 
            className="p-4 sm:p-6 rounded-xl"
            style={{ 
              backgroundColor: '#FFFFFF',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
            }}
          >
            <p className="text-sm mb-2" style={{ color: '#6B7280' }}>
              Total Décaissé
            </p>
            <p className="text-xl sm:text-2xl font-semibold mb-1" style={{ color: '#EF4444' }}>
              {formatAmount(totalDecaisse)}
            </p>
            <p className="text-xs" style={{ color: '#6B7280' }}>
              FCFA
            </p>
          </div>

          {/* KPI 4 : Solde Actuel */}
          <div 
            className="p-4 sm:p-6 rounded-xl"
            style={{ 
              backgroundColor: '#FFFFFF',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
            }}
          >
            <p className="text-sm mb-2" style={{ color: '#6B7280' }}>
              Solde Actuel
            </p>
            <p className="text-xl sm:text-2xl font-semibold mb-1" style={{ color: '#4F46E5' }}>
              {formatAmount(soldeActuel)}
            </p>
            <p className="text-xs" style={{ color: '#6B7280' }}>
              FCFA
            </p>
          </div>
        </div>

        {/* ============================================
            TABLEAU DES TRANSACTIONS
            ============================================ */}
        <div 
          className="p-4 sm:p-6 rounded-xl"
          style={{ 
            backgroundColor: '#FFFFFF',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
          }}
        >
          <h2 
            className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6"
            style={{ color: '#111827' }}
          >
            Historique des Transactions
          </h2>

          {projectTransactions.length === 0 ? (
            <div className="text-center py-12">
              <p style={{ color: '#6B7280' }}>
                Aucune transaction enregistrée pour ce chantier.
              </p>
            </div>
          ) : (
            <>
              {/* TABLEAU DESKTOP (masqué sur mobile) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                      <th 
                        className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wide"
                        style={{ color: '#6B7280' }}
                      >
                        Date
                      </th>
                      <th 
                        className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wide"
                        style={{ color: '#6B7280' }}
                      >
                        Description
                      </th>
                      <th 
                        className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wide"
                        style={{ color: '#6B7280' }}
                      >
                        Type
                      </th>
                      <th 
                        className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wide"
                        style={{ color: '#6B7280' }}
                      >
                        Moyen de paiement
                      </th>
                      <th 
                        className="text-right py-3 px-4 text-xs font-medium uppercase tracking-wide"
                        style={{ color: '#6B7280' }}
                      >
                        Montant
                      </th>
                      <th 
                        className="text-right py-3 px-4 text-xs font-medium uppercase tracking-wide"
                        style={{ color: '#6B7280' }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectTransactions.map((transaction, index) => (
                      <tr 
                        key={transaction.id}
                        style={{ 
                          borderBottom: index < projectTransactions.length - 1 ? '1px solid #E5E7EB' : 'none'
                        }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {/* Date */}
                        <td className="py-4 px-4">
                          <span className="text-sm" style={{ color: '#111827' }}>
                            {formatDate(transaction.date)}
                          </span>
                        </td>

                        {/* Description */}
                        <td className="py-4 px-4">
                          <span className="text-sm font-medium" style={{ color: '#111827' }}>
                            {transaction.description}
                          </span>
                        </td>

                        {/* Type (Badge) */}
                        <td className="py-4 px-4">
                          {transaction.type === 'RECETTE' ? (
                            <span 
                              className="inline-flex px-2.5 py-1 rounded-md text-xs font-medium"
                              style={{ 
                                backgroundColor: '#ECFDF5',
                                color: '#10B981'
                              }}
                            >
                              Recette
                            </span>
                          ) : (
                            <span 
                              className="inline-flex px-2.5 py-1 rounded-md text-xs font-medium"
                              style={{ 
                                backgroundColor: '#FEE2E2',
                                color: '#EF4444'
                              }}
                            >
                              Dépense
                            </span>
                          )}
                        </td>

                        {/* Moyen de paiement */}
                        <td className="py-4 px-4">
                          <span className="text-sm" style={{ color: '#6B7280' }}>
                            {transaction.paymentMethod}
                          </span>
                        </td>

                        {/* Montant */}
                        <td className="py-4 px-4 text-right">
                          <span 
                            className="text-sm font-semibold"
                            style={{ 
                              color: transaction.type === 'RECETTE' ? '#10B981' : '#EF4444'
                            }}
                          >
                            {transaction.type === 'RECETTE' ? '+' : '-'} {formatAmount(transaction.amount)} FCFA
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => handleDeleteTransaction(transaction.id)}
                            className="inline-flex items-center justify-center p-2 rounded-lg transition-all hover:bg-red-50"
                            style={{ color: '#9CA3AF' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#EF4444'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
                            title="Supprimer la transaction"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* CARTES MOBILE (visibles uniquement sur mobile) */}
              <div className="md:hidden space-y-3">
                {projectTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="p-4 rounded-lg border border-[#E5E7EB]"
                    style={{ backgroundColor: '#FFFFFF' }}
                  >
                    {/* Header de la carte */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium mb-1" style={{ color: '#111827' }}>
                          {transaction.description}
                        </p>
                        <p className="text-xs" style={{ color: '#6B7280' }}>
                          {formatDate(transaction.date)}
                        </p>
                      </div>
                      {transaction.type === 'RECETTE' ? (
                        <span 
                          className="inline-flex px-2.5 py-1 rounded-md text-xs font-medium"
                          style={{ 
                            backgroundColor: '#ECFDF5',
                            color: '#10B981'
                          }}
                        >
                          Recette
                        </span>
                      ) : (
                        <span 
                          className="inline-flex px-2.5 py-1 rounded-md text-xs font-medium"
                          style={{ 
                            backgroundColor: '#FEE2E2',
                            color: '#EF4444'
                          }}
                        >
                          Dépense
                        </span>
                      )}
                    </div>

                    {/* Informations */}
                    <div className="space-y-2 pt-3 border-t border-[#E5E7EB]">
                      <div className="flex items-center justify-between text-sm">
                        <span style={{ color: '#6B7280' }}>Moyen de paiement:</span>
                        <span style={{ color: '#111827' }}>{transaction.paymentMethod}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm" style={{ color: '#6B7280' }}>Montant:</span>
                        <span 
                          className="text-base font-semibold"
                          style={{ 
                            color: transaction.type === 'RECETTE' ? '#10B981' : '#EF4444'
                          }}
                        >
                          {transaction.type === 'RECETTE' ? '+' : '-'} {formatAmount(transaction.amount)} FCFA
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ============================================
          MODAL POUR AJOUTER UNE TRANSACTION
          ============================================ */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title="Nouvelle Transaction"
      >
        <TransactionForm 
          onSubmit={handleSubmitTransaction}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
}