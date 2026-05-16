module.exports = {
  // Clé secrète pour signer les tokens JWT d'accès (access tokens)
  // Priorité: variable d'environnement JWT_SECRET, sinon valeur par défaut
  secret: process.env.JWT_SECRET || 'default_secret_change_in_production',
  
  // Clé secrète distincte pour les tokens de rafraîchissement (refresh tokens)
  // Bonne pratique: utiliser des secrets différents pour les deux types de tokens
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret_change_in_production',
  
  // Durée de validité du token d'accès (access token)
  // Format: nombre suivi d'une unité (s=secondes, m=minutes, h=heures, d=jours)
  // Par défaut: 24 heures - équilibre entre sécurité et expérience utilisateur
  expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  
  // Durée de validité du token de rafraîchissement (refresh token)
  // Plus longue que le token d'accès pour permettre un renouvellement sans reconnexion
  // Par défaut: 7 jours - durée raisonnable pour maintenir une session
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
};