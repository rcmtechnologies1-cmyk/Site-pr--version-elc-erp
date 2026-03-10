import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '@/context/AuthContext';

// ============================================
// INTERFACES TYPESCRIPT
// ============================================

interface ProtectedRouteProps {
  children: ReactNode;
}

// ============================================
// COMPOSANT: PROTECTED ROUTE (WRAPPER)
// Protège les routes privées contre l'accès non autorisé
// Redirige vers /login si l'utilisateur n'est pas authentifié
// ============================================

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // ============================================
  // ÉTAT: CHARGEMENT
  // Afficher un loader pendant la vérification de session
  // ============================================
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          {/* Spinner de chargement */}
          <div className="w-12 h-12 border-4 border-[#E5E7EB] border-t-[#4F46E5] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#6B7280] text-sm">Vérification de la session...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // VÉRIFICATION: AUTHENTIFICATION
  // Si non authentifié → Redirection vers /login
  // ============================================
  if (!isAuthenticated) {
    console.log('🔒 Accès refusé: Redirection vers /login');
    
    // Sauvegarder l'URL demandée pour rediriger après connexion
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // ============================================
  // ACCÈS AUTORISÉ
  // Afficher le contenu protégé
  // ============================================
  return <>{children}</>;
}

// ============================================
// NOTES D'IMPLÉMENTATION
// ============================================

/**
 * UTILISATION:
 * 
 * <Route 
 *   path="/dashboard" 
 *   element={
 *     <ProtectedRoute>
 *       <Dashboard />
 *     </ProtectedRoute>
 *   } 
 * />
 * 
 * OU avec un layout partagé:
 * 
 * <Route 
 *   element={
 *     <ProtectedRoute>
 *       <MainLayout />
 *     </ProtectedRoute>
 *   }
 * >
 *   <Route path="/dashboard" element={<Dashboard />} />
 *   <Route path="/chantiers" element={<ChantiersList />} />
 * </Route>
 */

/**
 * FONCTIONNALITÉS:
 * 
 * 1. Vérification automatique de l'authentification
 * 2. Affichage d'un loader pendant la vérification
 * 3. Redirection vers /login si non authentifié
 * 4. Sauvegarde de l'URL demandée (state.from) pour redirection après login
 * 5. Affichage du contenu si authentifié
 */

/**
 * AMÉLIORATIONS POSSIBLES (Production):
 * 
 * - Vérifier le rôle de l'utilisateur (admin, user, guest)
 * - Vérifier les permissions spécifiques (CRUD)
 * - Gérer l'expiration du token JWT
 * - Rafraîchir automatiquement le token
 * - Gérer les erreurs réseau
 */