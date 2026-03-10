import { Building2, LogOut, X, LayoutDashboard, Hammer, Users, FileText, DollarSign, Settings, UserCog, Truck } from 'lucide-react';
import { NavLink } from 'react-router';
import type { MenuItem, User } from '@/types';
import { filterByRole } from '@/lib/rbac';

// ============================================
// INTERFACES TYPESCRIPT
// ============================================

interface SidebarProps {
  menuItems: MenuItem[];
  user: User;
  onLogout: () => void;
  onNavigate?: () => void; // Callback pour fermer le menu mobile après navigation
}

// ============================================
// COMPOSANT PRESENTATIONNEL (DUMB COMPONENT)
// Utilise React Router pour la navigation
// RESPONSIVE : S'adapte en overlay sur mobile
// ============================================

const iconMap: Record<string, any> = {
  LayoutDashboard,
  Hammer,
  Users,
  FileText,
  DollarSign,
  Settings,
  UserCog,
  Truck
};

// Mapping des IDs de menu vers les routes
const routeMap: Record<string, string> = {
  dashboard: '/dashboard',
  projects: '/chantiers',
  personnel: '/personnel',
  suppliers: '/fournisseurs',
  clients: '/clients',
  invoices: '/factures',
  finance: '/finance',
  settings: '/parametres'
};

export function Sidebar({ menuItems, user, onLogout, onNavigate }: SidebarProps) {
  // ✨ FILTRAGE DES MENUS SELON LE RÔLE (RBAC)
  // - ADMIN : Accès total
  // - COMPTABLE : Accès total
  // - SECRETAIRE : Pas d'accès à Finance et Paramètres
  const filteredMenuItems = filterByRole(menuItems, user.role);

  return (
    <div className="w-full h-full bg-white border-r border-[#E5E7EB] flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#4F46E5] flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-lg font-semibold text-[#111827]">ELC BTP</div>
            <div className="text-xs text-[#6B7280]">Gestion</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {filteredMenuItems.map((item) => {
            const Icon = iconMap[item.icon];
            const route = routeMap[item.id] || '/dashboard';
            
            return (
              <li key={item.id}>
                <NavLink
                  to={route}
                  className={({ isActive }) => `
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative
                    ${isActive 
                      ? 'text-[#4F46E5]' 
                      : 'text-[#6B7280] hover:bg-[#F9FAFB]'
                    }
                  `}
                  onClick={onNavigate} // Appel du callback pour fermer le menu mobile
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#4F46E5] rounded-r" />
                      )}
                      {Icon && <Icon className="w-5 h-5" />}
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-[#E5E7EB]">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-[#4F46E5] flex items-center justify-center">
            <span className="text-white font-semibold">{user.initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <div className="text-sm font-medium text-[#111827] truncate">{user.name}</div>
              <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                user.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                user.role === 'DIRECTEUR' ? 'bg-purple-100 text-purple-700' :
                user.role === 'COMPTABLE' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {user.role}
              </span>
            </div>
            <div className="text-xs text-[#6B7280] truncate">{user.email}</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-[#6B7280] hover:bg-[#F9FAFB] rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
}