import { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '@/context/AuthContext';
import { canAccessModule, type ModuleId } from '@/lib/rbac';

// ============================================
// COMPOSANT DE PROTECTION DE ROUTE (RBAC)
// ============================================
// Redirige vers /dashboard si l'utilisateur n'a pas accès au module
// Usage dans les routes : <RouteGuard module="finance">...</RouteGuard>
// ============================================

interface RouteGuardProps {
  module: ModuleId;
  children: ReactNode;
}

export function RouteGuard({ module, children }: RouteGuardProps) {
  const { user } = useAuth();

  // Vérifier si l'utilisateur a accès au module
  const hasAccess = canAccessModule(user.role as any, module);

  // Si pas d'accès, rediriger vers le dashboard
  if (!hasAccess) {
    console.warn(`🚫 Accès refusé au module "${module}" pour le rôle "${user.role}"`);
    return <Navigate to="/dashboard" replace />;
  }

  // Sinon, afficher la page
  return <>{children}</>;
}
