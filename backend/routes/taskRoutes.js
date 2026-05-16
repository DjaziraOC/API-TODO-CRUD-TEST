// Import des dépendances nécessaires
const express = require('express');
const router = express.Router(); // Création d'un nouveau routeur Express

// Import des contrôleurs - contiennent la logique métier des tâches
const taskController = require('../controllers/taskController');

// Import du middleware d'authentification
const { authenticateToken } = require('../middleware/auth');

// ========== MIDDLEWARE GLOBAL ==========

// Applique l'authentification à TOUTES les routes de ce routeur
// Toute requête vers /api/tasks/* nécessitera un token JWT valide
router.use(authenticateToken);

// ========== ROUTES CRUD POUR LES TÂCHES ==========

// CREATE - Création d'une nouvelle tâche
// Méthode: POST
// Endpoint: /api/tasks
// Action: Crée une tâche pour l'utilisateur authentifié
router.post('/', taskController.createTask);

// READ (Multiple) - Récupération des tâches de l'utilisateur
// Méthode: GET
// Endpoint: /api/tasks
// Action: Liste toutes les tâches de l'utilisateur (avec filtres optionnels)
router.get('/', taskController.getTasks);

// STATISTIQUES - Obtenir des statistiques sur les tâches
// Méthode: GET
// Endpoint: /api/tasks/stats
// Action: Retourne des stats (nombre de tâches par statut, par priorité, etc.)
router.get('/stats', taskController.getTaskStats);

// READ (Single) - Récupération d'une tâche spécifique
// Méthode: GET
// Endpoint: /api/tasks/:id
// Action: Récupère une tâche par son ID (avec vérification de propriété)
router.get('/:id', taskController.getTask);

// UPDATE - Mise à jour d'une tâche existante
// Méthode: PUT
// Endpoint: /api/tasks/:id
// Action: Met à jour une tâche spécifique (vérifie que l'utilisateur en est propriétaire)
router.put('/:id', taskController.updateTask);

// DELETE - Suppression d'une tâche
// Méthode: DELETE
// Endpoint: /api/tasks/:id
// Action: Supprime une tâche spécifique (vérifie que l'utilisateur en est propriétaire)
router.delete('/:id', taskController.deleteTask);

// Export du routeur pour utilisation dans l'application principale
module.exports = router;