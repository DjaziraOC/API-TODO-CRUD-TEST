// Import des dépendances nécessaires
const express = require('express');
const router = express.Router(); // Création d'un routeur Express (sous-routeur)

// Import des contrôleurs - contiennent la logique métier
const authController = require('../controllers/authController');

// Import du middleware d'authentification - vérifie la validité des tokens JWT
const { authenticateToken } = require('../middleware/auth');

// ========== ROUTES PUBLIQUES (accessibles sans authentification) ==========

// Route d'inscription - création d'un nouveau compte utilisateur
// Méthode: POST
// Endpoint: /api/auth/signup
// Accès: Public
router.post('/signup', authController.signup);

// Route de connexion - authentification d'un utilisateur existant
// Méthode: POST
// Endpoint: /api/auth/login
// Accès: Public
router.post('/login', authController.login);

// Route de rafraîchissement de token - obtention d'un nouvel access token
// Méthode: POST
// Endpoint: /api/auth/refresh-token
// Accès: Public (mais nécessite un refresh token valide)
router.post('/refresh-token', authController.refreshToken);

// ========== ROUTES PROTÉGÉES (nécessitent une authentification) ==========

// Route de récupération du profil - obtention des informations utilisateur
// Méthode: GET
// Endpoint: /api/auth/profile
// Accès: Privé (authentification requise)
// Middleware: authenticateToken vérifie le JWT avant d'exécuter le contrôleur
router.get('/profile', authenticateToken, authController.getProfile);

// Route de mise à jour du profil - modification des informations utilisateur
// Méthode: PUT
// Endpoint: /api/auth/profile
// Accès: Privé (authentification requise)
// Middleware: authenticateToken vérifie le JWT avant d'exécuter le contrôleur
router.put('/profile', authenticateToken, authController.updateProfile);

// Export du routeur pour utilisation dans l'application principale
module.exports = router;