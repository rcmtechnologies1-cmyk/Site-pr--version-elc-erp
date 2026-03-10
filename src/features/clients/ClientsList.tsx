import { useState } from 'react';
import { Search, Plus, Phone, Mail, MapPin, Building2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { ClientForm } from './components/ClientForm';
import { Client } from '@/types';

// ============================================
// COMPOSANT SMART : LISTE DES CLIENTS
// Affiche tous les clients avec recherche et CRUD
// ============================================

interface ClientsListProps {
  clients: Client[];
  onAddClient: (client: Client) => void;
}

export function ClientsList({ clients, onAddClient }: ClientsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // ============================================
  // FILTRAGE DES CLIENTS
  // ============================================

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.includes(searchQuery) ||
    client.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ============================================
  // HANDLERS
  // ============================================

  const handleFormSubmit = (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = {
      id: `CLI-${Date.now()}`,
      ...clientData,
      createdAt: new Date().toISOString().split('T')[0]
    };

    onAddClient(newClient);
    setIsAddModalOpen(false);
  };

  // ============================================
  // STATISTIQUES RAPIDES
  // ============================================

  const stats = {
    total: clients.length,
    publics: clients.filter(c => c.type === 'PUBLIC').length,
    prives: clients.filter(c => c.type === 'PRIVE').length
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="p-6">
      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#111827] mb-2">Base de Données Clients</h1>
        <p className="text-[#6B7280]">
          Gérez vos clients publics et privés
        </p>
      </div>

      {/* KPI Rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Total Clients</p>
              <p className="text-2xl font-semibold text-[#111827]">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-[#4F46E5]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Clients Publics</p>
              <p className="text-2xl font-semibold text-[#111827]">{stats.publics}</p>
            </div>
            <div className="w-12 h-12 bg-[#FEF3C7] rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-[#F59E0B]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Clients Privés</p>
              <p className="text-2xl font-semibold text-[#111827]">{stats.prives}</p>
            </div>
            <div className="w-12 h-12 bg-[#DBEAFE] rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-[#3B82F6]" />
            </div>
          </div>
        </div>
      </div>

      {/* Barre d'actions */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        {/* Barre de recherche */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher un client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
          />
        </div>

        {/* Bouton Ajouter */}
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#4F46E5] hover:bg-[#4338CA] text-white flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nouveau Client
        </Button>
      </div>

      {/* Tableau des clients */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredClients.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-[#D1D5DB] mx-auto mb-3" />
            <p className="text-[#6B7280]">
              {searchQuery ? 'Aucun client trouvé' : 'Aucun client enregistré'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F9FAFB] border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Adresse
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Date Création
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          client.type === 'PUBLIC' ? 'bg-[#FEF3C7]' : 'bg-[#DBEAFE]'
                        }`}>
                          {client.type === 'PUBLIC' ? (
                            <Building2 className="w-5 h-5 text-[#F59E0B]" />
                          ) : (
                            <User className="w-5 h-5 text-[#3B82F6]" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-[#111827]">{client.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        client.type === 'PUBLIC' 
                          ? 'bg-[#FEF3C7] text-[#92400E]' 
                          : 'bg-[#DBEAFE] text-[#1E40AF]'
                      }`}>
                        {client.type === 'PUBLIC' ? '🏛️ Public' : '👤 Privé'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                          <Phone className="w-4 h-4" />
                          {client.phone}
                        </div>
                        {client.email && (
                          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                            <Mail className="w-4 h-4" />
                            {client.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="line-clamp-2">{client.address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#6B7280]">
                      {new Date(client.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal : Ajouter Client */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Nouveau Client"
      >
        <ClientForm
          onSubmit={handleFormSubmit}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
