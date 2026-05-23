```markdown
# 📝 Todo API - Backend

![CI Status](https://github.com/YOUR_USERNAME/API-TODO-CRUD-TEST/actions/workflows/test-api.yml/badge.svg)
![Node Version](https://img.shields.io/badge/node-18%20%7C%2020-green)
![MongoDB](https://img.shields.io/badge/MongoDB-6+-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## 📖 Table des matières

- [🎯 À propos](#à-propos)
- [✨ Fonctionnalités](#fonctionnalités)
- [🛠 Technologies](#technologies)
- [📋 Prérequis](#prérequis)
- [🚀 Installation](#installation)
- [⚙️ Configuration](#configuration)
- [🎮 Démarrage](#démarrage)
- [🖥️ Frontend (React)](#frontend-react)
- [📚 Documentation API](#documentation-api)
- [🧪 Tests](#tests)
- [🔄 CI/CD](#ci/cd)
- [📁 Structure du projet](#structure-du-projet)
- [💡 Bonnes pratiques](#bonnes-pratiques)
- [🔧 Dépannage](#dépannage)
- [🤝 Contributions](#contributions)
- [📄 Licence](#licence)
- [👨‍💻 Auteur](#auteur)



---

## 🎯 À propos

API RESTful complète pour la gestion de tâches (Todo List) avec authentification JWT et stockage MongoDB. Conçue avec les meilleures pratiques de développement Node.js et prête pour la production.

### Objectifs du projet

- ✅ Fournir une API RESTful complète et documentée
- ✅ Implémenter une authentification sécurisée (JWT)
- ✅ Assurer la qualité du code avec des tests automatisés
- ✅ Intégrer une pipeline CI/CD avec GitHub Actions
- ✅ Suivre les meilleures pratiques de sécurité

---

## ✨ Fonctionnalités

### 🔐 Authentification
- Inscription utilisateur (`/api/auth/register`)
- Connexion utilisateur (`/api/auth/login`)
- JWT tokens sécurisés
- Protection des routes privées

### 📋 Gestion des tâches (CRUD)
- ✅ Créer une tâche
- 📖 Lire toutes les tâches d'un utilisateur
- 🔍 Lire une tâche spécifique
- ✏️ Modifier une tâche
- ❌ Supprimer une tâche

### 🔒 Sécurité
- Hachage des mots de passe (bcrypt)
- Validation des données (express-validator)
- Protection contre les injections NoSQL
- Headers de sécurité (helmet)
- Rate limiting anti-DoS

### 📊 Tests & Qualité
- Tests unitaires avec Jest
- Tests API avec Postman/Newman
- Pipeline CI/CD (GitHub Actions)
- Tests multi-versions Node.js (18 & 20)

---

## 🛠 Technologies

| Catégorie | Technologies |
|-----------|--------------|
| **Runtime** | Node.js 18/20 |
| **Framework** | Express.js 4.x |
| **Base de données** | MongoDB 6+ avec Mongoose ODM |
| **Authentification** | JWT + bcrypt |
| **Tests** | Jest + Newman + MongoDB Memory Server |
| **CI/CD** | GitHub Actions |
| **Sécurité** | Helmet, express-rate-limit, express-validator |
| **Logging** | Winston (optionnel) |
| **Linting** | ESLint + Prettier |

---

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (version 18 ou 20)
- **npm** (version 9+)
- **MongoDB** (version 6+, local ou Atlas)
- **Git** (pour cloner le repository)

### Vérifier les versions

```bash
node --version   # v18.x ou v20.x
npm --version    # 9.x ou plus
mongod --version # 6.x ou plus
git --version    # 2.x ou plus
```

---

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone https://github.com/DjaziraOC/API-TODO-CRUD-TEST.git
cd API-TODO-CRUD-TEST/backend
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

```bash
cp .env.example .env
```

### 4. Démarrer MongoDB

**Option A - MongoDB local :**
```bash
sudo systemctl start mongod  # Linux
# ou
mongod --dbpath /path/to/data  # Manuel
```

**Option B - MongoDB Atlas (cloud) :**
Créez un cluster gratuit sur [MongoDB Atlas](https://www.mongodb.com/atlas)

### 5. Lancer l'application

```bash
# Mode développement (avec auto-reload)
npm run dev

# Mode production
npm start
```

---

## ⚙️ Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du dossier `backend` :

```env
# Serveur
PORT=<numéro de port>
NODE_ENV=development

# Base de données
MONGODB_URI=<mongodb uri>

# Authentification
JWT_SECRET=<mettre un secret fort et privé>
JWT_EXPIRE=7d

# Sécurité (optionnel)
RATE_LIMIT_WINDOW_MS=<valeur>   # ex: 15 minutes
RATE_LIMIT_MAX_REQUESTS=<valeur>   # ex: 100 requêtes par fenêtre
```

### Configuration MongoDB

**Local :**
```
mongodb://localhost:27017/nom_de_votre_base
```

**Atlas (cloud) :**
```
mongodb+srv://<username>:<password>@cluster.mongodb.net/nom_base
```

---

## 🎮 Démarrage

### Développement (Backend seul)

```bash
npm run dev
# Serveur démarré sur http://localhost:{{port}}
# Auto-reload activé pour les modifications
```

### Développement (Backend + Frontend)

Démarrez les deux services dans deux terminaux.

**1) Backend**

```bash
cd backend
npm install
npm run dev
# Backend: <URL backend>
```

**2) Frontend (React)**

```bash
cd frontend
npm install
npm run dev
# Frontend: <URL frontend>
```

Le frontend appelle le backend via l’URL définie dans `frontend/.env` (optionnel) :

```env
VITE_API_URL=<URL backend>
```

### Production

```bash
npm start
# Serveur démarré en mode production
```

### Vérification du serveur

```bash
curl http://localhost:{{port}}/health
# Réponse : { "status": "OK", "timestamp": "2026-01-01T00:00:00.000Z" }
```


---

## 🖥️ Frontend (React)

Le projet `frontend/` est une SPA (React) qui consomme l’API backend (JWT + CRUD tasks).

### Prérequis
- Node.js 18+

### Démarrage (Frontend)

```bash
cd frontend
npm install
npm run dev
```

- Frontend : <URL frontend>
- Backend attendu : <URL backend>

### Configuration de l’API

Optionnel : créer `frontend/.env` :

```env
VITE_API_URL=<URL backend>
```

Si le fichier `.env` n’existe pas, le frontend utilise <URL backend> par défaut.

---

## 📚 Documentation API

### Base URL
```
http://localhost:{{port}}/api
```

### 🔐 Endpoints d'authentification

#### `POST /api/auth/register` - Inscription
```json
// Requête
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123"
}

// Réponse (201 Created)
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "60d5f9f8b8e5a72d4c8e4...",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

#### `POST /api/auth/login` - Connexion
```json
// Requête
{
  "email": "john@example.com",
  "password": "securePassword123"
}

// Réponse (200 OK)
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "60d5f9f8b8e5a72d4c8e4...",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

### 📝 Endpoints des tâches (protégés)

> **Note:** Ajouter le header `Authorization: Bearer <token>` pour toutes ces routes

#### `GET /api/tasks` - Récupérer toutes les tâches
```bash
curl -H "Authorization: Bearer <token>" http://localhost:{{port}}/api/tasks
```

**Réponse :**
```json
{
  "success": true,
  "count": 2,
  "tasks": [
    {
      "_id": "60d5f9f8b8e5a72d4c8e4e3b",
      "title": "Faire les courses",
      "description": "Acheter du lait, du pain et des œufs",
      "completed": false,
      "user": "60d5f9f8b8e5a72d4c8e4...",
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ]
}
```

#### `POST /api/tasks` - Créer une tâche
```bash
curl -X POST http://localhost:{{port}}/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"Nouvelle tâche","description":"Description optionnelle"}'
```

#### `PUT /api/tasks/:id` - Modifier une tâche
```bash
curl -X PUT http://localhost:{{port}}/api/tasks/60d5f9f8b8e5a72d4c8e4... \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"Titre modifié","completed":true}'
```

#### `DELETE /api/tasks/:id` - Supprimer une tâche
```bash
curl -X DELETE http://localhost:{{port}}/api/tasks/60d5f9f8b8e5a72d4c8e4... \
  -H "Authorization: Bearer <token>"
```

### 📊 Codes de statut HTTP

| Code | Signification |
|------|---------------|
| 200 | ✅ Succès |
| 201 | ✅ Créé |
| 400 | ❌ Requête invalide |
| 401 | ❌ Non authentifié |
| 403 | ❌ Non autorisé |
| 404 | ❌ Ressource non trouvée |
| 500 | ❌ Erreur serveur |

---

## 🧪 Tests

### Tests unitaires (Jest)

```bash
# Exécuter tous les tests
npm test

# Mode watch (re-exécute à chaque modification)
npm run test:watch

# Avec couverture de code
npm run test:coverage
```

### Tests API (Postman/Newman)

```bash
# Aller dans le dossier des tests
cd test

# Rendre le script exécutable

chmod +x run-mongoose-tests.sh
# Exécuter les tests
./run-mongoose-tests.sh

# Les rapports seront générés dans : test/mongoose-test-reports/
```

### Tests en local vs CI

| Environnement | Base de données | Commande |
|---------------|-----------------|----------|
| **Local** | MongoDB local | `npm test` |
| **CI/CD** | MongoDB Memory Server | `npm run test:ci` |

---

## 🔄 CI/CD

### Pipeline GitHub Actions

Le projet utilise GitHub Actions pour l'intégration continue.

**Déclencheurs :**
- ✅ Push sur `main`, `master`, `develop`
- ✅ Pull requests vers `main`/`master`
- ✅ Exécution manuelle (`workflow_dispatch`)
- ✅ Programmé (tous les jours à 6h)

**Jobs exécutés :**

| Job | Description | Technologies |
|-----|-------------|--------------|
| **Newman Tests** | Tests API complets | Newman, Postman, MongoDB Memory Server |
| **Lint** | Qualité du code | ESLint, Prettier |
| **Security** | Scan de vulnérabilités | npm audit, gitleaks |
| **Notification** | Rapport Slack | Webhook (optionnel) |

### Badge de statut

```markdown
![CI](https://github.com/VOTRE_USERNAME/API-TODO-CRUD-TEST/actions/workflows/test-api.yml/badge.svg)
```

---

## 📁 Structure du projet

```
API-TODO-CRUD-TEST/
├── .github/                      # GitHub Actions (CI/CD)
│   └── workflows/
│       └── test-api.yml
├── backend/                      # API Node.js + Express + MongoDB
│   ├── config/                   # Config (ex: jwt)
│   ├── controllers/             # Logique métier
│   ├── middleware/              # Middlewares Express (auth, validation, etc.)
│   ├── models/                  # Modèles Mongoose (Task, User)
│   ├── routes/                  # Routes API (auth, tasks)
│   ├── test/                     # Tests (Jest + scripts + Postman/Newman)
│   ├── utils/                    # Helpers
│   ├── server.js                 # Point d'entrée
│   ├── package.json
│   └── (Dockerfile(s), docker-compose.dev.yml, scripts test, etc.)
├── frontend/                     # SPA React (Vite) pour consommer l’API
│   ├── src/
│   │   ├── pages/               # AuthPage, TasksPage
│   │   ├── lib/                 # Client API (api.ts)
│   │   ├── store/               # Redux slices (authSlice, tasksSlice)
│   │   ├── styles/              # styles globaux
│   │   └── App.tsx
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── (node_modules, dist/, etc. ignorés)
├── README.md
├── WORKLOG.md
├── LICENSE
└── (autres fichiers de meta: docs, scripts, etc.)
```


---

## 💡 Bonnes pratiques

### Sécurité
- ✅ Toutes les routes protégées utilisent JWT
- ✅ Mots de passe hashés avec bcrypt
- ✅ Validation des entrées utilisateur
- ✅ Headers de sécurité (helmet)
- ✅ Rate limiting contre les attaques DoS

### Code
- ✅ Architecture MVC
- ✅ Gestion d'erreur centralisée
- ✅ Variables d'environnement (.env)
- ✅ ESLint + Prettier pour le style

### Tests
- ✅ Tests unitaires pour la logique métier
- ✅ Tests d'intégration pour les API
- ✅ Couverture de code > 80%
- ✅ Tests automatisés en CI

---

## 🔧 Dépannage

### Erreur : MongoDB ne démarre pas

```bash
# Vérifier que MongoDB est installé
mongod --version

# Démarrer MongoDB manuellement
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # Mac

# Alternative : utiliser MongoDB Atlas (cloud)
```

### Erreur : Port {{port}} déjà utilisé

```bash
# Trouver le processus utilisant le port {{port}}
lsof -i :{{port}}  # Mac/Linux
netstat -ano | findstr :{{port}}  # Windows

# Changer le port dans .env
PORT=<numéro de port>
```

### Erreur : JWT_SECRET manquant

```bash
# Générer un secret sécurisé
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copier la sortie dans .env
JWT_SECRET=<coller le secret généré>
```

### Erreur : npm ci échoue

```bash
# Supprimer node_modules et package-lock.json
rm -rf node_modules package-lock.json

# Réinstaller
npm install
```

---

## 🤝 Contributions

Les contributions sont les bienvenues !

1. **Fork** le projet
2. Crée une branche (`git checkout -b feature/amazing-feature`)
3. **Commit** tes changements (`git commit -m 'Add amazing feature'`)
4. **Push** sur la branche (`git push origin feature/amazing-feature`)
5. Ouvre une **Pull Request**

### Standards de contribution

- ✅ Suivre ESLint + Prettier
- ✅ Ajouter des tests pour les nouvelles fonctionnalités
- ✅ Mettre à jour la documentation
- ✅ Passer tous les tests CI

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus d'informations.

---

## 👨‍💻 Auteur

**Votre Nom**
- GitHub: [@DjaziraOC](https://github.com/DjaziraOC/)
- 

---

## 🙏 Remerciements

- Express.js team
- MongoDB team
- Postman/Newman team
- Toute la communauté open-source

---

## 📞 Support

Pour toute question ou problème :
- Ouvrir une **issue** sur GitHub





