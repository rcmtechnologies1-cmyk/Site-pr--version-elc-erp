# 📁 Structure de l'Application ELC BTP Gestion

Cette application suit l'architecture **Feature-Sliced Design** pour une meilleure organisation et maintenabilité.

## 🗂️ Organisation des Dossiers

```
src/
 ┣ 📂 types/                    # Types TypeScript globaux
 ┃ ┗ 📜 index.ts                # User, KPI, CashFlowData, Project, MenuItem
 ┃
 ┣ 📂 data/                     # Données mockées (à remplacer par API)
 ┃ ┗ 📜 mockData.ts             # MOCK_USER, MOCK_KPIS, etc.
 ┃
 ┣ 📂 components/
 ┃ ┣ 📂 layout/                 # Composants de mise en page
 ┃ ┃ ┗ 📜 Sidebar.tsx           # Navigation latérale
 ┃ ┗ 📂 ui/                     # Composants UI génériques
 ┃   ┣ 📜 button.tsx            # Bouton réutilisable
 ┃   ┣ 📜 input.tsx             # Input réutilisable
 ┃   ┣ 📜 label.tsx             # Label réutilisable
 ┃   ┣ 📜 card.tsx              # Card réutilisable
 ┃   ┗ 📜 utils.ts              # Utilitaires (cn)
 ┃
 ┣ 📂 features/                 # LE COEUR DU LOGICIEL (par domaine métier)
 ┃ ┣ 📂 auth/                   # Feature: Authentification
 ┃ ┃ ┗ 📜 LoginPage.tsx         # Page de connexion
 ┃ ┃
 ┃ ┗ 📂 dashboard/              # Feature: Tableau de bord
 ┃   ┣ 📜 Dashboard.tsx         # Vue d'ensemble
 ┃   ┗ 📜 KPICard.tsx           # Carte KPI
 ┃
 ┣ 📂 app/
 ┃ ┣ 📜 App.tsx                 # ROUTEUR SIMPLE (coordonne les features)
 ┃ ┗ 📂 components/
 ┃   ┣ 📂 figma/                # Composants Figma (protégés)
 ┃   ┃ ┗ 📜 ImageWithFallback.tsx
 ┃   ┗ 📂 ui/                   # [ANCIEN] Composants UI (en migration)
 ┃
 ┗ 📂 styles/                   # Styles globaux
   ┣ 📜 fonts.css
   ┣ 📜 index.css
   ┣ 📜 tailwind.css
   ┗ 📜 theme.css
```

## 🎯 Conventions d'Import

### Alias `@/`
L'alias `@/` pointe vers le dossier `/src/`, configuré dans `vite.config.ts`.

**Exemples :**
```typescript
// Types globaux
import type { User, KPI } from '@/types';

// Mock data
import { MOCK_USER, MOCK_KPIS } from '@/data/mockData';

// Composants layout
import { Sidebar } from '@/components/layout/Sidebar';

// Composants UI
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Features
import { LoginPage } from '@/features/auth/LoginPage';
import { Dashboard } from '@/features/dashboard/Dashboard';
```

## 📐 Principes d'Architecture

### 1. Composants "Dumb" (Présentationnels)
Tous les composants dans `/features` et `/components` sont **"dumb"** :
- ❌ Pas d'appels API directs
- ❌ Pas de logique métier complexe
- ✅ Reçoivent les données via props
- ✅ Émettent des événements via callbacks

### 2. Interfaces TypeScript Obligatoires
Chaque composant doit définir ses props avec TypeScript :
```typescript
interface MyComponentProps {
  data: MyData;
  onAction: () => void;
}

export function MyComponent({ data, onAction }: MyComponentProps) {
  // ...
}
```

### 3. Mock Data Isolée
Toutes les données de test sont dans `/src/data/mockData.ts` :
- Facile à remplacer par de vrais appels API
- Données cohérentes dans toute l'app

### 4. App.tsx comme Container Intelligent
`/src/app/App.tsx` est le seul "smart component" :
- Gère le routage
- Gère l'état global (authentification)
- Passe les données aux features
- Coordonne les actions

### 5. Organisation par Domaine Métier
Chaque feature (auth, dashboard, chantiers, etc.) est isolée dans son propre dossier.

## 🚀 Ajouter une Nouvelle Feature

Pour ajouter une feature "chantiers" par exemple :

1. **Créer le dossier** : `/src/features/chantiers/`

2. **Créer les types** dans `/src/types/index.ts` :
```typescript
export interface Chantier {
  id: string;
  name: string;
  // ...
}
```

3. **Créer les mock data** dans `/src/data/mockData.ts` :
```typescript
export const MOCK_CHANTIERS: Chantier[] = [
  // ...
];
```

4. **Créer les composants** :
```
/src/features/chantiers/
 ┣ ChantierList.tsx
 ┣ ChantierDetails.tsx
 ┗ ChantierForm.tsx
```

5. **Intégrer dans App.tsx** :
```typescript
import { ChantierList } from '@/features/chantiers/ChantierList';

// Dans le render:
{activeTab === 'chantiers' && (
  <ChantierList 
    chantiers={MOCK_CHANTIERS}
    onAdd={handleAddChantier}
  />
)}
```

## 🔄 Migration vers l'API

Pour remplacer les mock data par de vraies données API :

1. Créer un service : `/src/services/api.ts`
2. Dans App.tsx, remplacer les `MOCK_*` par des appels API
3. Les composants "dumb" n'ont pas besoin d'être modifiés !

**Exemple :**
```typescript
// Avant (mock)
const kpis = MOCK_KPIS;

// Après (API)
const [kpis, setKpis] = useState<KPI[]>([]);
useEffect(() => {
  api.getKPIs().then(setKpis);
}, []);
```

## 📝 Note sur les Composants UI Anciens

Les composants dans `/src/app/components/ui/` sont en cours de migration vers `/src/components/ui/`.  
**Actuellement déplacés :** button, input, label, card, utils  
**À déplacer si nécessaire :** tous les autres composants

## ⚠️ Fichiers Protégés

Ces fichiers ne doivent PAS être modifiés :
- `/src/app/components/figma/ImageWithFallback.tsx`
- `/pnpm-lock.yaml`

---

**Date de création :** Mars 2026  
**Version :** 1.0.0
