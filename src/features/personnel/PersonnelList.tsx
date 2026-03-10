import { useState, useMemo } from 'react';
import { Plus, Search, Phone, Users, Edit2, Trash2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { EmployeeForm } from './components/EmployeeForm';
import { toast } from '@/lib/toast';
import { MOCK_EMPLOYEES } from '@/data/mockData';
import type { Employee } from '@/types';

// ============================================
// COMPOSANT LISTE DU PERSONNEL (SMART)
// Gère l'affichage, la recherche et la création
// ============================================

export function PersonnelList() {
  // ============================================
  // ÉTAT LOCAL
  // ============================================
  
  // Liste des employés (initialisée avec MOCK_EMPLOYEES)
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  
  // Terme de recherche pour filtrer les employés
  const [searchTerm, setSearchTerm] = useState('');
  
  // État pour gérer l'ouverture/fermeture de la modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✨ NOUVEAUX ÉTATS POUR LE CRUD
  // État pour l'édition (stocke l'employé à modifier)
  const [itemToEdit, setItemToEdit] = useState<Employee | null>(null);

  // État pour la suppression (stocke l'employé à supprimer)
  const [itemToDelete, setItemToDelete] = useState<Employee | null>(null);

  // ============================================
  // CALCUL DÉRIVÉ : Employés filtrés
  // ============================================
  
  const filteredEmployees = useMemo(() => {
    if (!searchTerm.trim()) {
      return employees;
    }

    const term = searchTerm.toLowerCase();
    
    return employees.filter(employee => 
      employee.fullName.toLowerCase().includes(term) ||
      employee.role.toLowerCase().includes(term) ||
      employee.phone.toLowerCase().includes(term)
    );
  }, [employees, searchTerm]);

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
   * Crée un nouvel employé
   */
  const handleCreateEmployee = (employeeData: Omit<Employee, 'id'>) => {
    // Générer un ID fictif unique
    const newId = `EMP-${String(employees.length + 1).padStart(3, '0')}`;
    
    // Créer l'employé complet avec l'ID
    const newEmployee: Employee = {
      ...employeeData,
      id: newId
    };

    // Ajouter l'employé en DÉBUT de liste
    setEmployees(prev => [newEmployee, ...prev]);

    // Fermer la modal
    setIsModalOpen(false);

    // Afficher un message de succès
    toast.success('Employé ajouté avec succès');
  };

  /**
   * Ouvre la modal d'édition
   */
  const handleEdit = (employee: Employee) => {
    setItemToEdit(employee);
    setIsModalOpen(true);
  };

  /**
   * Met à jour un employé existant
   */
  const handleUpdateEmployee = (employeeData: Omit<Employee, 'id'>) => {
    if (!itemToEdit) return;

    const updatedEmployee: Employee = {
      ...employeeData,
      id: itemToEdit.id
    };

    setEmployees(prev => 
      prev.map(e => e.id === itemToEdit.id ? updatedEmployee : e)
    );

    setIsModalOpen(false);
    setItemToEdit(null);
    toast.success('Employé modifié avec succès');
  };

  /**
   * Handler unifié pour création OU édition
   */
  const handleSubmit = (employeeData: Omit<Employee, 'id'>) => {
    if (itemToEdit) {
      handleUpdateEmployee(employeeData);
    } else {
      handleCreateEmployee(employeeData);
    }
  };

  /**
   * Ouvre la modal de confirmation de suppression
   */
  const handleDeleteClick = (employee: Employee) => {
    setItemToDelete(employee);
  };

  /**
   * Supprime définitivement l'employé
   */
  const handleConfirmDelete = () => {
    if (!itemToDelete) return;

    setEmployees(prev => 
      prev.filter(e => e.id !== itemToDelete.id)
    );

    setItemToDelete(null);
    toast.success('Employé supprimé avec succès');
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

  // ============================================
  // BADGE DE STATUT
  // ============================================
  
  const getStatusBadge = (status: 'ACTIF' | 'INACTIF') => {
    const statusConfig = {
      'ACTIF': { color: '#10B981', bgColor: '#ECFDF5', label: 'Actif', icon: '✅' },
      'INACTIF': { color: '#EF4444', bgColor: '#FEF2F2', label: 'Inactif', icon: '⏸️' }
    };

    const config = statusConfig[status];

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
  // BADGE DE RÔLE
  // ============================================
  
  const getRoleBadge = (role: string) => {
    return (
      <span 
        className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium"
        style={{ 
          backgroundColor: '#F3F4F6',
          color: '#6B7280'
        }}
      >
        {role}
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
            HEADER : Titre + Bouton Ajouter
            ============================================ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 
              className="text-2xl sm:text-3xl font-semibold mb-2"
              style={{ color: '#111827' }}
            >
              Personnel & Ouvriers
            </h1>
            <p className="text-sm" style={{ color: '#6B7280' }}>
              Gérez votre équipe et les taux journaliers
            </p>
          </div>

          {/* Bouton Ajouter un employé */}
          <button
            onClick={handleOpenModal}
            className="flex items-center justify-center gap-2 px-5 py-2.5 text-white transition-all hover:opacity-90 w-full sm:w-auto"
            style={{ 
              backgroundColor: '#4F46E5',
              borderRadius: '8px'
            }}
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Ajouter un employé</span>
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
              placeholder="Rechercher par nom, poste ou téléphone..."
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
              {filteredEmployees.length} résultat{filteredEmployees.length > 1 ? 's' : ''} trouvé{filteredEmployees.length > 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* ============================================
            LISTE DU PERSONNEL
            ============================================ */}
        <div 
          className="p-4 sm:p-6 rounded-xl"
          style={{ 
            backgroundColor: '#FFFFFF',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
          }}
        >
          {/* Message si aucun résultat */}
          {filteredEmployees.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Aucun employé trouvé"
              description={
                searchTerm 
                  ? 'Essayez avec d\'autres termes de recherche'
                  : 'Commencez par ajouter votre premier employé'
              }
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
                        Nom
                      </th>
                      <th 
                        className="text-left py-4 px-4 text-xs font-medium uppercase tracking-wide"
                        style={{ color: '#6B7280' }}
                      >
                        Poste
                      </th>
                      <th 
                        className="text-left py-4 px-4 text-xs font-medium uppercase tracking-wide"
                        style={{ color: '#6B7280' }}
                      >
                        Téléphone
                      </th>
                      <th 
                        className="text-right py-4 px-4 text-xs font-medium uppercase tracking-wide"
                        style={{ color: '#6B7280' }}
                      >
                        Taux Journalier
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
                    {filteredEmployees.map((employee, index) => (
                      <tr 
                        key={employee.id}
                        style={{ 
                          borderBottom: index < filteredEmployees.length - 1 ? '1px solid #E5E7EB' : 'none'
                        }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {/* Nom */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                              style={{ backgroundColor: '#4F46E5' }}
                            >
                              {employee.fullName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </div>
                            <div>
                              <div className="text-sm font-semibold" style={{ color: '#111827' }}>
                                {employee.fullName}
                              </div>
                              <div className="text-xs" style={{ color: '#6B7280' }}>
                                ID: {employee.id}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Poste */}
                        <td className="py-4 px-4">
                          {getRoleBadge(employee.role)}
                        </td>

                        {/* Téléphone */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-sm" style={{ color: '#6B7280' }}>
                            <Phone className="w-4 h-4" />
                            <span>{employee.phone}</span>
                          </div>
                        </td>

                        {/* Taux Journalier */}
                        <td className="py-4 px-4 text-right">
                          <div>
                            <div className="text-base font-bold" style={{ color: '#4F46E5' }}>
                              {formatAmount(employee.dailyRate)}
                            </div>
                            <div className="text-xs" style={{ color: '#6B7280' }}>
                              FCFA/jour
                            </div>
                          </div>
                        </td>

                        {/* Statut */}
                        <td className="py-4 px-4 text-center">
                          {getStatusBadge(employee.status)}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors hover:bg-[#EEF2FF]"
                              style={{ color: '#4F46E5' }}
                              onClick={() => handleEdit(employee)}
                            >
                              Modifier
                            </button>
                            <button
                              className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors hover:bg-red-50"
                              style={{ color: '#EF4444' }}
                              onClick={() => handleDeleteClick(employee)}
                            >
                              Supprimer
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
                {filteredEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    className="p-4 rounded-lg border border-[#E5E7EB]"
                    style={{ backgroundColor: '#FFFFFF' }}
                  >
                    {/* Header de la carte */}
                    <div className="flex items-start gap-3 mb-3">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
                        style={{ backgroundColor: '#4F46E5' }}
                      >
                        {employee.fullName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 
                          className="text-base font-semibold"
                          style={{ color: '#111827' }}
                        >
                          {employee.fullName}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          {getRoleBadge(employee.role)}
                          {getStatusBadge(employee.status)}
                        </div>
                      </div>
                    </div>

                    {/* Informations */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2" style={{ color: '#6B7280' }}>
                        <Phone className="w-4 h-4" />
                        <span>{employee.phone}</span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#E5E7EB]">
                        <span style={{ color: '#6B7280' }}>Taux journalier:</span>
                        <div className="text-right">
                          <div className="font-bold" style={{ color: '#4F46E5' }}>
                            {formatAmount(employee.dailyRate)}
                          </div>
                          <div className="text-xs" style={{ color: '#6B7280' }}>
                            FCFA/jour
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4 pt-3 border-t border-[#E5E7EB]">
                      <button
                        className="flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        style={{ 
                          backgroundColor: '#EEF2FF',
                          color: '#4F46E5'
                        }}
                        onClick={() => handleEdit(employee)}
                      >
                        Modifier
                      </button>
                      <button
                        className="flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        style={{ 
                          backgroundColor: '#FEF2F2',
                          color: '#EF4444'
                        }}
                        onClick={() => handleDeleteClick(employee)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Statistiques en bas */}
        {filteredEmployees.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm" style={{ color: '#6B7280' }}>
            <div>
              Total : <span className="font-semibold" style={{ color: '#111827' }}>
                {filteredEmployees.length} employé{filteredEmployees.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex flex-wrap gap-4 sm:gap-6">
              <div>
                <span style={{ color: '#10B981' }}>●</span> Actifs : {filteredEmployees.filter(e => e.status === 'ACTIF').length}
              </div>
              <div>
                <span style={{ color: '#EF4444' }}>●</span> Inactifs : {filteredEmployees.filter(e => e.status === 'INACTIF').length}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============================================
          MODAL POUR AJOUTER/MODIFIER UN EMPLOYÉ
          ============================================ */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setItemToEdit(null);
        }}
        title={itemToEdit ? 'Modifier l\'employé' : 'Nouvel Employé'}
      >
        <EmployeeForm 
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setItemToEdit(null);
          }}
          initialValues={itemToEdit || undefined}
        />
      </Modal>

      {/* ============================================
          MODAL DE CONFIRMATION DE SUPPRESSION
          ============================================ */}
      <ConfirmModal
        isOpen={!!itemToDelete}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Supprimer l'employé ?"
        message={`Êtes-vous sûr de vouloir supprimer ${itemToDelete?.fullName} ? Cette action est irréversible.`}
        isDanger={true}
      />
    </div>
  );
}