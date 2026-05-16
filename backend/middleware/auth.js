// Import des dépendances nécessaires pour la gestion des tokens JWT
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt'); // Configuration des paramètres JWT

// Middleware pour vérifier le token JWT - Protège les routes nécessitant une authentification
const authenticateToken = (req, res, next) => {
  // Récupérer le token du header Authorization (standard HTTP pour les tokens Bearer)
  const authHeader = req.headers['authorization'];
  // Extraire le token après "Bearer " (format standard: "Bearer <token>")
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  // Vérification de la présence du token
  if (!token) {
    return res.status(401).json({ 
      error: 'Accès refusé. Token manquant.' // Code 401: Non autorisé
    });
  }

  try {
    // Vérifier et décoder le token avec la clé secrète
    // jwt.verify() valide à la fois la signature et l'expiration
    const decoded = jwt.verify(token, jwtConfig.secret);
    console.log('Decoded JWT:', decoded);
    // Ajouter les informations de l'utilisateur décodées à l'objet requête
    // Permet aux middlewares/routes suivants d'accéder aux données utilisateur
    // STANDARDISATION: Toujours avoir .id disponible
    req.user = {
      id: decoded.id || decoded.userId || decoded._id, // Support multiple formats
      email: decoded.email,
      role: decoded.role,
      // ... autres propriétés
    };
    console.log('User standardisé:', req.user);
    // Continuer vers la route suivante (controller ou prochain middleware)
    next();
  } catch (error) {
    // Gestion différenciée des erreurs JWT
    if (error.name === 'TokenExpiredError') {
      // Token valide mais expiré - l'utilisateur doit se reconnecter
      return res.status(401).json({ 
        error: 'Token expiré. Veuillez vous reconnecter.' 
      });
    }
    
    // Autres erreurs (token invalide, malformé, etc.)
    return res.status(403).json({ 
      error: 'Token invalide.' // Code 403: Interdit (token présent mais invalide)
    });
  }
};

// Middleware pour vérifier les rôles - Contrôle d'accès basé sur les rôles (RBAC)
const authorizeRoles = (...allowedRoles) => {
  // Factory function qui retourne un middleware configurable
  // ...allowedRoles: permet de passer plusieurs rôles autorisés
  return (req, res, next) => {
    // Vérification préalable: l'utilisateur doit être authentifié
    if (!req.user) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    // Vérifier si le rôle de l'utilisateur est dans la liste des rôles autorisés
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Accès interdit. Rôle insuffisant.' 
      });
    }

    // L'utilisateur a le rôle requis, continuer
    next();
  };
};

// Export des middlewares pour utilisation dans les routes
module.exports = {
  authenticateToken,  // Vérifie la validité du token
  authorizeRoles      // Vérifie les permissions basées sur les rôles
};