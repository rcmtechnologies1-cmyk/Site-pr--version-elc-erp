// ============================================
// RBAC - ROLE-BASED ACCESS CONTROL
// ============================================
// Définit les permissions d'accès par rôle
// ============================================

/**
 * Types de rôles disponibles dans l'application
 */
export type UserRole = 'ADMIN' | 'DIRECTEUR' | 'COMPTABLE' | 'SECRETAIRE';

/**
 * Types de modules/pages disponibles dans l'application
 */
export type ModuleId = 
  | 'dashboard' 
  | 'projects'      // Chantiers
  | 'personnel' 
  | 'suppliers'     // Fournisseurs
  | 'clients' 
  | 'invoices'      // Factures
  | 'finance' 
  | 'settings';     // Paramètres

/**
 * Matrice des permissions : Rôle → Modules autorisés
 * 
 * 🎯 RÈGLES D'ACCÈS :
 * 
 * - ADMIN : Accès TOTAL (tous les modules)
 * - DIRECTEUR : Accès TOTAL (tous les modules)
 * - COMPTABLE : Finance, Factures, Fournisseurs, Dashboard
 * - SECRETAIRE : Dashboard, Chantiers, Clients, Personnel (limité)
 */
export const ROLE_PERMISSIONS: Record<UserRole, ModuleId[]> = {
  ADMIN: [
    'dashboard',
    'projects',
    'personnel',
    'suppliers',
    'clients',
    'invoices',
    'finance',
    'settings'
  ],
  
  DIRECTEUR: [
    'dashboard',
    'projects',
    'personnel',
    'suppliers',
    'clients',
    'invoices',
    'finance',
    'settings'
  ],
  
  COMPTABLE: [
    'dashboard',
    'suppliers',
    'invoices',
    'finance'
  ],
  
  SECRETAIRE: [
    'dashboard',
    'projects',
    'clients',
    'personnel'
  ]
};

/**
 * Vérifie si un rôle a accès à un module spécifique
 * 
 * @param role - Rôle de l'utilisateur
 * @param moduleId - ID du module à vérifier
 * @returns true si le rôle a accès, false sinon
 * 
 * @example
 * ```ts
 * canAccessModule('COMPTABLE', 'finance') // true
 * canAccessModule('COMPTABLE', 'personnel') // false
 * ```
 */
export function canAccessModule(role: UserRole, moduleId: ModuleId): boolean {
  const allowedModules = ROLE_PERMISSIONS[role];
  return allowedModules.includes(moduleId);
}

/**
 * Retourne la liste des modules autorisés pour un rôle
 * 
 * @param role - Rôle de l'utilisateur
 * @returns Array des IDs de modules autorisés
 * 
 * @example
 * ```ts
 * getAuthorizedModules('COMPTABLE') 
 * // ['dashboard', 'fournisseurs', 'factures', 'finance']
 * ```
 */
export function getAuthorizedModules(role: UserRole): ModuleId[] {
  return ROLE_PERMISSIONS[role];
}

/**
 * Filtre une liste d'items selon les permissions du rôle
 * 
 * @param items - Liste d'items avec un ID
 * @param role - Rôle de l'utilisateur
 * @returns Liste filtrée des items autorisés
 * 
 * @example
 * ```ts
 * const allMenus = [
 *   { id: 'dashboard', label: 'Dashboard' },
 *   { id: 'personnel', label: 'Personnel' }
 * ];
 * const filtered = filterByRole(allMenus, 'COMPTABLE');
 * // Retourne uniquement [{ id: 'dashboard', label: 'Dashboard' }]
 * ```
 */
export function filterByRole<T extends { id: string }>(
  items: T[],
  role: UserRole
): T[] {
  const allowedModules = getAuthorizedModules(role);
  return items.filter(item => allowedModules.includes(item.id as ModuleId));
}

/**
 * Vérifie si un utilisateur est administrateur
 * 
 * @param role - Rôle de l'utilisateur
 * @returns true si l'utilisateur est ADMIN, false sinon
 */
export function isAdmin(role: UserRole): boolean {
  return role === 'ADMIN';
}

/**
 * Vérifie si un utilisateur est Directeur
 * 
 * @param role - Rôle de l'utilisateur
 * @returns true si l'utilisateur est DIRECTEUR, false sinon
 */
export function isDirecteur(role: UserRole): boolean {
  return role === 'DIRECTEUR';
}

/**
 * Vérifie si un utilisateur a des privilèges élevés (ADMIN ou DIRECTEUR)
 * 
 * @param role - Rôle de l'utilisateur
 * @returns true si l'utilisateur a des privilèges élevés
 */
export function hasHighPrivileges(role: UserRole): boolean {
  return role === 'ADMIN' || role === 'DIRECTEUR';
}