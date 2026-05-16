const mongoose = require('mongoose');

// Définition du schéma de tâche (Todo) avec validation complète
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre est requis'], // Validation obligatoire avec message personnalisé
    trim: true, // Supprime les espaces inutiles au début et à la fin
    minlength: [1, 'Le titre doit contenir au moins 1 caractère'], // Validation longueur minimum
    maxlength: [200, 'Le titre ne peut pas dépasser 200 caractères'] // Validation longueur maximum
  },
  description: {
    type: String,
    trim: true, // Nettoie les espaces inutiles
    maxlength: [1000, 'La description ne peut pas dépasser 1000 caractères'] // Limite de taille pour la BDD
  },
  completed: {
  type: Boolean,
  default: false // Valeur par défaut: tâche non complétée
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'], // Restreint les valeurs possibles (bon pour la cohérence)
    default: 'medium' // Priorité par défaut raisonnable
  },
  dueDate: {
    type: Date // Date d'échéance optionnelle (pas de 'required')
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, // Référence à l'ID d'un utilisateur
    ref: 'User', // Nom du modèle référencé (pour les populate())
    required: true // Chaque tâche doit appartenir à un utilisateur
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
  timestamps: true // Option Mongoose: gère automatiquement createdAt et updatedAt
  // (en plus des champs manuels ci-dessus pour plus de contrôle)
});

// ========== INDEXES POUR LES PERFORMANCES ==========

// Index composite pour les requêtes utilisateur + tri par date de création décroissante
// user: 1 → index ascendant sur le champ user
// createdAt: -1 → index descendant sur le champ createdAt
// Utilisation typique: récupérer les tâches d'un utilisateur triées du plus récent au plus ancien
taskSchema.index({ user: 1, createdAt: -1 });

// Index composite pour les requêtes utilisateur + état de complétion
// user: 1 → index ascendant sur le champ user
// completed: 1 → index ascendant sur le champ completed
// Utilisation typique: filtrer les tâches d'un utilisateur par statut (complétées/incomplètes)
taskSchema.index({ user: 1, completed: 1 });

// Création du modèle Mongoose à partir du schéma
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;