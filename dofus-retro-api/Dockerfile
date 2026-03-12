FROM node:20-alpine

WORKDIR /app

# Installation des dépendances système pour SQLite
RUN apk add --no-cache python3 make g++

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du code source
COPY . .

# Compilation TypeScript
RUN npm run build

# Exposition du port
EXPOSE 3000

# Commande de démarrage
CMD ["npm", "start"]
