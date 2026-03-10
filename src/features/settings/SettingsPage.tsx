import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Building2, Users } from 'lucide-react';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Modal } from '@/components/ui/Modal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { UserForm } from './components/UserForm';
import { toast } from '@/lib/toast';
import { MOCK_USERS } from '@/data/mockData';
import type { User } from '@/types';

// ============================================
// CONSTANTES
// ============================================

const USERS_STORAGE_KEY = 'elc_btp_users';

// ============================================
// SOUS-COMPOSANT: BADGE RÔLE
// ============================================

function RoleBadge({ role }: { role: User['role'] }) {
  const styles = {
    ADMIN: 'bg-purple-100 text-purple-800 border-purple-200',
    DIRECTEUR: 'bg-blue-100 text-blue-800 border-blue-200',
    COMPTABLE: 'bg-green-100 text-green-800 border-green-200',
    SECRETAIRE: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const labels = {
    ADMIN: 'Administrateur',
    DIRECTEUR: 'Directeur',
    COMPTABLE: 'Comptable',
    SECRETAIRE: 'Secrétaire'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[role]}`}>
      {labels[role]}
    </span>
  );
}

// ============================================
// SOUS-COMPOSANT: BADGE STATUT
// ============================================

function StatusBadge({ status }: { status: User['status'] }) {
  if (status === 'ACTIF') {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
        Actif
      </span>
    );
  }

  return (
    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
      Inactif
    </span>
  );
}

// ============================================
// COMPOSANT SETTINGSPAGE (SMART)
// ============================================

export function SettingsPage() {
  // ============================================
  // ÉTAT LOCAL
  // ============================================

  const [activeTab, setActiveTab] = useState<'users' | 'company'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  // ============================================
  // EFFET: Chargement initial des utilisateurs
  // ============================================

  useEffect(() => {
    const loadUsers = () => {
      try {
        const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
        if (storedUsers) {
          setUsers(JSON.parse(storedUsers));
        } else {
          // Première initialisation : utiliser MOCK_USERS
          setUsers(MOCK_USERS);
          localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(MOCK_USERS));
        }
      } catch (error) {
        console.error('❌ Erreur chargement utilisateurs:', error);
        setUsers(MOCK_USERS);
      }
    };

    loadUsers();
  }, []);

  // ============================================
  // FONCTION: Sauvegarder dans localStorage
  // ============================================

  const saveUsers = (updatedUsers: User[]) => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
    } catch (error) {
      console.error('❌ Erreur sauvegarde utilisateurs:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  // ============================================
  // HANDLERS - UTILISATEURS
  // ============================================

  const handleCreateUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: `USR-${Date.now()}`
    };

    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);

    toast.success(`Utilisateur "${userData.name}" créé avec succès !`);
    setIsModalOpen(false);
  };

  const handleEditUser = (userData: Omit<User, 'id'>) => {
    if (!editingUser) return;

    const updatedUsers = users.map(u =>
      u.id === editingUser.id
        ? { 
            ...u, 
            ...userData,
            // Si le mot de passe est vide, garder l'ancien
            password: userData.password || u.password
          }
        : u
    );

    saveUsers(updatedUsers);

    toast.success(`Utilisateur "${userData.name}" modifié avec succès !`);
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = () => {
    if (!deletingUser) return;

    const updatedUsers = users.filter(u => u.id !== deletingUser.id);
    saveUsers(updatedUsers);

    toast.success(`Utilisateur "${deletingUser.name}" supprimé avec succès !`);
    setIsDeleteModalOpen(false);
    setDeletingUser(null);
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const openDeleteModal = (user: User) => {
    setDeletingUser(user);
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  // ============================================
  // HANDLER - PROFIL ENTREPRISE (DEMO)
  // ============================================

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profil entreprise sauvegardé !');
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <RoleGuard allowedRoles={['ADMIN', 'DIRECTEUR']}>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[#111827] text-2xl sm:text-3xl mb-2">Paramètres</h1>
          <p className="text-[#6B7280] text-sm">
            Gérez les utilisateurs et les paramètres de l'entreprise
          </p>
        </div>

        {/* Navigation Onglets */}
        <div className="mb-6 border-b border-[#E5E7EB]">
          <nav className="flex gap-6">
            <button
              onClick={() => setActiveTab('users')}
              className={`
                flex items-center gap-2 px-1 py-3 text-sm font-medium border-b-2 transition-colors
                ${activeTab === 'users'
                  ? 'border-[#4F46E5] text-[#4F46E5]'
                  : 'border-transparent text-[#6B7280] hover:text-[#111827] hover:border-[#D1D5DB]'
                }
              `}
            >
              <Users className="w-4 h-4" />
              Utilisateurs
            </button>
            <button
              onClick={() => setActiveTab('company')}
              className={`
                flex items-center gap-2 px-1 py-3 text-sm font-medium border-b-2 transition-colors
                ${activeTab === 'company'
                  ? 'border-[#4F46E5] text-[#4F46E5]'
                  : 'border-transparent text-[#6B7280] hover:text-[#111827] hover:border-[#D1D5DB]'
                }
              `}
            >
              <Building2 className="w-4 h-4" />
              Profil Entreprise
            </button>
          </nav>
        </div>

        {/* Contenu - Onglet Utilisateurs */}
        {activeTab === 'users' && (
          <div>
            {/* Action Bar */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-[#6B7280]">
                {users.length} utilisateur{users.length > 1 ? 's' : ''} enregistré{users.length > 1 ? 's' : ''}
              </p>
              <button
                onClick={openCreateModal}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Nouvel Utilisateur
              </button>
            </div>

            {/* Tableau des utilisateurs */}
            <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.03),0_1px_2px_rgba(0,0,0,0.06)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                        Nom
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                        Rôle
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-[#6B7280]">
                          Aucun utilisateur enregistré
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id} className="hover:bg-[#F9FAFB] transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[#4F46E5] text-white flex items-center justify-center text-sm font-medium">
                                {user.initials}
                              </div>
                              <div className="text-sm font-medium text-[#111827]">
                                {user.name}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-[#6B7280]">
                            {user.email}
                          </td>
                          <td className="px-6 py-4">
                            <RoleBadge role={user.role} />
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={user.status} />
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => openEditModal(user)}
                                className="p-2 text-[#6B7280] hover:text-[#4F46E5] hover:bg-[#EEF2FF] rounded-lg transition-colors"
                                title="Modifier"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openDeleteModal(user)}
                                className="p-2 text-[#6B7280] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Supprimer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Contenu - Onglet Profil Entreprise */}
        {activeTab === 'company' && (
          <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.03),0_1px_2px_rgba(0,0,0,0.06)] p-6">
            <h2 className="text-lg font-medium text-[#111827] mb-6">
              Informations de l'entreprise
            </h2>

            <form onSubmit={handleSaveCompany} className="space-y-6 max-w-2xl">
              {/* Nom entreprise */}
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Nom de l'entreprise
                </label>
                <input
                  type="text"
                  disabled
                  value="ELC BTP"
                  className="w-full px-4 py-2.5 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] text-[#6B7280] cursor-not-allowed"
                />
              </div>

              {/* Adresse */}
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Adresse
                </label>
                <input
                  type="text"
                  disabled
                  value="Lomé, Togo"
                  className="w-full px-4 py-2.5 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] text-[#6B7280] cursor-not-allowed"
                />
              </div>

              {/* Téléphone */}
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Téléphone
                </label>
                <input
                  type="text"
                  disabled
                  value="+228 22 00 00 00"
                  className="w-full px-4 py-2.5 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] text-[#6B7280] cursor-not-allowed"
                />
              </div>

              {/* NIF */}
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  NIF (Numéro d'Identification Fiscale)
                </label>
                <input
                  type="text"
                  disabled
                  value="TG-0000000000"
                  className="w-full px-4 py-2.5 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] text-[#6B7280] cursor-not-allowed"
                />
              </div>

              {/* RCCM */}
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  RCCM (Registre de Commerce)
                </label>
                <input
                  type="text"
                  disabled
                  value="TG-LOM-01-2020-B12-00000"
                  className="w-full px-4 py-2.5 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] text-[#6B7280] cursor-not-allowed"
                />
              </div>

              {/* Note explicative */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note :</strong> Cette section est désactivée pour la démonstration. 
                  Dans la version finale, ces champs seront éditables par l'administrateur.
                </p>
              </div>

              {/* Bouton Sauvegarder (DEMO) */}
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition-colors"
              >
                Sauvegarder
              </button>
            </form>
          </div>
        )}

        {/* Modal Création/Édition Utilisateur */}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={editingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
        >
          <UserForm
            initialValues={editingUser}
            onSubmit={editingUser ? handleEditUser : handleCreateUser}
            onCancel={closeModal}
          />
        </Modal>

        {/* Modal Confirmation Suppression */}
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteUser}
          title="Supprimer l'utilisateur"
          message={`Êtes-vous sûr de vouloir supprimer l'utilisateur "${deletingUser?.name}" ? Cette action est irréversible.`}
          confirmLabel="Supprimer"
          cancelLabel="Annuler"
          variant="danger"
        />
      </div>
    </RoleGuard>
  );
}
