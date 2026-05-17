#!/bin/bash
# ============================================
# SCRIPT D'EXÉCUTION DES TESTS POSTMAN/NEWMAN
# ============================================
# Ce script automatise l'exécution des tests Postman/Newman 
# pour l'API Todo avec Mongoose
# ============================================

echo "🧪 TESTS COMPLETS - MODÈLE MONGOOSE TASK"
echo "========================================"

# ============================================
# 1. CONFIGURATION DES CHEMINS
# ============================================
# Récupère le dossier où se trouve ce script (peu importe d'où on l'exécute)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Chemin vers la collection Postman (contient toutes les requêtes API)
COLLECTION="${SCRIPT_DIR}/Todo-API-Mongoose-Tests.postman_collection.json"

# Chemin vers l'environnement Postman (variables : URL, token, etc.)
ENVIRONMENT="${SCRIPT_DIR}/Todo-Mongoose-Env.postman_environment.json"

# Dossier où seront stockés les rapports générés
REPORT_DIR="${SCRIPT_DIR}/mongoose-test-reports"

# Horodatage unique pour nommer chaque rapport (ex: 20260515_143022)
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")


# ============================================
# 2. GESTION DES ANCIENS RAPPORTS (3 OPTIONS)
# ============================================
# ⚠️ IMPORTANT : Une seule option est active pour ce projet!
# ============================================

# --------------------------------------------
# OPTION A : Supprimer TOUS les anciens rapports
# --------------------------------------------
# Utile pour : Économiser de l'espace disque
# Inconvénient : Perte de l'historique
# --------------------------------------------
# echo "🧹 Suppression de tous les anciens rapports..."
# rm -rf "$REPORT_DIR"      # Supprime le dossier et son contenu
# mkdir -p "$REPORT_DIR"    # Recrée le dossier vide

# --------------------------------------------
# OPTION B : Garder seulement les 5 DERNIERS rapports (ACTIVE PAR DÉFAUT)
# --------------------------------------------
# Utile pour : Équilibre entre historique et espace disque
# Avantage : Garde un historique des dernières exécutions
# --------------------------------------------
if [ -d "$REPORT_DIR" ]; then
    echo "🧹 Nettoyage : garde les 5 derniers rapports..."
    
    # Garde uniquement les 5 fichiers HTML les plus récents
    #ls -t : trie par date (le plus récent en premier)
    # tail -n +6 : ignore les 5 premiers (garde le reste)
    # xargs rm : supprime les fichiers
    ls -t "$REPORT_DIR"/mongoose_report_*.html 2>/dev/null | tail -n +6 | xargs -r rm
    
    # Même chose pour les fichiers JSON
    ls -t "$REPORT_DIR"/mongoose_report_*.json 2>/dev/null | tail -n +6 | xargs -r rm
    
    # Même chose pour les fichiers XML (JUnit)
    ls -t "$REPORT_DIR"/mongoose_report_*.xml 2>/dev/null | tail -n +6 | xargs -r rm
    
    echo "✅ Anciens rapports nettoyés (gardé les 5 plus récents)"
fi

# --------------------------------------------
# OPTION C : Garder TOUS les rapports (aucun nettoyage)
# --------------------------------------------
# Utile pour : Audit complet, historique infini
# Inconvénient : Peut prendre beaucoup d'espace avec le temps
# --------------------------------------------
# echo "📊 Conservation de tous les rapports pour historique"

# Crée le dossier des rapports s'il n'existe pas (nécessaire pour l'option B et C)
  mkdir -p "$REPORT_DIR"

# ============================================
# 3. VÉRIFICATION DES PRÉREQUIS
# ============================================

# Vérifie si Newman est installé (outil CLI de Postman)
if ! command -v newman &> /dev/null; then
    echo "📦 Newman non trouvé - Installation en cours..."
    npm install -g newman newman-reporter-htmlextra
    echo "✅ Newman installé avec succès"
fi

# Vérifie si le serveur API est accessible
echo "🔍 Vérification du serveur sur http://localhost:5000..."
if ! curl -s http://localhost:5000/health > /dev/null; then
    echo "❌ Serveur non disponible sur http://localhost:5000"
    echo "   Lancez d'abord: node server.js"
    echo "   OU : docker-compose up -d"
    exit 1  # Arrête le script avec une erreur
fi
echo "✅ Serveur prêt à recevoir les tests"

# ============================================
# 4. EXÉCUTION DES TESTS AVEC NEWMAN
# ============================================
echo "🧪 Lancement des tests Mongoose..."
echo "   Collection: $COLLECTION"
echo "   Environnement: $ENVIRONMENT"
echo ""

# Commande principale d'exécution des test
# 📁 FICHIERS :
#   --environment "$ENVIRONMENT"           : Fichier d'environnement (URL, token, etc.)
#
# 📊 RAPPORTS GÉNÉRÉS (--reporters) :
#   - cli      : 📄 Affichage en temps réel dans la console
#   - json     : 📋 Export JSON pour traitement automatisé (scripts, analyse)
#   - htmlextra: 🌐 Rapport HTML détaillé et visuel (navigation, graphiques)
#   - junit    : 🧪 Export XML pour CI/CD (Jenkins, GitLab CI, GitHub Actions)
#
# 📄 EXPORT DES RAPPORTS :
#   --reporter-json-export      : Chemin du fichier JSON généré
#   --reporter-htmlextra-export : Chemin du fichier HTML généré
#   --reporter-junit-export     : Chemin du fichier JUnit XML généré
#
# 🎨 OPTIONS HTML (htmlextra) :
#   --reporter-htmlextra-title  : Titre personnalisé du rapport HTML
#   --reporter-htmlextra-logs   : Inclut les logs détaillés dans le HTML (true/false)
#
# ⚙️ PARAMÈTRES D'EXÉCUTION :
#   --delay-request 300          : ⏳ Délai de 300ms entre chaque requête
#   --timeout 60000              : ⏱️ Timeout de 60 secondes par requête
#   --bail                       : 🛑 Arrêt à la première erreur (fail fast)
# ============================================

newman run "$COLLECTION" \
  --environment "$ENVIRONMENT" \
  --reporters cli,json,htmlextra,junit \
  --reporter-json-export "$REPORT_DIR/mongoose_report_$TIMESTAMP.json" \
  --reporter-htmlextra-export "$REPORT_DIR/mongoose_report_$TIMESTAMP.html" \
  --reporter-junit-export "$REPORT_DIR/mongoose_report_$TIMESTAMP.xml" \
  --reporter-htmlextra-title "Todo API - Tests Mongoose" \
  --reporter-htmlextra-logs true \
  --delay-request 300 \
  --timeout-request 60000 \
  --timeout-script 60000 \
  --bail

EXIT_CODE=$?

echo ""
echo "📁 Emplacement des rapports : $REPORT_DIR"
echo "   Ouvrez ce dossier dans VS Code pour voir les fichiers"


# DEBUG - Vérifier si les fichiers ont été créés
echo ""
echo "🔍 DEBUG: Contenu de $REPORT_DIR après exécution:"
ls -la "$REPORT_DIR/" 2>/dev/null || echo "   Dossier vide ou inexistant !"


# ============================================
# 5. AFFICHAGE DES RÉSULTATS
# ============================================

# Affiche le nombre total de rapports conservés dans l'historique
NB_RAPPORTS=$(ls -1 "$REPORT_DIR"/mongoose_report_*.html 2>/dev/null | wc -l)
echo "📁 Nombre total de rapports dans l'historique : $NB_RAPPORTS"

echo ""
echo "📊 RAPPORTS GÉNÉRÉS:"
echo "   📄 HTML: file://$REPORT_DIR/mongoose_report_$TIMESTAMP.html"
echo "   📋 JSON: file://$REPORT_DIR/mongoose_report_$TIMESTAMP.json"
echo "   🧪 JUnit: file://$REPORT_DIR/mongoose_report_$TIMESTAMP.xml"


# Affiche le verdict final
if [ $EXIT_CODE -eq 0 ]; then
    echo "🎉 TOUS LES TESTS MONGOOSE RÉUSSIS !"
    echo "   ✅ Validation des champs (type, requis, longueur...)"
    echo "   ✅ Tests CRUD complets (Create, Read, Update, Delete)"
    echo "   ✅ Gestion automatique du token JWT"
    echo "   ✅ Nettoyage automatique des données de test"
else
    echo "⚠️  CERTAINS TESTS ONT ÉCHOUÉ"
    echo "   Consultez le rapport HTML pour plus de détails"
    echo "   Vérifiez les logs d'erreur ci-dessus"
fi

# Transmet le code de sortie pour la CI/CD (GitHub Actions, Jenkins...)
exit $EXIT_CODE