// Importation du modèle Task pour interagir avec la collection "tasks" dans MongoDB
const Task = require('../models/Task');

// ==============================================
// CRÉER UNE TÂCHE
// ==============================================
// Cette fonction gère la création d'une nouvelle tâche
exports.createTask = async (req, res) => {
  try {
    // Création d'une nouvelle instance du modèle Task
    // On utilise l'opérateur spread (...) pour copier toutes les propriétés de req.body
    // On ajoute manuellement l'ID de l'utilisateur authentifié (req.user.id) pour lier la tâche à l'utilisateur
    const task = new Task({
      ...req.body,            // Titre, description, priorité, etc. depuis le corps de la requête
      user: req.user.id       // ID de l'utilisateur obtenu via le middleware d'authentification
    });

    // Sauvegarde asynchrone de la tâche dans la base de données MongoDB
    await task.save();

    // Réponse en cas de succès :
    // - Code HTTP 201 (Created) pour indiquer la création réussie
    // - Message de confirmation
    // - L'objet tâche créé (avec son _id généré automatiquement par MongoDB)
    res.status(201).json({
      message: 'Tâche créée avec succès',
      task
    });
  } catch (error) {
    // Gestion d'erreur :
    // - Code HTTP 400 (Bad Request) si les données sont invalides
    // - Message d'erreur général
    // - Détails de l'erreur (utile pour le débogage en développement)
    res.status(400).json({ 
      error: 'Erreur lors de la création de la tâche',
      details: error.message 
    });
  }
};

// ==============================================
// RÉCUPÉRER TOUTES LES TÂCHES DE L'UTILISATEUR
// ==============================================
// Cette fonction retourne la liste des tâches de l'utilisateur connecté avec des options de filtrage
exports.getTasks = async (req, res) => {
  try {
    // Extraction des paramètres de requête (query string) pour le filtrage et tri
    const { completed, priority, sortBy = 'createdAt', order = 'desc' } = req.query;
    // Exemple d'URL : /api/tasks?completed=true&priority=high&sortBy=dueDate&order=asc
    
    // Construction de l'objet de requête MongoDB
    // Toujours filtrer par l'utilisateur pour garantir la confidentialité des données
    const query = { user: req.user.id };
    
    // Application des filtres optionnels :
    
    // Filtre par statut "completed" (terminée ou non)
    // req.query.completed est une chaîne "true" ou "false", on la convertit en booléen
    if (completed !== undefined) {
      query.completed = completed === 'true';
    }
    
    // Filtre par priorité (low, medium, high)
    if (priority) {
      query.priority = priority;
    }

    // Configuration des options de tri
    // sortBy : champ par lequel trier (par défaut : 'createdAt')
    // order : ordre de tri ('desc' décroissant par défaut, 'asc' croissant)
    const sortOptions = {};
    sortOptions[sortBy] = order === 'desc' ? -1 : 1; // -1 = décroissant, 1 = croissant

    // Exécution de la requête MongoDB avec :
    // 1. Task.find(query) : recherche avec les filtres
    // 2. .sort(sortOptions) : tri des résultats
    // 3. .populate('user', 'username email') : jointure avec la collection User
    //    Récupère seulement 'username' et 'email' de l'utilisateur lié
    const tasks = await Task.find(query)
      .sort(sortOptions)
      .populate('user', 'username email');

    // Réponse réussie avec :
    // - Code HTTP 200 (OK)
    // - Nombre de tâches trouvées
    // - Tableau des tâches
    res.status(200).json({
      count: tasks.length,  // Nombre total de tâches correspondant aux filtres
      tasks                // Liste des tâches
    });
  } catch (error) {
    // Gestion d'erreur interne du serveur
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des tâches',
      details: error.message 
    });
  }
};

// ==============================================
// RÉCUPÉRER UNE TÂCHE SPÉCIFIQUE
// ==============================================
// Cette fonction retourne une tâche précise par son ID, vérifiant qu'elle appartient bien à l'utilisateur
exports.getTask = async (req, res) => {
  try {
    // Recherche d'une tâche spécifique avec deux conditions :
    // 1. _id : l'ID de la tâche passé en paramètre d'URL (req.params.id)
    // 2. user : l'ID de l'utilisateur connecté (sécurité pour éviter l'accès aux tâches d'autres utilisateurs)
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('user', 'username email'); // Jointure avec les infos utilisateur

    // Si aucune tâche n'est trouvée, c'est soit :
    // - La tâche n'existe pas
    // - La tâche existe mais appartient à un autre utilisateur
    if (!task) {
      return res.status(404).json({ 
        error: 'Tâche non trouvée' 
      });
    }

    // Réponse réussie avec la tâche trouvée
    res.status(200).json({
      task
    });
  } catch (error) {
    // Erreur serveur (possiblement format d'ID invalide pour MongoDB)
    res.status(500).json({ 
      error: 'Erreur lors de la récupération de la tâche',
      details: error.message 
    });
  }
};

// ==============================================
// METTRE À JOUR UNE TÂCHE
// ==============================================
// Cette fonction met à jour une tâche existante
exports.updateTask = async (req, res) => {
  try {
    // Recherche ET mise à jour en une seule opération avec findOneAndUpdate
    const task = await Task.findOneAndUpdate(
      { 
        _id: req.params.id,    // ID de la tâche à mettre à jour
        user: req.user.id      // Vérification de propriété
      },
      req.body,                // Nouvelles valeurs pour la tâche
      { 
        new: true,            // Retourne le document mis à jour (pas l'ancien)
        runValidators: true   // Exécute les validateurs du schéma Mongoose
      }
    ).populate('user', 'username email'); // Jointure après mise à jour

    // Vérification si la tâche existe et appartient à l'utilisateur
    if (!task) {
      return res.status(404).json({ 
        error: 'Tâche non trouvée' 
      });
    }

    // Réponse réussie avec la tâche mise à jour
    res.status(200).json({
      message: 'Tâche mise à jour avec succès',
      task
    });
  } catch (error) {
    // Erreur 400 généralement due à des données de validation incorrectes
    res.status(400).json({ 
      error: 'Erreur lors de la mise à jour de la tâche',
      details: error.message 
    });
  }
};

// ==============================================
// SUPPRIMER UNE TÂCHE
// ==============================================
// Cette fonction supprime une tâche spécifique
exports.deleteTask = async (req, res) => {
  try {
    // Recherche ET suppression en une seule opération
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    // Vérification que la tâche existait et a été supprimée
    if (!task) {
      return res.status(404).json({ 
        error: 'Tâche non trouvée' 
      });
    }

    // Réponse réussie avec confirmation
    res.status(200).json({
      message: 'Tâche supprimée avec succès',
      task  // Retourne la tâche supprimée (peut être utile pour l'UI)
    });
  } catch (error) {
    // Erreur serveur lors de la suppression
    res.status(500).json({ 
      error: 'Erreur lors de la suppression de la tâche',
      details: error.message 
    });
  }
};

// ==============================================
// STATISTIQUES DES TÂCHES
// ==============================================
// Cette fonction calcule des statistiques sur les tâches de l'utilisateur
exports.getTaskStats = async (req, res) => {
  try {
    // Pipeline d'agrégation MongoDB pour calculer des statistiques
    const stats = await Task.aggregate([
      {
        // Étape 1 : Filtrer uniquement les tâches de l'utilisateur courant
        $match: { 
          user: req.user.id.toString()  // Conversion en string car _id est ObjectId
        }
      },
      {
        // Étape 2 : Regrouper par statut "completed" (true/false)
        $group: {
          _id: '$completed',  // Clé de regroupement
          count: { $sum: 1 }  // Compte le nombre de documents dans chaque groupe
        }
      }
    ]);
    // Résultat possible : [{_id: true, count: 5}, {_id: false, count: 3}]

    // Récupération du nombre total de tâches de l'utilisateur
    const total = await Task.countDocuments({ user: req.user.id });
    
    // Extraction des comptes depuis les résultats d'agrégation
    // Utilisation de l'opérateur optionnel chaining (?.) et de la valeur par défaut (|| 0)
    const completed = stats.find(stat => stat._id === true)?.count || 0;
    const pending = stats.find(stat => stat._id === false)?.count || 0;

    // Réponse avec les statistiques calculées
    res.status(200).json({
      stats: {
        total,                      // Nombre total de tâches
        completed,                  // Tâches terminées
        pending,                    // Tâches en attente
        completionRate: total > 0 ? (completed / total * 100).toFixed(2) : 0
        // Taux de complétion en pourcentage, arrondi à 2 décimales
        // Évite la division par zéro si total = 0
      }
    });
  } catch (error) {
    // Erreur serveur dans le calcul des statistiques
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des statistiques',
      details: error.message 
    });
  }
};