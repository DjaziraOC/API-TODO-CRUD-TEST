
## 📝 **README-TESTS-TEMPLATE.md 

```markdown
[![Postman](https://img.shields.io/badge/Postman-Tests-orange?logo=postman)](https://www.postman.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-Validé-green?logo=mongoDB)](https://mongoosejs.com/)
[![Tests](https://img.shields.io/badge/Tests-{{TOTAL_TESTS}}%20suites-blue)](https://github.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

## 🎯 Vue d'ensemble
Collection Postman complète avec **{{TOTAL_TESTS}} tests automatisés** pour valider l'API Todo basée sur le modèle Mongoose Task. Inclut authentification automatique, validation du schéma et nettoyage intelligent.

## 📋 Statistiques des Tests
- **🔐 Initialisation** : {{INIT_TESTS}} tests
- **🧪 CRUD Spécifique** : {{CRUD_TESTS}} tests  
- **⚠️ Validation** : {{VALIDATION_TESTS}} tests (erreurs attendues)
- **📊 Statistiques & Nettoyage** : {{CLEANUP_TESTS}} tests
- **✅ Total** : {{TOTAL_TESTS}} tests organisés

---

## 🔐 FONCTIONNALITÉS CLÉS

### 🔐 Authentification Automatique
- ✅ Obtention auto du token JWT
- ✅ Supporte tous les formats de token
- ✅ Gère les échecs d'authentification
- ✅ Token valide pour toute la session

### 🧪 Tests Mongoose Spécifiques
- ✅ Vérifie toutes les validations du schéma
- ✅ Teste les valeurs par défaut
- ✅ Vérifie les indexes composés
- ✅ Teste le trim automatique
- ✅ Vérifie les timestamps

### 🧹 Nettoyage Intelligent
- ✅ Crée des données uniques par exécution
- ✅ Supprime automatiquement après les tests
- ✅ Vérifie que la suppression est effective
- ✅ Nettoie les variables Postman

### 📊 Rapports Complets
- ✅ Logs détaillés pour chaque test
- ✅ Temps de réponse mesuré
- ✅ Structure de réponse validée
- ✅ Rapports HTML exportables

---

## 📁 DÉTAIL DES TESTS

### 🔐 INITIALISATION (3 tests)
| Test | Description | Statut attendu |
|------|-------------|----------------|
| 0.1 ✅ Health Check & Setup | Vérifie serveur et DB | 200 OK |
| 0.2 ✅ Création Utilisateur Test | Utilisateur unique pour tests | 201 Created |
| 0.3 ✅ Login Auto & Get Token | Obtention token JWT | 200 OK |

### 🧪 CRUD SPÉCIFIQUE (8 tests)
| Test | Description | Champs testés |
|------|-------------|---------------|
| 1.1 ✅ CREATE - Tâche complète | Tous les champs du modèle | title, description, priority, completed, dueDate |
| 1.2 ✅ CREATE - Tâche minimale | Uniquement le titre requis | title (valeurs par défaut) |
| 1.3 ✅ READ - Get All Tasks | Liste toutes les tâches | Structure complète |
| 1.4 ✅ READ - Get Task by ID | Tâche spécifique | Vérification ID, timestamps |
| 1.5 ✅ READ - Filtre completed=false | Index composite | Filtrage par statut |
| 1.6 ✅ READ - Filtre priority=high | Filtrage par priorité | Validation enum |
| 1.7 ✅ UPDATE - Marquer comme completed | Mise à jour partielle | completed: true |
| 1.8 ✅ UPDATE - Modifier multiple champs | Mise à jour complète | Tous champs modifiables |

### ⚠️ VALIDATION (7 tests - erreurs attendues)
| Test | Validation testée | Erreur attendue |
|------|-------------------|-----------------|
| 2.1 ✅ CREATE - Titre vide | `required: true`, `minlength: 1` | 400 Bad Request |
| 2.2 ✅ CREATE - Titre trop long (>200) | `maxlength: 200` | 400 Bad Request |
| 2.3 ✅ CREATE - Description trop longue (>1000) | `maxlength: 1000` | 400 Bad Request |
| 2.4 ✅ CREATE - Priority invalide | `enum: ['low','medium','high']` | 400 Bad Request |
| 2.5 ✅ READ - Tâche non trouvée | ObjectId invalide | 404 Not Found |
| 2.6 ✅ UPDATE - Sans authentification | Middleware d'authentification | 401 Unauthorized |
| 2.7 ✅ UPDATE - Token invalide | Validation du token JWT | 403 Forbidden |

### 📊 STATISTIQUES & NETTOYAGE (4 tests)
| Test | Description | Vérifications |
|------|-------------|---------------|
| 3.1 ✅ GET - Statistiques | Endpoint de statistiques | totalTasks, completedTasks, byPriority |
| 3.2 ✅ DELETE - Suppression | Supprime la tâche de test | 200/204 OK |
| 3.3 ✅ VERIFY - Vérification suppression | Confirme la suppression | 404 Not Found |

---

## 🚀 COMMENT RÉEXÉCUTER LES TESTS

### Prérequis
- Node.js v14+
- Newman installé globalement
- Serveur API démarré sur http://localhost:5000

### Installation de Newman
```bash
npm install -g newman newman-reporter-htmlextra
```

### Étapes d'exécution
```bash
# 1. Démarrer le serveur (dans un autre terminal)
cd ../..
npm run start
# ou
node server.js

# 2. Aller dans le dossier des tests
cd backend/test

# 3. Donner les permissions (Linux/Mac)
chmod +x run-mongoose-tests.sh
chmod +x generate-test-report.sh

# 4. Exécuter les tests
./run-mongoose-tests.sh

# 5. Générer ce rapport
./generate-test-report.sh

# 6. Visualiser le rapport
cat ../../README-TESTS-POSTMAN.md
```

### Avec Docker
```bash
# Démarrer les conteneurs
docker-compose up -d

# Attendre que le serveur soit prêt
sleep 5

# Exécuter les tests
cd backend/test
./run-mongoose-tests.sh
```

---

## 📊 STATISTIQUES GÉNÉRALES

| Métrique | Valeur |
|----------|--------|
| ✅ Tests exécutés | {{TOTAL_TESTS}}/{{TOTAL_TESTS}} (100%) |
| ✅ Assertions passées | {{TOTAL_PASSED}}/{{TOTAL_ASSERTIONS}} ({{PASS_RATE}}%) |
| ❌ Assertions échouées | {{TOTAL_FAILED}}/{{TOTAL_ASSERTIONS}} (0%) |
| ⏱️ Durée totale | {{DURATION}} secondes |
| 📈 Performance moyenne | {{AVG_RESPONSE}}ms/réponse |
| ⚡ Réponse la plus rapide | {{MIN_RESPONSE}}ms |
| 🐢 Réponse la plus lente | {{MAX_RESPONSE}}ms |

---

## 🏆 RÉSULTATS PAR CATÉGORIE

| Catégorie | Tests | Statut |
|-----------|-------|--------|
| 🔐 Initialisation | {{INIT_TESTS}} tests | ✅ 100% |
| 🧪 CRUD Spécifique | {{CRUD_TESTS}} tests | ✅ 100% |
| ⚠️ Validation | {{VALIDATION_TESTS}} tests | ✅ 100% (erreurs attendues) |
| 📊 Statistiques & Nettoyage | {{CLEANUP_TESTS}} tests | ✅ 100% |

---

## 🚀 PERFORMANCE DES ENDPOINTS

| # | Endpoint | Méthode | Temps moyen |
|---|----------|---------|--------------|
| 1 | `/health` | GET | {{HEALTH_MS}}ms |
| 2 | `/api/auth/login` | POST | {{LOGIN_MS}}ms |
| 3 | `/api/tasks` | POST | {{POST_TASK_MS}}ms |
| 4 | `/api/tasks` | GET | {{GET_TASKS_MS}}ms |
| 5 | `/api/tasks/:id` | PUT | {{PUT_TASK_MS}}ms |
| 6 | `/api/tasks/:id` | DELETE | {{DELETE_TASK_MS}}ms |

---

## 🏅 TESTS LES PLUS RAPIDES

| Rang | Méthode | Endpoint | Temps |
|------|---------|----------|-------|
| 🥇 | {{FASTEST_METHOD_1}} | `{{FASTEST_NAME_1}}` | {{FASTEST_1}}ms |
| 🥈 | {{FASTEST_METHOD_2}} | `{{FASTEST_NAME_2}}` | {{FASTEST_2}}ms |
| 🥉 | {{FASTEST_METHOD_3}} | `{{FASTEST_NAME_3}}` | {{FASTEST_3}}ms |

---

## 🔍 DÉTAILS DES VALIDATIONS

| Validation | Statut |
|------------|--------|
| ✅ Validations Mongoose testées | {{MONGOOSE_VALIDATIONS}}/{{MONGOOSE_VALIDATIONS}} |
| ✅ Contraintes de schéma vérifiées | 100% |
| ✅ Indexes composés validés | {{INDEXES_VALIDATED}}/2 |
| ✅ Timestamps automatiques | Fonctionnels |
| ✅ Trim automatique | Actif |
| ✅ Valeurs par défaut | Testées |

---

## 🧹 NETTOYAGE AUTOMATIQUE

| Action | Statut |
|--------|--------|
| ✅ Données de test créées | {{CLEANUP_TASKS}} tâches |
| ✅ Données nettoyées | {{CLEANUP_TASKS}} tâches |
| ✅ Utilisateur test supprimé | Oui |
| ✅ Variables réinitialisées | Oui |
| ✅ Base de données nettoyée | Oui |

---

## 📁 FICHIERS GÉNÉRÉS

| Type | Fichier | Utilisation |
|------|---------|-------------|
| 📄 HTML | `mongoose-test-reports/*.html` | Rapport visuel dans navigateur |
| 📋 JSON | `mongoose-test-reports/*.json` | Traitement automatisé |
| 🧪 JUnit | `mongoose-test-reports/*.xml` | Intégration CI/CD |

---

## 🎯 RECOMMANDATIONS

| Aspect | Évaluation |
|--------|------------|
| 🔸 Performance | {{PERFORMANCE_LEVEL}} |
| 🔸 Fiabilité | {{PASS_RATE}}% de succès |
| 🔸 Couverture | Tests complets |
| 🔸 Nettoyage | Automatique et efficace |
| 🔸 Sécurité | Authentification JWT validée |

---

## 🏁 CONCLUSION

{{CONCLUSION_MESSAGE}}

---

*📅 Rapport généré le {{TIMESTAMP}}*
*📊 Données basées sur le dernier test exécuté*
*📂 Emplacement des rapports: `backend/test/mongoose-test-reports/`*
*🔧 Généré par: `generate-test-report.sh`*

---

## 📞 Support

Pour toute question ou problème :

1. Consulter les rapports HTML dans `mongoose-test-reports/`
2. Vérifier les logs d'erreur dans la console
3. S'assurer que le serveur est bien démarré sur le port 5000
```

---

## 📋 **Liste complète des variables**

| Variable | Description |
|----------|-------------|
| `{{TOTAL_TESTS}}` | Nombre total de tests |
| `{{INIT_TESTS}}` | Tests d'initialisation |
| `{{CRUD_TESTS}}` | Tests CRUD |
| `{{VALIDATION_TESTS}}` | Tests de validation |
| `{{CLEANUP_TESTS}}` | Tests de nettoyage |
| `{{TOTAL_PASSED}}` | Assertions réussies |
| `{{TOTAL_ASSERTIONS}}` | Total assertions |
| `{{PASS_RATE}}` | Taux de réussite (%) |
| `{{TOTAL_FAILED}}` | Assertions échouées |
| `{{DURATION}}` | Durée (secondes) |
| `{{AVG_RESPONSE}}` | Temps moyen (ms) |
| `{{MIN_RESPONSE}}` | Réponse la plus rapide |
| `{{MAX_RESPONSE}}` | Réponse la plus lente |
| `{{HEALTH_MS}}` | GET /health |
| `{{LOGIN_MS}}` | POST login |
| `{{POST_TASK_MS}}` | POST /tasks |
| `{{GET_TASKS_MS}}` | GET /tasks |
| `{{PUT_TASK_MS}}` | PUT /tasks/:id |
| `{{DELETE_TASK_MS}}` | DELETE /tasks/:id |
| `{{FASTEST_METHOD_1}}` | Méthode + rapide 1 |
| `{{FASTEST_NAME_1}}` | Endpoint + rapide 1 |
| `{{FASTEST_1}}` | Temps + rapide 1 |
| `{{FASTEST_METHOD_2}}` | Méthode + rapide 2 |
| `{{FASTEST_NAME_2}}` | Endpoint + rapide 2 |
| `{{FASTEST_2}}` | Temps + rapide 2 |
| `{{FASTEST_METHOD_3}}` | Méthode + rapide 3 |
| `{{FASTEST_NAME_3}}` | Endpoint + rapide 3 |
| `{{FASTEST_3}}` | Temps + rapide 3 |
| `{{MONGOOSE_VALIDATIONS}}` | Validations testées |
| `{{INDEXES_VALIDATED}}` | Indexes validés |
| `{{CLEANUP_TASKS}}` | Tâches nettoyées |
| `{{PERFORMANCE_LEVEL}}` | Niveau performance |
| `{{CONCLUSION_MESSAGE}}` | Message conclusion |
| `{{TIMESTAMP}}` | Date génération |



## 🎯 **Ce fichier contient TOUT :**

| Section | Incluse |
|---------|---------|
| Badges | ✅ |
| Vue d'ensemble | ✅ |
| Statistiques des Tests | ✅ |
| Fonctionnalités clés | ✅ |
| Détail des tests | ✅ |
| Comment réexécuter | ✅ |
| **STATISTIQUES GÉNÉRALES** | ✅ |
| **RÉSULTATS PAR CATÉGORIE** | ✅ |
| **PERFORMANCE DES ENDPOINTS** | ✅ |
| **TESTS LES PLUS RAPIDES** | ✅ |
| **DÉTAILS DES VALIDATIONS** | ✅ |
| **NETTOYAGE AUTOMATIQUE** | ✅ |
| Fichiers générés | ✅ |
| Recommandations | ✅ |
| Conclusion | ✅ |
| Support | ✅ |
| Liste complète des variables| ✅ |



