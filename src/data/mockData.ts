import type { User, KPI, CashFlowData, Project, ProjectDetails, Transaction, MenuItem, Employee, Supplier, SupplierInvoice, SupplierPayment } from '@/types';

// ============================================
// MOCK DATA (Données par défaut)
// Ces données seront remplacées par des appels API
// ============================================

// ============================================
// MOCK DATA - UTILISATEURS (RBAC)
// ============================================

/**
 * Liste des utilisateurs système avec mots de passe simulés
 * ⚠️ EN PRODUCTION : Les mots de passe doivent être hashés côté serveur !
 */
export const MOCK_USERS: User[] = [
  {
    id: 'USR-001',
    name: 'Administrateur',
    email: 'admin@elcbtp.com',
    password: 'admin123', // ⚠️ Mot de passe en clair (DEMO UNIQUEMENT)
    initials: 'AD',
    role: 'ADMIN',
    status: 'ACTIF'
  },
  {
    id: 'USR-002',
    name: 'Comptable Bachar',
    email: 'comptable@elcbtp.com',
    password: 'comp123',
    initials: 'CB',
    role: 'COMPTABLE',
    status: 'ACTIF'
  },
  {
    id: 'USR-003',
    name: 'Secrétaire Marie',
    email: 'secretaire@elcbtp.com',
    password: 'sec123',
    initials: 'SM',
    role: 'SECRETAIRE',
    status: 'ACTIF'
  }
];

/**
 * Utilisateur par défaut (Comptable)
 * @deprecated Utilisez MOCK_USERS à la place
 */
export const MOCK_USER: User = MOCK_USERS[1]; // Comptable Bachar

export const MOCK_KPIS: KPI[] = [
  {
    id: 'ca',
    title: "Chiffre d'affaires (Mois)",
    value: '67M FCFA',
    trend: { value: 12.5, isPositive: true }
  },
  {
    id: 'projects',
    title: 'Projets Actifs',
    value: '5',
    trend: { value: 2, isPositive: true }
  },
  {
    id: 'invoices',
    title: 'Factures en Attente',
    value: '12',
    trend: { value: 3, isPositive: false }
  },
  {
    id: 'tresorerie',
    title: 'Trésorerie',
    value: '142M FCFA',
    trend: { value: 8.3, isPositive: true }
  }
];

export const MOCK_CASHFLOW_DATA: CashFlowData[] = [
  { month: 'Jan', recettes: 45000000, depenses: 32000000 },
  { month: 'Fév', recettes: 52000000, depenses: 38000000 },
  { month: 'Mar', recettes: 48000000, depenses: 35000000 },
  { month: 'Avr', recettes: 61000000, depenses: 42000000 },
  { month: 'Mai', recettes: 55000000, depenses: 39000000 },
  { month: 'Jun', recettes: 67000000, depenses: 45000000 }
];

export const MOCK_PROJECTS: Project[] = [
  { 
    id: '1', 
    name: 'Réhabilitation Route Lomé-Kpalimé', 
    status: 'en cours',
    clientName: 'Ministère des Travaux Publics',
    location: 'Lomé-Kpalimé, Togo',
    budgetTotal: 150000000,
    startDate: '2026-01-15',
    endDate: '2026-12-31'
  },
  { 
    id: '2', 
    name: 'Construction École Primaire Atakpamé', 
    status: 'en cours',
    clientName: 'Ministère de l\'Éducation',
    location: 'Atakpamé, Togo',
    budgetTotal: 80000000,
    startDate: '2026-02-01',
    endDate: '2026-08-30'
  },
  { 
    id: '3', 
    name: 'Pont sur le Mono à Tabligbo', 
    status: 'en cours',
    clientName: 'Gouvernement du Togo',
    location: 'Tabligbo, Togo',
    budgetTotal: 200000000,
    startDate: '2025-11-01',
    endDate: '2026-10-31'
  },
  { 
    id: '4', 
    name: 'Centre de Santé Sokodé', 
    status: 'terminé',
    clientName: 'Ministère de la Santé',
    location: 'Sokodé, Togo',
    budgetTotal: 65000000,
    startDate: '2025-06-01',
    endDate: '2025-12-15'
  },
  { 
    id: '5', 
    name: 'Marché Municipal Dapaong', 
    status: 'en cours',
    clientName: 'Mairie de Dapaong',
    location: 'Dapaong, Togo',
    budgetTotal: 45000000,
    startDate: '2026-01-10',
    endDate: '2026-06-30'
  },
  { 
    id: '6', 
    name: 'Aménagement Port de Lomé', 
    status: 'en cours',
    clientName: 'Autorité Portuaire',
    location: 'Lomé, Togo',
    budgetTotal: 350000000,
    startDate: '2025-09-01',
    endDate: '2027-03-31'
  }
];

// ============================================
// MOCK DATA - DÉTAILS CHANTIERS
// ============================================

/**
 * Projet détaillé principal : Réhabilitation Route Lomé-Kpalimé
 * Budget : 150 millions FCFA
 */
export const MOCK_PROJECT_DETAILS: ProjectDetails = {
  id: '1',
  name: 'Réhabilitation Route Lomé-Kpalimé',
  status: 'en cours',
  budgetTotal: 150000000,
  clientName: 'Ministère des Infrastructures du Togo',
  location: 'Lomé - Kpalimé, Région Maritime et Plateaux'
};

/**
 * Transactions du projet Réhabilitation Route Lomé-Kpalimé
 * Mélange de recettes (paiements client) et dépenses (fournisseurs, main d'œuvre)
 * ✨ ÉTALÉES SUR 6 MOIS (Octobre 2025 → Mars 2026) pour alimenter le graphique
 */
export const MOCK_TRANSACTIONS: Transaction[] = [
  // ============================================
  // OCTOBRE 2025
  // ============================================
  {
    id: 'TRX-OCT-001',
    projectId: '3', // Pont Tabligbo
    date: '2025-10-05',
    description: 'Paiement client - Avance projet Pont',
    amount: 50000000,
    type: 'RECETTE',
    paymentMethod: 'Virement bancaire'
  },
  {
    id: 'TRX-OCT-002',
    projectId: '3',
    date: '2025-10-10',
    description: 'Achat matériaux béton',
    amount: 18000000,
    type: 'DEPENSE',
    paymentMethod: 'Chèque'
  },
  {
    id: 'TRX-OCT-003',
    projectId: '6', // Port de Lomé
    date: '2025-10-15',
    description: 'Location engins octobre',
    amount: 12000000,
    type: 'DEPENSE',
    paymentMethod: 'Virement bancaire'
  },
  {
    id: 'TRX-OCT-004',
    projectId: '6',
    date: '2025-10-25',
    description: 'Salaires ouvriers octobre',
    amount: 8000000,
    type: 'DEPENSE',
    paymentMethod: 'Espèces'
  },

  // ============================================
  // NOVEMBRE 2025
  // ============================================
  {
    id: 'TRX-NOV-001',
    projectId: '3',
    date: '2025-11-02',
    description: 'Paiement client - Phase 2 Pont',
    amount: 40000000,
    type: 'RECETTE',
    paymentMethod: 'Virement bancaire'
  },
  {
    id: 'TRX-NOV-002',
    projectId: '3',
    date: '2025-11-08',
    description: 'Ferraillage et acier',
    amount: 15000000,
    type: 'DEPENSE',
    paymentMethod: 'Chèque'
  },
  {
    id: 'TRX-NOV-003',
    projectId: '6',
    date: '2025-11-12',
    description: 'Location engins novembre',
    amount: 10000000,
    type: 'DEPENSE',
    paymentMethod: 'Virement bancaire'
  },
  {
    id: 'TRX-NOV-004',
    projectId: '6',
    date: '2025-11-20',
    description: 'Salaires ouvriers novembre',
    amount: 7500000,
    type: 'DEPENSE',
    paymentMethod: 'Espèces'
  },

  // ============================================
  // DÉCEMBRE 2025
  // ============================================
  {
    id: 'TRX-DEC-001',
    projectId: '4', // Centre de Santé Sokodé
    date: '2025-12-05',
    description: 'Paiement final projet Sokodé',
    amount: 35000000,
    type: 'RECETTE',
    paymentMethod: 'Virement bancaire'
  },
  {
    id: 'TRX-DEC-002',
    projectId: '3',
    date: '2025-12-08',
    description: 'Travaux électriques',
    amount: 9000000,
    type: 'DEPENSE',
    paymentMethod: 'Virement bancaire'
  },
  {
    id: 'TRX-DEC-003',
    projectId: '6',
    date: '2025-12-15',
    description: 'Achat matériaux divers',
    amount: 14000000,
    type: 'DEPENSE',
    paymentMethod: 'Chèque'
  },
  {
    id: 'TRX-DEC-004',
    projectId: '6',
    date: '2025-12-20',
    description: 'Salaires ouvriers décembre',
    amount: 8500000,
    type: 'DEPENSE',
    paymentMethod: 'Espèces'
  },

  // ============================================
  // JANVIER 2026
  // ============================================
  {
    id: 'TRX-JAN-001',
    projectId: '1', // Route Lomé-Kpalimé
    date: '2026-01-10',
    description: 'Paiement client - Démarrage projet',
    amount: 55000000,
    type: 'RECETTE',
    paymentMethod: 'Virement bancaire'
  },
  {
    id: 'TRX-JAN-002',
    projectId: '5', // Marché Dapaong
    date: '2026-01-12',
    description: 'Paiement client - Avance Marché',
    amount: 20000000,
    type: 'RECETTE',
    paymentMethod: 'Virement bancaire'
  },
  {
    id: 'TRX-JAN-003',
    projectId: '1',
    date: '2026-01-15',
    description: 'Achat bitume et granulats',
    amount: 22000000,
    type: 'DEPENSE',
    paymentMethod: 'Chèque'
  },
  {
    id: 'TRX-JAN-004',
    projectId: '5',
    date: '2026-01-18',
    description: 'Location engins janvier',
    amount: 6000000,
    type: 'DEPENSE',
    paymentMethod: 'Virement bancaire'
  },
  {
    id: 'TRX-JAN-005',
    projectId: '1',
    date: '2026-01-25',
    description: 'Salaires ouvriers janvier',
    amount: 9000000,
    type: 'DEPENSE',
    paymentMethod: 'Espèces'
  },

  // ============================================
  // FÉVRIER 2026
  // ============================================
  {
    id: 'TRX-FEB-001',
    projectId: '1',
    date: '2026-02-05',
    description: 'Paiement client - Phase 2 Route',
    amount: 50000000,
    type: 'RECETTE',
    paymentMethod: 'Virement bancaire'
  },
  {
    id: 'TRX-FEB-002',
    projectId: '2', // École Atakpamé
    date: '2026-02-08',
    description: 'Paiement client - Avance École',
    amount: 35000000,
    type: 'RECETTE',
    paymentMethod: 'Virement bancaire'
  },
  {
    id: 'TRX-FEB-003',
    projectId: '1',
    date: '2026-02-10',
    description: 'Achat ciment CIMTOGO',
    amount: 8500000,
    type: 'DEPENSE',
    paymentMethod: 'Chèque'
  },
  {
    id: 'TRX-FEB-004',
    projectId: '2',
    date: '2026-02-15',
    description: 'Fondations et maçonnerie',
    amount: 12000000,
    type: 'DEPENSE',
    paymentMethod: 'Virement bancaire'
  },
  {
    id: 'TRX-FEB-005',
    projectId: '1',
    date: '2026-02-20',
    description: 'Location engins février',
    amount: 7000000,
    type: 'DEPENSE',
    paymentMethod: 'Virement bancaire'
  },
  {
    id: 'TRX-FEB-006',
    projectId: '5',
    date: '2026-02-25',
    description: 'Salaires ouvriers février',
    amount: 5500000,
    type: 'DEPENSE',
    paymentMethod: 'Espèces'
  },

  // ============================================
  // MARS 2026
  // ============================================
  {
    id: 'TRX-MAR-001',
    projectId: '1',
    date: '2026-03-01',
    description: 'Paiement client - Phase 3 Route',
    amount: 48000000,
    type: 'RECETTE',
    paymentMethod: 'Virement bancaire'
  },
  {
    id: 'TRX-MAR-002',
    projectId: '2',
    date: '2026-03-05',
    description: 'Paiement client - Phase 2 École',
    amount: 28000000,
    type: 'RECETTE',
    paymentMethod: 'Virement bancaire'
  },
  {
    id: 'TRX-MAR-003',
    projectId: '1',
    date: '2026-03-08',
    description: 'Bitume et enrobé',
    amount: 16000000,
    type: 'DEPENSE',
    paymentMethod: 'Chèque'
  },
  {
    id: 'TRX-MAR-004',
    projectId: '2',
    date: '2026-03-12',
    description: 'Tôles et charpente',
    amount: 9000000,
    type: 'DEPENSE',
    paymentMethod: 'Virement bancaire'
  },
  {
    id: 'TRX-MAR-005',
    projectId: '6',
    date: '2026-03-15',
    description: 'Location engins mars',
    amount: 8500000,
    type: 'DEPENSE',
    paymentMethod: 'Virement bancaire'
  },
  {
    id: 'TRX-MAR-006',
    projectId: '1',
    date: '2026-03-20',
    description: 'Salaires ouvriers mars',
    amount: 7000000,
    type: 'DEPENSE',
    paymentMethod: 'Espèces'
  }
];

export const MOCK_MENU_ITEMS: MenuItem[] = [
  { id: 'dashboard', label: "Vue d'ensemble", icon: 'LayoutDashboard' },
  { id: 'projects', label: 'Chantiers', icon: 'Hammer' },
  { id: 'personnel', label: 'Personnel', icon: 'UserCog' },
  { id: 'suppliers', label: 'Fournisseurs', icon: 'Truck' },
  { id: 'clients', label: 'Clients', icon: 'Users' },
  { id: 'invoices', label: 'Factures', icon: 'FileText' },
  { id: 'finance', label: 'Finance', icon: 'DollarSign' },
  { id: 'settings', label: 'Paramètres', icon: 'Settings' }
];

// ============================================
// MOCK DATA - PERSONNEL / OUVRIERS
// ============================================

/**
 * Liste des employés et ouvriers
 * Taux journaliers typiques du BTP au Togo
 */
export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'EMP-001',
    fullName: 'Koffi Mensah',
    role: 'Chef Maçon',
    phone: '+228 90 12 34 56',
    dailyRate: 8000,
    status: 'ACTIF'
  },
  {
    id: 'EMP-002',
    fullName: 'Jean Yao',
    role: 'Manœuvre',
    phone: '+228 91 23 45 67',
    dailyRate: 3500,
    status: 'ACTIF'
  },
  {
    id: 'EMP-003',
    fullName: 'Amina Kokou',
    role: 'Ferrailleur',
    phone: '+228 92 34 56 78',
    dailyRate: 7000,
    status: 'ACTIF'
  },
  {
    id: 'EMP-004',
    fullName: 'Edem Agbodji',
    role: 'Électricien',
    phone: '+228 93 45 67 89',
    dailyRate: 9000,
    status: 'ACTIF'
  },
  {
    id: 'EMP-005',
    fullName: 'Marie Akuété',
    role: 'Comptable',
    phone: '+228 94 56 78 90',
    dailyRate: 12000,
    status: 'INACTIF'
  }
];

// ============================================
// MOCK DATA - FOURNISSEURS
// ============================================

/**
 * Liste des fournisseurs réalistes au Togo
 * Catégories : MATERIAUX, ENGINS, SERVICES, AUTRES
 */
export const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: 'SUP-001',
    name: 'CIMTOGO',
    category: 'MATERIAUX',
    phone: '+228 22 21 30 40',
    email: 'commercial@cimtogo.tg',
    address: 'Zone Portuaire, Lomé, Togo',
    totalDebt: 4500000 // 4.5M FCFA
  },
  {
    id: 'SUP-002',
    name: 'SOTOTOLES S.A.',
    category: 'MATERIAUX',
    phone: '+228 22 25 11 22',
    email: 'ventes@sototoles.tg',
    address: 'Boulevard du 13 Janvier, Lomé, Togo',
    totalDebt: 0 // Aucune dette
  },
  {
    id: 'SUP-003',
    name: 'TOGO ENGINS LOCATION',
    category: 'ENGINS',
    phone: '+228 90 12 34 56',
    email: 'location@togoengins.com',
    address: 'Route de Kpalimé, Lomé, Togo',
    totalDebt: 8200000 // 8.2M FCFA (en retard)
  },
  {
    id: 'SUP-004',
    name: 'ELECTRICITE MODERNE SARL',
    category: 'SERVICES',
    phone: '+228 91 23 45 67',
    email: 'contact@electricitemoderne.tg',
    address: 'Tokoin, Lomé, Togo',
    totalDebt: 2100000 // 2.1M FCFA
  },
  {
    id: 'SUP-005',
    name: 'QUINCAILLERIE DU PLATEAU',
    category: 'MATERIAUX',
    phone: '+228 92 34 56 78',
    email: 'info@quincaillerieplateau.com',
    address: 'Atakpamé, Togo',
    totalDebt: 0 // Aucune dette
  }
];

/**
 * Factures fournisseurs (Mix de payées, partielles, et impayées)
 */
export const MOCK_SUPPLIER_INVOICES: SupplierInvoice[] = [
  // CIMTOGO - Facture partiellement payée
  {
    id: 'INV-001',
    supplierId: 'SUP-001',
    invoiceNumber: 'CIMTOGO-2026-045',
    date: '2026-02-10',
    description: 'Ciment CEM II 42.5 (200 sacs) + Sable fin (15 m³)',
    totalAmount: 6500000, // 6.5M FCFA
    paidAmount: 2000000, // 2M déjà payés
    status: 'PARTIELLE',
    dueDate: '2026-03-10',
    projectId: '1' // Lié au chantier Lomé-Kpalimé
  },
  
  // SOTOTOLES - Facture entièrement payée
  {
    id: 'INV-002',
    supplierId: 'SUP-002',
    invoiceNumber: 'SOTO-2026-128',
    date: '2026-01-25',
    description: 'Tôles ondulées galvanisées (150 unités)',
    totalAmount: 3200000, // 3.2M FCFA
    paidAmount: 3200000, // Entièrement payé
    status: 'PAYEE',
    dueDate: '2026-02-25',
    projectId: '2' // Lié au chantier Atakpamé
  },
  
  // TOGO ENGINS - Facture NON PAYÉE (en retard !)
  {
    id: 'INV-003',
    supplierId: 'SUP-003',
    invoiceNumber: 'TENGINS-2026-017',
    date: '2026-01-15',
    description: 'Location Bulldozer CAT D6 (30 jours)',
    totalAmount: 8200000, // 8.2M FCFA
    paidAmount: 0, // Rien payé !
    status: 'NON_PAYEE',
    dueDate: '2026-02-15', // DÉPASSÉ (aujourd'hui : 2026-03-02)
    projectId: '1'
  },
  
  // ELECTRICITE MODERNE - Facture partiellement payée
  {
    id: 'INV-004',
    supplierId: 'SUP-004',
    invoiceNumber: 'ELEC-2026-089',
    date: '2026-02-20',
    description: 'Installation électrique (tableaux + câblage)',
    totalAmount: 4500000, // 4.5M FCFA
    paidAmount: 2400000, // 2.4M payés
    status: 'PARTIELLE',
    dueDate: '2026-03-20',
    projectId: '4' // Lié au chantier Sokodé (terminé)
  },
  
  // CIMTOGO - Autre facture NON PAYÉE
  {
    id: 'INV-005',
    supplierId: 'SUP-001',
    invoiceNumber: 'CIMTOGO-2026-052',
    date: '2026-02-28',
    description: 'Fer à béton Ø10 et Ø12 (5 tonnes)',
    totalAmount: 4000000, // 4M FCFA
    paidAmount: 0, // Pas encore payé
    status: 'NON_PAYEE',
    dueDate: '2026-03-30',
    projectId: '3' // Lié au chantier Pont Tabligbo
  },
  
  // QUINCAILLERIE DU PLATEAU - Facture payée
  {
    id: 'INV-006',
    supplierId: 'SUP-005',
    invoiceNumber: 'QPLAT-2026-203',
    date: '2026-02-15',
    description: 'Outils divers (marteaux, truelles, niveaux)',
    totalAmount: 850000, // 850K FCFA
    paidAmount: 850000, // Entièrement payé
    status: 'PAYEE',
    dueDate: '2026-03-15',
    projectId: '2'
  },
  
  // TOGO ENGINS - Autre facture partiellement payée
  {
    id: 'INV-007',
    supplierId: 'SUP-003',
    invoiceNumber: 'TENGINS-2026-021',
    date: '2026-02-25',
    description: 'Location Pelle hydraulique + Camion-benne (15 jours)',
    totalAmount: 5500000, // 5.5M FCFA
    paidAmount: 5500000, // Payée (pas de dette sur celle-ci)
    status: 'PAYEE',
    dueDate: '2026-03-25',
    projectId: '6' // Lié au chantier Port de Lomé
  }
];

/**
 * Paiements effectués sur les factures fournisseurs
 */
export const MOCK_SUPPLIER_PAYMENTS: SupplierPayment[] = [
  // Paiement partiel sur INV-001 (CIMTOGO)
  {
    id: 'PAY-001',
    invoiceId: 'INV-001',
    date: '2026-02-15',
    amount: 2000000,
    paymentMethod: 'Virement bancaire',
    reference: 'VIR-20260215-001'
  },
  
  // Paiement complet sur INV-002 (SOTOTOLES)
  {
    id: 'PAY-002',
    invoiceId: 'INV-002',
    date: '2026-02-01',
    amount: 3200000,
    paymentMethod: 'Chèque',
    reference: 'CHQ-456789'
  },
  
  // Paiement partiel sur INV-004 (ELECTRICITE MODERNE)
  {
    id: 'PAY-003',
    invoiceId: 'INV-004',
    date: '2026-02-25',
    amount: 1500000,
    paymentMethod: 'Espèces',
    reference: 'ESP-20260225'
  },
  {
    id: 'PAY-004',
    invoiceId: 'INV-004',
    date: '2026-03-01',
    amount: 900000,
    paymentMethod: 'Virement bancaire',
    reference: 'VIR-20260301-002'
  },
  
  // Paiement complet sur INV-006 (QUINCAILLERIE)
  {
    id: 'PAY-005',
    invoiceId: 'INV-006',
    date: '2026-02-20',
    amount: 850000,
    paymentMethod: 'Espèces',
    reference: 'ESP-20260220'
  },
  
  // Paiement complet sur INV-007 (TOGO ENGINS)
  {
    id: 'PAY-006',
    invoiceId: 'INV-007',
    date: '2026-03-01',
    amount: 5500000,
    paymentMethod: 'Virement bancaire',
    reference: 'VIR-20260301-003'
  }
];