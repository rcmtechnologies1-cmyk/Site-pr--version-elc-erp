# Module Fournisseurs & Dettes

## 📋 Vue d'ensemble

Ce module gère la **base de données des fournisseurs**, les **factures à crédit**, les **paiements**, et le **suivi des dettes** dans le contexte du BTP au Togo.

---

## 🏗️ Architecture

### **Pattern : Feature-Sliced Design Simplifié**

```
src/features/fournisseurs/
├── SuppliersList.tsx          # (Smart) - Liste + KPI dettes
├── SupplierDetails.tsx        # (Smart) - Détail + Factures
├── components/
│   ├── SupplierForm.tsx       # (Dumb) - Formulaire fournisseur [À VENIR]
│   ├── InvoiceForm.tsx        # (Dumb) - Formulaire facture [À VENIR]
│   └── PaymentForm.tsx        # (Dumb) - Formulaire paiement [À VENIR]
└── README.md                  # Documentation
```

---

## 🎯 Fonctionnalités Implémentées

### ✅ **1. SuppliersList (Route : `/fournisseurs`)**

**Composant Smart** qui affiche :

#### **KPI Financiers (Rouge = Critique)**
- **Dette Totale Entreprise** : Somme de tous les restes à payer (Rouge)
- **Factures en Retard** : Nombre de factures dépassant la date d'échéance (Orange)
- **Factures Non Payées** : Total des factures partielles ou impayées (Gris)

#### **Tableau des Fournisseurs**
- Colonnes : Nom, Catégorie, Contact, Dette Actuelle, Actions
- Recherche en temps réel (nom, catégorie, téléphone, email)
- Clic sur ligne → Navigation vers `/fournisseurs/:id`
- Badge de catégorie : MATERIAUX, ENGINS, SERVICES, AUTRES
- Dette en ROUGE si > 0, VERT si = 0

#### **Responsive**
- Desktop : Tableau complet 5 colonnes
- Mobile : Liste verticale avec cartes

---

### ✅ **2. SupplierDetails (Route : `/fournisseurs/:id`)**

**Composant Smart** qui affiche :

#### **Résumé Fournisseur**
- Nom, catégorie, téléphone, email, adresse
- Bouton "Retour aux fournisseurs"
- Bouton "Enregistrer Facture" (Modal placeholder)

#### **KPI du Fournisseur**
- **Dette Totale** : Reste à payer pour ce fournisseur (Rouge/Vert)
- **Factures en Retard** : Nombre (Orange)
- **Total Factures** : Nombre total de factures (Gris)

#### **Tableau des Factures**
Colonnes :
- **Date** : Date d'émission
- **N° Facture** : Ex : "CIMTOGO-2026-045"
- **Description** : Détail de l'achat
- **Montant Total** : En FCFA (millions)
- **Déjà Payé** : En vert
- **Reste à Payer** : En rouge gras
- **Statut** : Badge (PAYEE vert / PARTIELLE orange / NON_PAYEE rouge)
- **Échéance** : Date + "RETARD" si dépassée
- **Action** : Bouton "Payer" (Modal placeholder)

#### **Fonctionnalités Avancées**
- Ligne en rouge pâle si facture en retard
- Calcul automatique du reste à payer : `totalAmount - paidAmount`
- Vérification de la date d'échéance (aujourd'hui : 2026-03-02)

---

## 🗂️ Types TypeScript

### **Supplier**
```typescript
interface Supplier {
  id: string;
  name: string;
  category: 'MATERIAUX' | 'ENGINS' | 'SERVICES' | 'AUTRES';
  phone: string;
  email: string;
  address?: string;
  totalDebt: number; // Dette totale actuelle en FCFA
}
```

### **SupplierInvoice**
```typescript
interface SupplierInvoice {
  id: string;
  supplierId: string;
  invoiceNumber: string;
  date: string;
  description: string;
  totalAmount: number;
  paidAmount: number;
  status: 'NON_PAYEE' | 'PARTIELLE' | 'PAYEE';
  dueDate: string;
  projectId?: string; // Lien vers un chantier
}
```

### **SupplierPayment**
```typescript
interface SupplierPayment {
  id: string;
  invoiceId: string;
  date: string;
  amount: number;
  paymentMethod: string;
  reference?: string;
}
```

---

## 📊 Mock Data (Togo)

### **Fournisseurs Réalistes**
1. **CIMTOGO** (Matériaux) - Dette : 4.5M FCFA
2. **SOTOTOLES S.A.** (Matériaux) - Dette : 0 FCFA
3. **TOGO ENGINS LOCATION** (Engins) - Dette : 8.2M FCFA (**EN RETARD**)
4. **ELECTRICITE MODERNE SARL** (Services) - Dette : 2.1M FCFA
5. **QUINCAILLERIE DU PLATEAU** (Matériaux) - Dette : 0 FCFA

### **Factures**
7 factures totales avec statuts variés :
- 2 PAYÉES (vert)
- 2 PARTIELLES (orange)
- 3 NON PAYÉES (rouge, dont 1 en retard)

### **Total Dette Entreprise**
**14.8M FCFA** (somme des restes à payer)

---

## 🎨 Design System

### **Couleurs**
- **Dette > 0** : `text-red-600` (Critique)
- **Dette = 0** : `text-green-600` (OK)
- **Factures en Retard** : `text-orange-600` + Fond `bg-red-50`
- **Badges Statut** :
  - PAYEE : `bg-green-100 text-green-700`
  - PARTIELLE : `bg-orange-100 text-orange-700`
  - NON_PAYEE : `bg-red-100 text-red-700`

### **Icônes Lucide**
- `Truck` : Fournisseurs (Sidebar)
- `AlertTriangle` : Dette / Retard
- `FileText` : Factures
- `CreditCard` : Paiements
- `Package` : Catégories

---

## 🚀 Routes

| Route | Composant | Description |
|-------|-----------|-------------|
| `/fournisseurs` | `SuppliersList` | Liste + KPI dettes |
| `/fournisseurs/:id` | `SupplierDetails` | Détail + Factures |

**Ajouté dans** :
- `App.tsx` : Routes React Router
- `Sidebar.tsx` : Menu "Fournisseurs" avec icône Truck

---

## 📱 Responsive

### **Desktop (≥ 768px)**
- Tableaux complets multi-colonnes
- KPI en grille 3 colonnes
- Modals centrées

### **Mobile (< 768px)**
- Listes verticales
- KPI empilés
- Boutons pleine largeur

---

## 🔜 Fonctionnalités À Développer

### **1. Formulaire Nouveau Fournisseur**
- Composant Dumb : `SupplierForm.tsx`
- Champs : Nom, Catégorie (dropdown), Téléphone, Email, Adresse
- Validation des champs requis
- Gestion de l'état dans `SuppliersList`

### **2. Formulaire Enregistrer Facture**
- Composant Dumb : `InvoiceForm.tsx`
- Champs : N° Facture, Date, Description, Montant Total, Date d'échéance, Chantier (dropdown optionnel)
- Calcul automatique : `paidAmount = 0`, `status = 'NON_PAYEE'`

### **3. Formulaire Effectuer Paiement**
- Composant Dumb : `PaymentForm.tsx`
- Champs : Montant, Mode de paiement (dropdown), Référence
- Validation : Montant ≤ Reste à payer
- Mise à jour automatique :
  - `paidAmount += montant`
  - `status = 'PARTIELLE'` si `paidAmount < totalAmount`
  - `status = 'PAYEE'` si `paidAmount === totalAmount`

### **4. Persistence LocalStorage**
- Clés : `elc_btp_suppliers`, `elc_btp_invoices`, `elc_btp_payments`
- Même pattern que `elc_btp_projects` et `elc_btp_transactions`

### **5. Historique des Paiements**
- Afficher les paiements déjà effectués sous chaque facture
- Tableau : Date, Montant, Mode, Référence

### **6. Rapports et Exports**
- Export Excel des factures en retard
- Génération PDF d'une facture
- Relance automatique fournisseurs (email)

---

## 🔧 Maintenance

### **Calcul de la Dette Totale**
La dette d'un fournisseur est calculée **dynamiquement** :
```typescript
const totalDebt = invoices
  .filter(inv => inv.supplierId === supplierId)
  .reduce((sum, inv) => sum + (inv.totalAmount - inv.paidAmount), 0);
```

### **Vérification des Retards**
Une facture est en retard si :
```typescript
const today = new Date('2026-03-02');
const dueDate = new Date(invoice.dueDate);
const isOverdue = dueDate < today && invoice.status !== 'PAYEE';
```

---

## 🎯 Points Clés Métier BTP

1. **Achats à Crédit** : Pratique courante dans le BTP (délais de paiement 30-60 jours)
2. **Gestion de Trésorerie** : Suivi critique pour éviter les ruptures de cash
3. **Retards de Paiement** : Peuvent entraîner des pénalités ou arrêt de livraisons
4. **Traçabilité** : Lier factures aux chantiers pour comptabilité analytique
5. **Catégories** :
   - **MATERIAUX** : Ciment, fer, tôles, sable, etc.
   - **ENGINS** : Location bulldozers, pelles, camions
   - **SERVICES** : Électricité, plomberie, études
   - **AUTRES** : Transport, restauration, etc.

---

## ✅ Checklist de Déploiement

- [x] Types centralisés dans `/src/types/index.ts`
- [x] Mock data dans `/src/data/mockData.ts`
- [x] Composant `SuppliersList.tsx` (Smart)
- [x] Composant `SupplierDetails.tsx` (Smart)
- [x] Routes ajoutées dans `App.tsx`
- [x] Menu "Fournisseurs" ajouté dans `Sidebar.tsx`
- [x] Icône `Truck` importée et mappée
- [x] Responsive mobile/desktop
- [x] Calculs KPI fonctionnels
- [x] Navigation inter-pages fonctionnelle
- [ ] Formulaire Nouveau Fournisseur (À VENIR)
- [ ] Formulaire Enregistrer Facture (À VENIR)
- [ ] Formulaire Effectuer Paiement (À VENIR)
- [ ] Persistence LocalStorage (À VENIR)

---

## 🎉 Statut

**MODULE 100% FONCTIONNEL** pour consultation et navigation.  
**Prêt pour ajout des fonctionnalités CRUD** (formulaires + persistence).

---

**Auteur** : ELC BTP Gestion  
**Date** : Mars 2026  
**Version** : 1.0
