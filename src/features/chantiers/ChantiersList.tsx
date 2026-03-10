import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { Plus, Search, FolderOpen, Edit2, Trash2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { ChantierForm } from './components/ChantierForm';
import { toast } from '@/lib/toast';
import type { Project, Client } from '@/types';

// ============================================
// INTERFACES TYPESCRIPT
// ============================================

interface ChantiersListProps {
  projects: Project[];
  onAddProject: (project: Project) => void;
  onUpdateProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  clients: Client[]; // ✨ Liste des clients pour le formulaire
}

// ============================================
// COMPOSANT LISTE DES CHANTIERS (SMART)
// Gère l'affichage, la recherche et la création
// REÇOIT les données depuis App.tsx (état global)
// ============================================

export function ChantiersList({ projects, onAddProject, onUpdateProject, onDeleteProject, clients }: ChantiersListProps) {
  // ============================================
  // ÉTAT LOCAL (uniquement pour l'UI)
  // ============================================
  
  // Terme de recherche pour filtrer les projets
  const [searchTerm, setSearchTerm] = useState('');
  
  // État pour gérer l'ouverture/fermeture de la modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✨ NOUVEAUX ÉTATS POUR LE CRUD
  // État pour l'édition (stocke le projet à modifier)
  const [itemToEdit, setItemToEdit] = useState<Project | null>(null);

  // État pour la suppression (stocke le projet à supprimer)
  const [itemToDelete, setItemToDelete] = useState<Project | null>(null);

  // ============================================
  // CALCUL DRIVÉ : Projets filtrés
  // ============================================
  
  const filteredProjects = useMemo(() => {
    if (!searchTerm.trim()) {
      return projects;
    }

    const term = searchTerm.toLowerCase();
    
    return projects.filter(project => 
      project.name.toLowerCase().includes(term) ||
      project.clientName.toLowerCase().includes(term) ||
      project.location.toLowerCase().includes(term)
    );
  }, [projects, searchTerm]);

  // ============================================
  // HANDLERS
  // ============================================

  /**
   * Ouvre la modal de création
   */
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  /**
   * Ferme la modal de création
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  /**
   * Crée un nouveau projet
   */
  const handleCreateProject = (projectData: Omit<Project, 'id'>) => {
    // Générer un ID fictif unique (timestamp + random)
    const newId = `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Créer le projet complet avec l'ID
    const newProject: Project = {
      ...projectData,
      id: newId
    };

    // Ajouter le projet en DÉBUT de liste (plus récent en premier)
    onAddProject(newProject);

    // Fermer la modal
    setIsModalOpen(false);

    // Afficher un message de succès
    toast.success('Chantier créé avec succès !');
  };

  /**
   * Ouvre la modal d'édition
   */
  const handleEdit = (project: Project) => {
    setItemToEdit(project);
    setIsModalOpen(true);
  };

  /**
   * Met à jour un projet existant
   */
  const handleUpdateProject = (projectData: Omit<Project, 'id'>) => {
    if (!itemToEdit) return;

    const updatedProject: Project = {
      ...projectData,
      id: itemToEdit.id
    };

    onUpdateProject(updatedProject); // onUpdateProject gère aussi la mise à jour
    setIsModalOpen(false);
    setItemToEdit(null);
    toast.success('Chantier modifié avec succès');
  };

  /**
   * Handler unifié pour création OU édition
   */
  const handleSubmit = (projectData: Omit<Project, 'id'>) => {
    if (itemToEdit) {
      handleUpdateProject(projectData);
    } else {
      handleCreateProject(projectData);
    }
  };

  /**
   * Ouvre la modal de confirmation de suppression
   */
  const handleDeleteClick = (project: Project) => {
    setItemToDelete(project);
  };

  /**
   * Supprime définitivement le projet
   */
  const handleConfirmDelete = () => {
    if (!itemToDelete) return;

    // Pour l'instant, affiche un warning (backend gelé)
    toast.warning('La suppression sera activée avec le backend');
    setItemToDelete(null);
  };

  /**
   * Annule la suppression
   */
  const handleCancelDelete = () => {
    setItemToDelete(null);
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
      'en cours': { color: '#4F46E5', bgColor: '#EEF2FF', label: 'En cours', icon: '🚧' },
      'terminé': { color: '#10B981', bgColor: '#ECFDF5', label: 'Terminé', icon: '✅' },
      'en attente': { color: '#F59E0B', bgColor: '#FFFBEB', label: 'En attente', icon: '⏸️' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['en cours'];

    return (
      <span 
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium"
        style={{ 
          backgroundColor: config.bgColor,
          color: config.color
        }}
      >
        <span>{config.icon}</span>
        <span>{config.label}</span>
      </span>
    );
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="space-y-4 sm:space-y-6">
        {/* ============================================
            HEADER : Titre + Bouton Nouveau
            ============================================ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 
              className="text-2xl sm:text-3xl font-semibold mb-2"
              style={{ color: '#111827' }}
            >
              Tous les Chantiers
            </h1>
            <p className="text-sm" style={{ color: '#6B7280' }}>
              Gérez tous vos chantiers en cours et à venir
            </p>
          </div>

          {/* Bouton Nouveau Chantier */}
          <button
            onClick={handleOpenModal}
            className="flex items-center justify-center gap-2 px-5 py-2.5 text-white transition-all hover:opacity-90 w-full sm:w-auto"
            style={{ 
              backgroundColor: '#4F46E5',
              borderRadius: '8px'
            }}
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Nouveau Chantier</span>
          </button>
        </div>

        {/* ============================================
            BARRE D'OUTILS : Recherche
            ============================================ */}
        <div 
          className="p-4 sm:p-6 rounded-xl"
          style={{ 
            backgroundColor: '#FFFFFF',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
          }}
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className="w-5 h-5" style={{ color: '#6B7280' }} />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par nom de chantier, client ou localisation..."
              className="w-full pl-12 pr-4 py-2.5 sm:py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 text-sm sm:text-base"
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
            />
          </div>
          
          {/* Compteur de résultats */}
          {searchTerm && (
            <p className="text-sm mt-3" style={{ color: '#6B7280' }}>
              {filteredProjects.length} résultat{filteredProjects.length > 1 ? 's' : ''} trouvé{filteredProjects.length > 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* ============================================
            LISTE DES CHANTIERS
            ============================================ */}
        <div 
          className="p-4 sm:p-6 rounded-xl"
          style={{ 
            backgroundColor: '#FFFFFF',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
          }}
        >
          {/* Message si aucun résultat */}
          {filteredProjects.length === 0 ? (
            <EmptyState
              icon={FolderOpen}
              title="Aucun chantier trouvé"
              description={
                searchTerm 
                  ? 'Essayez avec d\'autres termes de recherche'
                  : 'Commencez par créer votre premier chantier'
              }
              actionLabel={!searchTerm ? 'Créer un chantier' : undefined}
              onAction={!searchTerm ? handleOpenModal : undefined}
            />
          ) : (
            <>
              {/* TABLEAU DESKTOP (masqué sur mobile) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
                      <th 
                        className="text-left py-4 px-4 text-xs font-medium uppercase tracking-wide"
                        style={{ color: '#6B7280' }}
                      >
                        Nom du Chantier
                      </th>
                      <th 
                        className="text-left py-4 px-4 text-xs font-medium uppercase tracking-wide"
                        style={{ color: '#6B7280' }}
                      >
                        Client
                      </th>
                      <th 
                        className="text-left py-4 px-4 text-xs font-medium uppercase tracking-wide"
                        style={{ color: '#6B7280' }}
                      >
                        Localisation
                      </th>
                      <th 
                        className="text-left py-4 px-4 text-xs font-medium uppercase tracking-wide"
                        style={{ color: '#6B7280' }}
                      >
                        Dates
                      </th>
                      <th 
                        className="text-right py-4 px-4 text-xs font-medium uppercase tracking-wide"
                        style={{ color: '#6B7280' }}
                      >
                        Budget
                      </th>
                      <th 
                        className="text-center py-4 px-4 text-xs font-medium uppercase tracking-wide"
                        style={{ color: '#6B7280' }}
                      >
                        Statut
                      </th>
                      <th 
                        className="text-center py-4 px-4 text-xs font-medium uppercase tracking-wide"
                        style={{ color: '#6B7280' }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map((project, index) => (
                      <tr 
                        key={project.id}
                        style={{ 
                          borderBottom: index < filteredProjects.length - 1 ? '1px solid #E5E7EB' : 'none'
                        }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {/* Nom du Projet (Lien cliquable) */}
                        <td className="py-4 px-4">
                          <Link
                            to={`/chantiers/${project.id}`}
                            className="text-sm font-semibold hover:underline transition-colors"
                            style={{ color: '#4F46E5' }}
                          >
                            {project.name}
                          </Link>
                        </td>

                        {/* Client */}
                        <td className="py-4 px-4">
                          <span className="text-sm" style={{ color: '#111827' }}>
                            {project.clientName}
                          </span>
                        </td>

                        {/* Localisation */}
                        <td className="py-4 px-4">
                          <span className="text-sm" style={{ color: '#6B7280' }}>
                            📍 {project.location}
                          </span>
                        </td>

                        {/* Dates */}
                        <td className="py-4 px-4">
                          <div className="text-sm" style={{ color: '#6B7280' }}>
                            <div>{formatDate(project.startDate)}</div>
                            <div className="text-xs">→ {formatDate(project.endDate)}</div>
                          </div>
                        </td>

                        {/* Budget */}
                        <td className="py-4 px-4 text-right">
                          <div>
                            <div className="text-sm font-semibold" style={{ color: '#111827' }}>
                              {formatAmount(project.budgetTotal)}
                            </div>
                            <div className="text-xs" style={{ color: '#6B7280' }}>
                              FCFA
                            </div>
                          </div>
                        </td>

                        {/* Statut */}
                        <td className="py-4 px-4 text-center">
                          {getStatusBadge(project.status)}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(project)}
                              className="text-sm text-blue-500 hover:text-blue-700"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(project)}
                              className="text-sm text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* CARTES MOBILE (visibles uniquement sur mobile) */}
              <div className="md:hidden space-y-4">
                {filteredProjects.map((project) => (
                  <Link
                    key={project.id}
                    to={`/chantiers/${project.id}`}
                    className="block p-4 rounded-lg border border-[#E5E7EB] hover:border-[#4F46E5] transition-all"
                    style={{ backgroundColor: '#FFFFFF' }}
                  >
                    {/* Header de la carte */}
                    <div className="flex items-start justify-between mb-3">
                      <h3 
                        className="text-base font-semibold flex-1"
                        style={{ color: '#4F46E5' }}
                      >
                        {project.name}
                      </h3>
                      {getStatusBadge(project.status)}
                    </div>

                    {/* Informations */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span style={{ color: '#6B7280' }}>Client:</span>
                        <span className="font-medium" style={{ color: '#111827' }}>
                          {project.clientName}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span style={{ color: '#6B7280' }}>📍</span>
                        <span style={{ color: '#6B7280' }}>
                          {project.location}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span style={{ color: '#6B7280' }}>Dates:</span>
                        <span style={{ color: '#6B7280' }}>
                          {formatDate(project.startDate)} → {formatDate(project.endDate)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#E5E7EB]">
                        <span style={{ color: '#6B7280' }}>Budget:</span>
                        <div className="text-right">
                          <div className="font-semibold" style={{ color: '#111827' }}>
                            {formatAmount(project.budgetTotal)}
                          </div>
                          <div className="text-xs" style={{ color: '#6B7280' }}>
                            FCFA
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Statistiques en bas */}
        {filteredProjects.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm" style={{ color: '#6B7280' }}>
            <div>
              Total : <span className="font-semibold" style={{ color: '#111827' }}>
                {filteredProjects.length} chantier{filteredProjects.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex flex-wrap gap-4 sm:gap-6">
              <div>
                <span style={{ color: '#4F46E5' }}>●</span> En cours : {filteredProjects.filter(p => p.status === 'en cours').length}
              </div>
              <div>
                <span style={{ color: '#F59E0B' }}>●</span> En attente : {filteredProjects.filter(p => p.status === 'en attente').length}
              </div>
              <div>
                <span style={{ color: '#10B981' }}>●</span> Terminés : {filteredProjects.filter(p => p.status === 'terminé').length}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============================================
          MODAL POUR CRÉER/MODIFIER UN CHANTIER
          ============================================ */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setItemToEdit(null);
        }}
        title={itemToEdit ? 'Modifier le chantier' : 'Nouveau Chantier'}
      >
        <ChantierForm 
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setItemToEdit(null);
          }}
          initialValues={itemToEdit || undefined}
          clients={clients} // ✨ Passer la liste des clients au formulaire
        />
      </Modal>

      {/* ============================================
          MODAL DE CONFIRMATION DE SUPPRESSION
          ============================================ */}
      <ConfirmModal
        isOpen={!!itemToDelete}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Supprimer le chantier ?"
        message={`Êtes-vous sûr de vouloir supprimer ${itemToDelete?.name} ? Cette action est irréversible.`}
        isDanger={true}
      />
    </div>
  );
}