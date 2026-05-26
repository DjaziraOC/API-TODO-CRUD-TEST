Voici un README spécifique pour documenter la partie déploiement. 


```markdown
# 🚀 Déploiement - API Todo (Backend & Frontend)

Ce document décrit les étapes de déploiement de l'application Todo complète (backend Node.js + frontend React) sur Render et GitHub Pages.

## 📦 Architecture déployée

```
┌─────────────────────┐      ┌─────────────────────────────┐
│    GitHub Pages     │      │           Render            │
│  (Frontend React)   │ ──→  │   (Backend Node.js + API)   │
│                     │      │                             │
│  https://djaziraoc  │      │  https://api-todo-crud-test │
│  .github.io/API-... │      │  .onrender.com              │
└─────────────────────┘      └─────────────────────────────┘
                                       │
                                       ↓
                              ┌─────────────────┐
                              │  MongoDB Atlas  │
                              │   (Base de      │
                              │    données)     │
                              └─────────────────┘
```

---

## 🔧 Backend (Render)

### Configuration requise

| Élément | Valeur |
|---------|--------|
| **Platform** | Render Web Service |
| **Branch** | `main` |
| **Root Directory** | (vide) |
| **Build Command** | `npm run build` |
| **Start Command** | `npm start` |

### Variables d'environnement

Créez les variables suivantes dans le dashboard Render :

```bash
PORT=10...
NODE_ENV=production
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/todo_db
JWT_SECRET=<secret_généré_avec_crypto>
JWT_EXPIRE=7d
CORS_ORIGINS=https://djaziraoc.github.io
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Package.json racine (obligatoire pour Render)

À la racine du projet, ajoutez ce fichier `package.json` :

```json
{
  "name": "todo-app",
  "version": "1.0.0",
  "scripts": {
    "start": "cd backend && npm start",
    "build": "cd backend && npm install",
    "postinstall": "cd backend && npm install"
  },
  "engines": {
    "node": ">=20.0.0 <22.0.0"
  }
}
```

### URLs backend après déploiement

| Endpoint | URL |
|----------|-----|
| Base | `VITE_API_URL` |
| Health check | `VITE_API_URL/health` |
| API Auth | `VITE_API_URL/auth/login` |
| API Tasks | `VITE_API_URL/tasks` |

---

## 🎨 Frontend (GitHub Pages)

### Configuration Vite

Assurez-vous que `frontend/vite.config.ts` contient :

```typescript
export default defineConfig({
  base: '/API-TODO-CRUD-TEST/',
  // ... autres configs
});
```

### Variable d'environnement

Créez `frontend/.env` :

```bash
VITE_API_URL=VITE_API_URL

> ⚠️ **Important** : Ne pas ajouter `/api` à la fin. Le code frontend ajoute automatiquement les chemins (`/auth/login`, `/tasks`, etc.).

### Configuration API (frontend)

Exemple de `api.ts` correctement configuré :

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:PORT';

export const api = {
  auth: {
    login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
    register: (payload) => request('/auth/signup', { method: 'POST', body: payload })
  },
  tasks: {
    list: (token) => request('/tasks', { token }),
    create: (token, payload) => request('/tasks', { method: 'POST', token, body: payload }),
    update: (token, id, payload) => request(`/tasks/${id}`, { method: 'PUT', token, body: payload }),
    remove: (token, id) => request(`/tasks/${id}`, { method: 'DELETE', token })
  }
};
```

### Déploiement

```bash
cd frontend

# Vérifiez que le .env est correct
cat .env
# Doit afficher: VITE_API_URL

# Reconstruiser
rm -rf dist
npm run build

# Déployer
npm run deploy
```

### URL frontend

```
https://djaziraoc.github.io/API-TODO-CRUD-TEST/
```

---

## 🔄 Workflow de déploiement complet

### 1. Déployer le backend (Render)

```bash
# Pousser les modifications sur GitHub
git add .
git commit -m "Update backend for deployment"
git push origin main

# Sur render.com :
# - Connecter le dépôt GitHub
# - Configurer les variables d'environnement
# - Déclencher un déploiement manuel (Clear build cache & deploy)
```

### 2. Déployer le frontend (GitHub Pages)

```bash
cd frontend

# Vérifier la variable d'env
echo "VITE_API_URL=VITE_API_URL" > .env

# Construire et déployer
npm run build
npm run deploy
```

### 3. Vérification

```bash
# Tester le backend
curl VITE_API_URL/health

# Tester l'inscription
curl -X POST VITE_API_URL/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"test123"}'
```

---

## 🐛 Dépannage fréquent

| Erreur | Cause probable | Solution |
|--------|----------------|----------|
| `Failed to fetch` | Frontend appelle `localhost` | Vérifier `VITE_API_URL` dans `.env` |
| `404 Not Found` | Double `/api` dans l'URL | Enlever `/api` du `.env` ou des chemins |
| `CORS error` | Backend n'accepte pas l'origine | Ajouter `CORS_ORIGINS` dans Render |
| `Build failed (ENOENT)` | Render ne trouve pas `package.json` | Ajouter `package.json` à la racine |

---

## 📊 Statistiques de déploiement

| Service | Statut | URL |
|---------|--------|-----|
| Render Backend | 🟢 Live | `VITE_API_URL` |
| GitHub Pages Frontend | 🟢 Live | `https://djaziraoc.github.io/API-TODO-CRUD-TEST/` |
| MongoDB Atlas | 🟢 Connecté | Cluster M0 (gratuit) |

---

## 🔐 Sécurité

- ✅ CORS restreint aux origines autorisées (`CORS_ORIGINS`)
- ✅ JWT avec expiration (7 jours)
- ✅ Rate limiting sur les routes API
- ✅ Headers HTTP sécurisés (Helmet)
- ✅ Variables d'environnement protégées

---

## 📝 Notes importantes

1. **Render (offre gratuite)** : Le backend s'endort après 15 minutes d'inactivité. La première requête peut prendre 15-30 secondes.
2. **MongoDB Atlas** : Le cluster gratuit (M0) offre 512MB de stockage, suffisant pour ce projet.
3. **GitHub Pages** : Les redéploiements écrasent l'ancienne version. Gardez toujours un backup local.

---

## 🆘 Support

En cas de problème :
1. Vérifier les logs Render (Dashboard → Events)
2. Vérifier la console navigateur (F12 → Console/Network)
3. Tester les endpoints avec `curl`

---

**Dernière mise à jour** : Mai 2026  
**Environnement** : Production  
**Statut** : ✅ Opérationnel
```

Ce README fournit une documentation complète sur le déploiement de L' application Todo, couvrant à la fois le backend et le frontend, ainsi que les étapes de configuration, les erreurs courantes et les solutions. on peut l'adapter selon vos besoins spécifiques ou ajouter des sections supplémentaires si nécessaire.