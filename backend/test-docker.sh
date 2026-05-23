#!/bin/bash
set -e

echo "🧪 Début des tests Docker..."
cd ~/API-TODO-CRUD-TEST/backend

echo "1. Test de construction..."
docker build -t todo-test .

echo "2. Test de sécurité..."
docker run --rm todo-test sh -c '
    echo " - Vérification absence de .env..."
    ! find /app -name ".env*" | grep . && echo "   ✓ OK"
    echo " - Vérification présence de server.js..."
    test -f /app/server.js && echo "   ✓ OK"
    echo " - Vérification package.json..."
    test -f /app/package.json && echo "   ✓ OK"
'

echo "3. Nettoyage..."
docker rmi todo-test

echo "✅ Tous les tests sont passés !"