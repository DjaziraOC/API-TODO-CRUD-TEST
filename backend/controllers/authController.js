// Import des modèles et dépendances
const User = require('../models/User'); // Modèle d'utilisateur Mongoose
const jwt = require('jsonwebtoken'); // Bibliothèque pour les tokens JWT
const jwtConfig = require('../config/jwt'); // Configuration des tokens

// ========== INSCRIPTION (SIGNUP) ==========
exports.signup = async (req, res) => {
  try {
    // Extraction des données du corps de la requête
    const { username, email, password } = req.body;

    // Vérification d'unicité: recherche d'un utilisateur existant avec même email OU username
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] // Opérateur MongoDB "ou"
    });

    // Gestion du conflit d'unicité
    if (existingUser) {
      return res.status(400).json({ 
        error: 'Un utilisateur avec cet email ou nom d\'utilisateur existe déjà' 
        // Code 400: Bad Request (requête invalide)
      });
    }

    // Création d'une nouvelle instance utilisateur
    const user = new User({
      username,
      email,
      password
    });

    // Sauvegarde dans la base de données (déclenche le hook pre-save pour le hachage)
    await user.save();

    // Génération du token JWT via la méthode d'instance définie dans le modèle
    const token = user.generateAuthToken();

    // Réponse de succès avec code 201: Created
    res.status(201).json({
      message: 'Inscription réussie',
      user: { // Informations utilisateur nettoyées (sans mot de passe)
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token, // Access token pour l'authentification immédiate
      expiresIn: jwtConfig.expiresIn // Durée de validité du token
    });
  } catch (error) {
    // Gestion des erreurs génériques
    res.status(500).json({ 
      error: 'Erreur lors de l\'inscription',
      details: error.message // Détail de l'erreur (utile pour le débogage)
    });
  }
};

// ========== CONNEXION (LOGIN) ==========
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Recherche de l'utilisateur avec SELECT explicite du mot de passe
    // Le modèle User a "select: false" sur password, donc on doit l'inclure manuellement
    const user = await User.findOne({ email }).select('+password');
    
    // Vérification de l'existence de l'utilisateur
    if (!user) {
      return res.status(401).json({ 
        error: 'Email ou mot de passe incorrect' 
        // Message générique pour ne pas révéler si l'email existe
      });
    }

    // Vérification que le compte est actif (soft delete)
    if (!user.isActive) {
      return res.status(401).json({ 
        error: 'Ce compte est désactivé' 
      });
    }

    // Comparaison du mot de passe fourni avec le hash stocké
    const isPasswordValid = await user.comparePassword(password);
    
    // Gestion d'échec d'authentification
    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Email ou mot de passe incorrect' 
      });
    }

    // Génération des tokens
    const token = user.generateAuthToken(); // Access token (courte durée)
    const refreshToken = user.generateRefreshToken(); // Refresh token (longue durée)

    // Réponse de succès
    res.status(200).json({
      message: 'Connexion réussie',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token, // Access token pour les requêtes API
      refreshToken, // Refresh token pour obtenir de nouveaux access tokens
      expiresIn: jwtConfig.expiresIn // Information sur l'expiration
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Erreur lors de la connexion',
      details: error.message 
    });
  }
};

// ========== RAFRAÎCHISSEMENT DE TOKEN ==========
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body; // Refresh token dans le body

    // Validation de la présence du token
    if (!refreshToken) {
      return res.status(400).json({ 
        error: 'Refresh token requis' 
      });
    }

    // Vérification de la validité du refresh token avec sa clé secrète spécifique
    const decoded = jwt.verify(refreshToken, jwtConfig.refreshSecret);
    
    // Recherche de l'utilisateur associé au token
    const user = await User.findById(decoded.id);
    
    // Vérification que l'utilisateur existe toujours
    if (!user) {
      return res.status(404).json({ 
        error: 'Utilisateur non trouvé' 
      });
    }

    // Génération d'un nouvel access token
    const newToken = user.generateAuthToken();

    // Réponse avec le nouveau token
    res.status(200).json({
      message: 'Token rafraîchi avec succès',
      token: newToken,
      expiresIn: jwtConfig.expiresIn
    });
  } catch (error) {
    // Gestion spécifique de l'expiration du refresh token
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Refresh token expiré. Veuillez vous reconnecter.' 
        // L'utilisateur doit se ré-authentifier complètement
      });
    }
    
    // Autres erreurs (token invalide, signature incorrecte, etc.)
    res.status(403).json({ 
      error: 'Refresh token invalide' 
    });
  }
};

// ========== PROFIL UTILISATEUR ==========
exports.getProfile = async (req, res) => {
  try {
    // req.user est défini par le middleware authenticateToken
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        error: 'Utilisateur non trouvé' 
      });
    }

    // Retourne l'utilisateur (la méthode toJSON() du modèle exclut le password)
    res.status(200).json({
      user
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Erreur lors de la récupération du profil' 
    });
  }
};

// ========== MISE À JOUR DU PROFIL ==========
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    
    // Sécurité: empêche la modification du rôle via cette route
    // La modification du rôle doit être réservée aux administrateurs
    delete updates.role;
    
    // Mise à jour avec options:
    // - new: true → retourne le document mis à jour
    // - runValidators: true → applique les validations du schéma
    const user = await User.findByIdAndUpdate(
      req.user.id, // ID de l'utilisateur authentifié
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: 'Profil mis à jour avec succès',
      user // Retourne l'utilisateur mis à jour
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Erreur lors de la mise à jour du profil' 
    });
  }
};