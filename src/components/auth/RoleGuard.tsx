import { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/lib/rbac';

// ============================================
// COMPOSANT DE RESTRICTION PAR RÔLE (RBAC)
// ============================================
// Masque le contenu si l'utilisateur n'a pas le rôle autorisé
// Usage : <RoleGuard allowedRoles={['ADMIN', 'COMPTABLE']}>...</RoleGuard>
// ============================================

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode; // Contenu alternatif (optionnel)
}

export function RoleGuard({ allowedRoles, children, fallback = null }: RoleGuardProps) {
  const { user } = useAuth();

  // Si l'utilisateur n'a pas le rôle requis, afficher le fallback (ou rien)
  if (!allowedRoles.includes(user.role as UserRole)) {
    return <>{fallback}</>;
  }

  // Sinon, afficher le contenu protégé
  return <>{children}</>;
}