const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Bibliothèque pour le hachage sécurisé des mots de passe

// Définition du schéma utilisateur avec validation complète
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Le nom d\'utilisateur est requis'], // Validation avec message personnalisé
    unique: true, // Contrainte d'unicité dans la base de données
    trim: true, // Supprime les espaces inutiles
    minlength: [3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères'], // Validation longueur min
    maxlength: [30, 'Le nom d\'utilisateur ne peut pas dépasser 30 caractères'] // Validation longueur max
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true, // Adresse email unique
    lowercase: true, // Convertit automatiquement en minuscules
    trim: true, // Nettoie les espaces
    match: [/^\S+@\S+\.\S+$/, 'Veuillez fournir un email valide'] // Validation regex pour format email
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'], // Sécurité minimale
    select: false // IMPORTANT: N'inclut pas le champ par défaut dans les requêtes
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // Restreint les valeurs possibles (RBAC simple)
    default: 'user' // Valeur par défaut pour les nouveaux utilisateurs
  },
  isActive: {
    type: Boolean,
    default: true // Permet de désactiver un compte sans le supprimer
  },
  createdAt: {
    type: Date,
    default: Date.now // Horodatage automatique de création
  },
  updatedAt: {
    type: Date,
    default: Date.now // Horodatage automatique de modification
  }
}, {
  timestamps: true // Option Mongoose pour gérer automatiquement createdAt et updatedAt
});

// ========== MIDDLEWARE (HOOKS) ==========

// Hook pre-save: exécuté avant chaque sauvegarde dans la base
userSchema.pre('save', async function(next) {
  // Optimisation: ne re-hasher que si le mot de passe a été modifié
  if (!this.isModified('password')) return next();

  try {
    // Génération d'un salt (donnée aléatoire) pour renforcer le hachage
    // Utilise la configuration environnement ou 10 tours par défaut
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10);
    
    // Hachage du mot de passe avec le salt (algorithme bcrypt sécurisé)
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error); // Propagation des erreurs de hachage
  }
});

// ========== MÉTHODES D'INSTANCE ==========

// Méthode pour comparer un mot de passe en clair avec le hash stocké
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Méthode pour générer un token JWT d'authentification (access token)
userSchema.methods.generateAuthToken = function() {
  const jwt = require('jsonwebtoken');
  const jwtConfig = require('../config/jwt');
  
  // Création du token avec les claims standards
  return jwt.sign(
    { 
      id: this._id, // Identifiant unique utilisateur
      username: this.username,
      email: this.email,
      role: this.role // Important pour l'autorisation
    },
    jwtConfig.secret, // Clé secrète pour la signature
    { expiresIn: jwtConfig.expiresIn } // Durée de validité
  );
};

// Méthode pour générer un refresh token (plus longue durée)
userSchema.methods.generateRefreshToken = function() {
  const jwt = require('jsonwebtoken');
  const jwtConfig = require('../config/jwt');
  
  // Refresh token plus simple, contient seulement l'ID
  return jwt.sign(
    { id: this._id }, // Payload minimal
    jwtConfig.refreshSecret, // Clé secrète différente (bonne pratique)
    { expiresIn: jwtConfig.refreshExpiresIn } // Durée plus longue
  );
};

// ========== SÉRIALISATION ==========

// Override de la méthode toJSON pour contrôler ce qui est renvoyé dans les réponses
userSchema.methods.toJSON = function() {
  const obj = this.toObject(); // Convertit en objet JavaScript simple
  delete obj.password; // Supprime le hash du mot de passe (sécurité)
  delete obj.__v; // Supprime la version interne de Mongoose
  return obj;
};

// Création du modèle à partir du schéma
const User = mongoose.model('User', userSchema);

module.exports = User;