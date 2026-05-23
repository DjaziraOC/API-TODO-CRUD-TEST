# ============================================
# ÉTAPE 1: BUILDER (pour optimisation)
# ============================================
#FROM node:18-alpine AS builder

#WORKDIR /app

# 1. Copier SEULEMENT les fichiers de dépendances
#COPY package*.json ./

# 2. Installer TOUTES les dépendances (développement incluses si besoin pour le build)
#    Si votre projet nécessite une étape de build (TypeScript, Babel, etc.)
# RUN npm ci
# 
#    Si pas de build nécessaire, cette étape peut être simplifiée ou supprimée
#RUN npm ci

# 3. Copier le code source
#COPY . .

# 4. ICI: Ajoutez vos commandes de build si nécessaire (ex: npm run build)
# RUN npm run build



# ============================================
# ÉTAPE 2: IMAGE DE PRODUCTION FINALE
# ============================================
FROM node:18-alpine

WORKDIR /app

# 1. Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# 2. Copier package.json et package-lock.json DEPUIS LE HOST
#    (pas depuis builder, car on veut les fichiers originaux)
COPY --chown=nodejs:nodejs package*.json ./

# 3. Installer UNIQUEMENT les dépendances de production
#    'npm ci' utilise package-lock.json pour des installations reproductibles
RUN npm ci --omit=dev && \
    npm cache clean --force

# 4. Copier le code applicatif DEPUIS LE BUILDER
#    (si vous avez une étape de build, copiez le dossier 'dist' ou équivalent)
#    COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
#
#    Sinon, copiez directement depuis le host (plus simple) :
COPY --chown=nodejs:nodejs . .

# 5. Changer vers l'utilisateur non-root
USER nodejs

# 6. Exposer le port (vérifiez que c'est le bon port)
EXPOSE 5000

# 7. Variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=5000

# 8. Démarrer l'application
CMD ["node", "server.js"]