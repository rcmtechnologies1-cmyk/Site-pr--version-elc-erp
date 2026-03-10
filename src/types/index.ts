// ============================================
// TYPES GLOBAUX DE L'APPLICATION
// ============================================

/**
 * Utilisateur du système
 */
export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // ✨ Mot de passe (simulation locale uniquement)
  initials: string;
  role: 'ADMIN' | 'DIRECTEUR' | 'COMPTABLE' | 'SECRETAIRE'; // ✨ RBAC avec DIRECTEUR
  status: 'ACTIF' | 'INACTIF'; // ✨ Statut de l'utilisateur
}

/**
 * Client (Public ou Privé)
 * Base de données clients pour lier aux chantiers
 */
export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  type: 'PUBLIC' | 'PRIVE';
  createdAt: string;
}

/**
 * Indicateur de performance (KPI)
 */
export interface KPI {
  id: string;
  title: string;
  value: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

/**
 * Données de flux de trésorerie mensuel
 */
export interface CashFlowData {
  month: string;
  recettes: number;
  depenses: number;
}

/**
 * Projet/Chantier avec toutes les informations
 * Interface unifiée pour tout le système
 */
export interface Project {
  id: string;
  name: string;
  status: 'en cours' | 'terminé' | 'en attente';
  clientName: string;
  location: string;
  budgetTotal: number;
  startDate: string;
  endDate: string;
}

/**
 * Transaction financière d'un projet
 */
export interface Transaction {
  id: string;
  projectId: string; // Référence au projet (OBLIGATOIRE)
  date: string;
  description: string;
  amount: number;
  type: 'RECETTE' | 'DEPENSE';
  paymentMethod: string;
}

/**
 * Détails étendus d'un projet/chantier
 * Utilisé pour la vue détaillée d'un chantier
 */
export interface ProjectDetails extends Project {
  budgetTotal: number;
  clientName: string;
  location: string;
}

/**
 * Élément de menu de navigation
 */
export interface MenuItem {
  id: string;
  label: string;
  icon: string;
}

/**
 * Employé / Ouvrier
 * Gestion du personnel et de la main-d'œuvre
 */
export interface Employee {
  id: string;
  fullName: string;
  role: string;
  phone: string;
  dailyRate: number; // Taux journalier en FCFA
  status: 'ACTIF' | 'INACTIF';
}

/**
 * Fournisseur
 * Entreprises et prestataires externes (quincailleries, loueurs d'engins, etc.)
 */
export interface Supplier {
  id: string;
  name: string;
  category: 'MATERIAUX' | 'ENGINS' | 'SERVICES' | 'AUTRES';
  phone: string;
  email: string;
  address?: string;
  totalDebt: number; // Dette totale actuelle en FCFA (calculée)
}

/**
 * Facture Fournisseur
 * Représente un achat à crédit auprès d'un fournisseur
 */
export interface SupplierInvoice {
  id: string;
  supplierId: string; // Référence au fournisseur
  invoiceNumber: string; // N° de facture (ex: "FACT-2026-001")
  date: string; // Date d'émission
  description: string; // Description de l'achat
  totalAmount: number; // Montant total en FCFA
  paidAmount: number; // Montant déjà payé en FCFA
  status: 'NON_PAYEE' | 'PARTIELLE' | 'PAYEE';
  dueDate: string; // Date d'échéance
  projectId?: string; // Optionnel : lien vers un chantier
}

/**
 * Paiement sur Facture Fournisseur
 * Historique des paiements effectués
 */
export interface SupplierPayment {
  id: string;
  invoiceId: string; // Référence à la facture
  date: string; // Date du paiement
  amount: number; // Montant payé en FCFA
  paymentMethod: string; // Mode de paiement
  reference?: string; // N° de chèque, virement, etc.
}