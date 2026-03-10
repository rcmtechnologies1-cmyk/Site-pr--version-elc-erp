# Module PARAMÈTRES - Documentation

## 📋 Vue d'ensemble

Le module **Paramètres** permet à l'administrateur et au directeur de gérer les utilisateurs du système et les informations de l'entreprise.

**Accès RBAC :** `ADMIN` | `DIRECTEUR` uniquement.

---

## 🎯 Fonctionnalités

### ✅ Onglet "Utilisateurs"

- **Liste des utilisateurs** : Affiche tous les utilisateurs avec :
  - Avatar avec initiales
  - Nom, Email
  - Badge de rôle (couleur distinctive par rôle)
  - Badge de statut (Actif / Inactif)
  - Actions : Modifier, Supprimer

- **Création d'utilisateur** :
  - Formulaire modal avec validation
  - Champs : Nom complet, Email, Mot de passe, Rôle, Statut
  - Génération automatique des initiales
  - Mot de passe minimum 6 caractères

- **Édition d'utilisateur** :
  - Pré-remplissage des champs
  - Mot de passe optionnel (laisser vide = pas de modification)

- **Suppression d'utilisateur** :
  - Modal de confirmation
  - Suppression définitive du localStorage

### ✅ Onglet "Profil Entreprise"

- **Informations entreprise (statique pour MVP)** :
  - Nom : ELC BTP
  - Adresse : Lomé, Togo
  - Téléphone : +228 22 00 00 00
  - NIF (Numéro d'Identification Fiscale)
  - RCCM (Registre de Commerce)
  
- Champs désactivés (grisés) pour la démo
- Bouton "Sauvegarder" affiche un toast de succès

---

## 🔐 Authentification Dynamique

### Système de Login

Après cette mission, l'authentification fonctionne avec des utilisateurs **dynamiques** :

1. **Liste des utilisateurs** : Stockée dans `localStorage` (clé : `elc_btp_users`)
2. **Fallback** : Si aucun utilisateur dans localStorage, utilise `MOCK_USERS`
3. **Validation** : Vérifie email ET mot de passe

### Utilisateurs par défaut

```typescript
{
  email: 'admin@elcbtp.com',
  password: 'admin123',
  role: 'ADMIN'
}

{
  email: 'comptable@elcbtp.com',
  password: 'comp123',
  role: 'COMPTABLE'
}

{
  email: 'secretaire@elcbtp.com',
  password: 'sec123',
  role: 'SECRETAIRE'
}
```

---

## 🗂️ Structure des fichiers

```
src/features/settings/
├── SettingsPage.tsx           # Composant Smart (gère l'état)
├── components/
│   └── UserForm.tsx            # Formulaire Dumb (création/édition)
└── README.md                   # Cette documentation
```

---

## 🔧 Technologies utilisées

- **React** : Composants fonctionnels avec hooks
- **TypeScript** : Types stricts pour User
- **localStorage** : Persistance des utilisateurs
- **RBAC** : Restriction d'accès avec `RoleGuard`
- **Lucide Icons** : Icônes modernes
- **Tailwind CSS v4** : Style Moderne & Épuré

---

## 🎨 Badges de Rôle

Chaque rôle a une couleur distinctive :

- **ADMIN** : Violet (Purple)
- **DIRECTEUR** : Bleu (Blue)
- **COMPTABLE** : Vert (Green)
- **SECRÉTAIRE** : Gris (Gray)

---

## 📊 Flux de données

```
SettingsPage (Smart)
    ↓
    ├── État local: users (depuis localStorage)
    ├── Handlers: CRUD utilisateurs
    └── Components:
        ├── UserForm (Dumb) → Création/Édition
        └── ConfirmModal → Suppression
```

---

## ⚠️ Notes Importantes

1. **Sécurité** : Les mots de passe sont en clair dans localStorage (DEMO UNIQUEMENT).  
   En production, ils doivent être hashés côté serveur avec bcrypt ou Argon2.

2. **Validation Email** : Vérifie le format mais ne vérifie pas l'unicité.  
   En production, ajouter une validation côté serveur.

3. **Session Active** : La modification d'un utilisateur connecté ne le déconnecte pas automatiquement.  
   En production, implémenter une logique de rafraîchissement de session.

4. **Profil Entreprise** : Actuellement statique. Dans la version finale, ces données devront être éditables et persistées.

---

## 🚀 Prochaines Étapes

- [ ] Hasher les mots de passe (bcrypt)
- [ ] Validation unicité email
- [ ] Upload logo entreprise
- [ ] Historique des modifications utilisateurs
- [ ] Gestion des permissions granulaires

---

**Status** : ✅ MODULE 100% FONCTIONNEL  
**Dernière mise à jour** : 6 Mars 2026
