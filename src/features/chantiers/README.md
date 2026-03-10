# ✅ Feature "Chantiers" - Documentation

## 📋 Vue d'ensemble

La feature **Chantiers** permet au comptable Bachar de gérer les détails financiers d'un projet de construction au Togo. C'est **l'écran le plus important** de l'application ERP ELC BTP Gestion.

## 🎯 Objectif

Offrir une vue détaillée et centralisée de tous les aspects financiers d'un chantier :
- Budget total et répartition
- Historique complet des transactions (recettes et dépenses)
- Vue synthétique des KPI financiers
- Gestion des paiements et moyens de paiement

## 📁 Structure de la Feature

```
src/
 ┣ 📂 types/
 ┃ ┗ 📜 index.ts
 ┃   ┣ Transaction          # Nouvelle interface
 ┃   ┗ ProjectDetails       # Nouvelle interface (extends Project)
 ┃
 ┣ 📂 data/
 ┃ ┗ 📜 mockData.ts
 ┃   ┣ MOCK_PROJECT_DETAILS # Projet détaillé : Route Lomé-Kpalimé
 ┃   ┗ MOCK_TRANSACTIONS    # 5 transactions réalistes
 ┃
 ┗ 📂 features/
   ┗ 📂 chantiers/
     ┗ 📜 ChantierDetails.tsx  # Composant principal
```

## 🔧 Interfaces TypeScript

### Transaction
```typescript
interface Transaction {
  id: string;
  date: string;                      // Format ISO : "2026-02-15"
  description: string;               // Ex: "Paiement client - Phase 1"
  amount: number;                    // Montant en FCFA
  type: 'RECETTE' | 'DEPENSE';      // Type de transaction
  paymentMethod: string;             // Ex: "Virement bancaire"
}
```

### ProjectDetails
```typescript
interface ProjectDetails extends Project {
  budgetTotal: number;               // Budget total en FCFA
  clientName: string;                // Ex: "Ministère des Infrastructures"
  location: string;                  // Ex: "Lomé - Kpalimé"
}
```

## 📊 Mock Data

### MOCK_PROJECT_DETAILS
```typescript
{
  id: '1',
  name: 'Réhabilitation Route Lomé-Kpalimé',
  status: 'en cours',
  budgetTotal: 150000000,  // 150M FCFA
  clientName: 'Ministère des Infrastructures du Togo',
  location: 'Lomé - Kpalimé, Région Maritime et Plateaux'
}
```

### MOCK_TRANSACTIONS (Exemple)
```typescript
[
  {
    id: 'TRX-001',
    date: '2026-02-15',
    description: 'Paiement client - Phase 1 (Avance)',
    amount: 45000000,  // 45M FCFA
    type: 'RECETTE',
    paymentMethod: 'Virement bancaire'
  },
  {
    id: 'TRX-002',
    date: '2026-02-18',
    description: 'Achat ciment - Fournisseur CIMTOGO',
    amount: 8500000,  // 8.5M FCFA
    type: 'DEPENSE',
    paymentMethod: 'Chèque'
  }
  // ... 3 autres transactions
]
```

## 🎨 Design System Appliqué

### Couleurs
| Élément | Couleur | Usage |
|---------|---------|-------|
| Fond global | `#F9FAFB` | Arrière-plan de la page |
| Cartes | `#FFFFFF` | Fond des cartes KPI et tableau |
| Accent principal | `#4F46E5` | Boutons, badge "En cours", Solde actuel |
| Texte principal | `#111827` | Titres et textes importants |
| Texte secondaire | `#6B7280` | Labels et textes descriptifs |
| Recettes | `#10B981` | Montants positifs (vert) |
| Dépenses | `#EF4444` | Montants négatifs (rouge) |

### Espacements
- Padding cartes : `24px` (p-6)
- Gaps entre éléments : `16px` (gap-4) ou `24px` (gap-6)
- Border radius : `12px` (rounded-xl)
- Ombres : `box-shadow: 0 1px 3px rgba(0,0,0,0.05)`

## 🧩 Composant ChantierDetails

### Props
```typescript
interface ChantierDetailsProps {
  project: ProjectDetails;           // Données du projet
  transactions: Transaction[];       // Liste des transactions
  onBack: () => void;               // Retour à la liste
  onAddTransaction: () => void;     // Ajout d'une transaction
}
```

### Structure UI

#### 1. Header (En-tête)
- **Bouton retour** : `← Retour aux chantiers` (texte secondaire #6B7280)
- **Titre H1** : Nom du chantier + Badge de statut
- **Badge statut** : 
  - En cours : Point bleu `#4F46E5` + fond `#EEF2FF`
  - Terminé : Point vert `#10B981` + fond `#ECFDF5`
  - En attente : Point orange `#F59E0B` + fond `#FFFBEB`
- **Bouton action** : `+ Nouvelle Transaction` (fond indigo `#4F46E5`)
- **Informations secondaires** : Client et localisation

#### 2. Section KPI (4 Cartes)

**Disposition** : Grid 4 colonnes égales

| KPI | Valeur | Couleur |
|-----|--------|---------|
| Budget Total | 150 000 000 FCFA | Texte noir `#111827` |
| Total Encaissé | 75 000 000 FCFA | Vert `#10B981` |
| Total Décaissé | 16 500 000 FCFA | Rouge `#EF4444` |
| Solde Actuel | 133 500 000 FCFA | Indigo `#4F46E5` |

**Calculs** :
- Total Encaissé = Somme des transactions type `RECETTE`
- Total Décaissé = Somme des transactions type `DEPENSE`
- Solde Actuel = Budget Total - Total Décaissé

#### 3. Tableau des Transactions

**Colonnes** :
1. Date (format : `15 févr. 2026`)
2. Description (font-medium)
3. Type (Badge coloré)
4. Moyen de paiement
5. Montant (aligné à droite, coloré selon type)

**Style ultra clean** :
- ✅ Lignes horizontales fines `#E5E7EB`
- ❌ Pas de bordures verticales
- ✅ Entêtes en gris `#6B7280` uppercase
- ✅ Hover effect sur les lignes
- ✅ Badges pour les types :
  - RECETTE : Fond `#ECFDF5`, Texte `#10B981`
  - DEPENSE : Fond `#FEE2E2`, Texte `#EF4444`

## 🔄 Navigation

### Depuis le Dashboard
```typescript
// L'utilisateur clique sur un projet dans "Chantiers Actifs"
<Dashboard onProjectClick={handleViewProjectDetails} />
```

### Vers les détails
```typescript
const handleViewProjectDetails = (projectId: string) => {
  setSelectedProjectId(projectId);
  setActiveTab('project-details');
};
```

### Retour au Dashboard
```typescript
const handleBackToProjects = () => {
  setSelectedProjectId(null);
  setActiveTab('projects');
};
```

## 🚀 Fonctionnalités Actuelles

### ✅ Implémenté
- [x] Affichage des détails du projet
- [x] Calcul automatique des KPI financiers
- [x] Liste des transactions avec filtrage par type
- [x] Formatage des montants en FCFA
- [x] Formatage des dates en français
- [x] Navigation depuis/vers le Dashboard
- [x] Design system "Moderne & Épuré" respecté
- [x] Composant 100% "dumb" (aucun fetch)

### 🔜 À Implémenter
- [ ] Modal d'ajout de transaction
- [ ] Filtrage des transactions (par type, date, montant)
- [ ] Export des transactions en PDF/Excel
- [ ] Graphique de l'évolution du solde
- [ ] Pièces justificatives attachées aux transactions
- [ ] Recherche de transactions
- [ ] Pagination si > 50 transactions

## 🎓 Principes d'Architecture Respectés

### 1. ✅ Composant "Dumb"
```typescript
// ❌ PAS DE ÇA
const [transactions, setTransactions] = useState([]);
useEffect(() => {
  fetch('/api/transactions').then(setTransactions);
}, []);

// ✅ MAIS ÇA
export function ChantierDetails({ transactions }: ChantierDetailsProps) {
  // Les données arrivent via props
}
```

### 2. ✅ Types Centralisés
```typescript
// Toutes les interfaces sont dans src/types/index.ts
import type { ProjectDetails, Transaction } from '@/types';
```

### 3. ✅ Mock Data Isolées
```typescript
// Les données de test sont dans src/data/mockData.ts
import { MOCK_PROJECT_DETAILS, MOCK_TRANSACTIONS } from '@/data/mockData';
```

### 4. ✅ Événements via Props
```typescript
// Les actions sont passées en props
onBack: () => void;
onAddTransaction: () => void;
```

### 5. ✅ App.tsx comme Smart Component
```typescript
// App.tsx coordonne tout
<ChantierDetails 
  project={MOCK_PROJECT_DETAILS}
  transactions={MOCK_TRANSACTIONS}
  onBack={handleBackToProjects}
  onAddTransaction={handleAddTransaction}
/>
```

## 📈 Évolution Future

### Phase 2 : Intégration API
```typescript
// Dans App.tsx
const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(null);
const [transactions, setTransactions] = useState<Transaction[]>([]);

useEffect(() => {
  if (selectedProjectId) {
    api.getProjectDetails(selectedProjectId).then(setProjectDetails);
    api.getTransactions(selectedProjectId).then(setTransactions);
  }
}, [selectedProjectId]);

// Le composant ChantierDetails n'a pas besoin d'être modifié !
<ChantierDetails 
  project={projectDetails}
  transactions={transactions}
  onBack={handleBackToProjects}
  onAddTransaction={handleAddTransaction}
/>
```

### Phase 3 : React Router
```typescript
// Dans src/app/routes.ts
{
  path: "/chantiers/:id",
  Component: ChantierDetailsPage,
  loader: async ({ params }) => {
    const project = await api.getProjectDetails(params.id);
    const transactions = await api.getTransactions(params.id);
    return { project, transactions };
  }
}
```

## 🧪 Tests Suggérés

```typescript
describe('ChantierDetails', () => {
  it('calcule correctement le total encaissé', () => {
    const transactions = [
      { type: 'RECETTE', amount: 10000 },
      { type: 'RECETTE', amount: 20000 },
      { type: 'DEPENSE', amount: 5000 }
    ];
    // totalEncaissé devrait être 30000
  });

  it('affiche le badge "En cours" pour un projet actif', () => {
    const project = { status: 'en cours' };
    // Badge avec point bleu et texte "En cours"
  });

  it('formate les montants correctement', () => {
    const amount = 150000000;
    // Doit afficher "150 000 000"
  });
});
```

## 📝 Notes Importantes

### Montants en FCFA
Tous les montants sont stockés en **FCFA entiers** (pas de centimes).
- Budget : `150000000` = 150M FCFA
- Formatage : `150 000 000 FCFA`

### Dates
Format ISO dans les données : `"2026-02-15"`  
Affichage français : `"15 févr. 2026"`

### Types de Transaction
Seulement 2 types possibles : `'RECETTE' | 'DEPENSE'`
- RECETTE : Encaissement (argent qui entre)
- DEPENSE : Décaissement (argent qui sort)

### Moyens de Paiement Togolais
- Virement bancaire
- Chèque
- Espèces
- Mobile Money (à ajouter)

---

**Développé avec ❤️ pour ELC BTP Gestion**  
**Architecture : Feature-Sliced Design**  
**Design : Moderne & Épuré**  
**Date : Mars 2026**
