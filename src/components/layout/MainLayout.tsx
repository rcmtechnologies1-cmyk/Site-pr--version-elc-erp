import { useState, useEffect } from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/context/AuthContext';
import { MOCK_MENU_ITEMS } from '@/data/mockData';
import { Menu, X } from 'lucide-react';

// ============================================
// COMPOSANT LAYOUT PARTAGÉ (RESPONSIVE)
// Englobe toutes les pages authentifiées
// - Desktop : Sidebar fixe à gauche
// - Mobile/Tablette : Sidebar en overlay avec bouton hamburger
// ============================================

export function MainLayout() {
  // Récupérer l'utilisateur et la fonction logout depuis le contexte
  const { user, logout } = useAuth();

  // État pour gérer l'ouverture/fermeture de la sidebar sur mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // ============================================
  // EFFET: Bloquer le scroll du body quand le menu mobile est ouvert
  // ============================================
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup au démontage
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* ============================================
          SIDEBAR MOBILE OVERLAY (en dehors du flex container)
          Visible uniquement sur mobile/tablette (< lg)
          ============================================ */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay sombre (backdrop) - couvre ABSOLUMENT TOUT L'ÉCRAN */}
          <div 
            className="fixed top-0 left-0 right-0 bottom-0 z-[100] lg:hidden"
            onClick={closeMobileMenu}
            style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              width: '100vw',
              height: '100vh',
              touchAction: 'none'
            }}
          />
          
          {/* Sidebar mobile en slide-in - avec fond blanc forcé */}
          <div 
            className="fixed top-0 left-0 bottom-0 w-64 z-[110] lg:hidden"
            style={{ 
              backgroundColor: '#FFFFFF',
              height: '100vh',
              overflowY: 'auto'
            }}
          >
            <Sidebar 
              menuItems={MOCK_MENU_ITEMS}
              user={user}
              onLogout={logout}
              onNavigate={closeMobileMenu}
            />
          </div>
        </>
      )}

      {/* ============================================
          CONTAINER PRINCIPAL
          ============================================ */}
      <div className="flex min-h-screen bg-[#F9FAFB]">
        {/* ============================================
            SIDEBAR DESKTOP (visible uniquement sur lg+)
            ============================================ */}
        <div className="hidden lg:block lg:w-64 lg:fixed lg:left-0 lg:top-0 lg:h-screen">
          <Sidebar 
            menuItems={MOCK_MENU_ITEMS}
            user={user}
            onLogout={logout} 
          />
        </div>

        {/* ============================================
            CONTENU PRINCIPAL
            ============================================ */}
        <div className="flex-1 w-full lg:ml-64">
          {/* Header Mobile (visible uniquement sur < lg) */}
          <div className="lg:hidden sticky top-0 z-10 bg-white border-b border-[#E5E7EB] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#4F46E5] flex items-center justify-center">
                <span className="text-white text-sm font-semibold">E</span>
              </div>
              <div>
                <div className="text-sm font-semibold" style={{ color: '#111827' }}>ELC BTP</div>
                <div className="text-xs" style={{ color: '#6B7280' }}>Gestion</div>
              </div>
            </div>
            
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg hover:bg-[#F9FAFB] transition-colors"
              style={{ color: '#111827' }}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Contenu dynamique (via React Router) */}
          <Outlet />
        </div>
      </div>
    </>
  );
}