# Dofus Retro API - Guide de démarrage

## ⚡ Démarrage rapide

### Prérequis
- Node.js 16+ installé

### Installation

```bash
# 1. Aller dans le dossier
cd dofus-retro-api

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur
npm start

# 4. (Optionnel) Peupler avec des données d'exemple
curl -X POST http://localhost:3000/api/seed?key=dofus-retro-2024
```

Le serveur démarre sur `http://localhost:3000`

## 🐳 Avec Docker

```bash
# Build
docker build -t dofus-retro-api .

# Run
docker run -p 3000:3000 -v $(pwd)/data:/app/data dofus-retro-api
```

## ☁️ Déploiement cloud

### Railway
1. Créer un repo GitHub avec ces fichiers
2. Connecter Railway au repo
3. Déployer automatiquement

### Render
1. New Web Service
2. Connecter le repo
3. Build Command: `npm install`
4. Start Command: `npm start`

## 📡 Test de l'API

```bash
# Vérifier que l'API fonctionne
curl http://localhost:3000/

# Lister les items
curl http://localhost:3000/api/items

# Chercher un item
curl "http://localhost:3000/api/items?search=Bouftou"

# Voir un item spécifique
curl http://localhost:3000/api/items/1

# Lister les monstres
curl http://localhost:3000/api/monsters

# Lister les panoplies
curl http://localhost:3000/api/sets
```

## 📝 Exemples de requêtes POST

### Créer un item
```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cape du Bouftou",
    "type": "Cape",
    "level": 10,
    "description": "Une cape en poil de bouftou.",
    "stats": {"vitalite": 15, "sagesse": 5}
  }'
```

### Créer un monstre
```bash
curl -X POST http://localhost:3000/api/monsters \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tofu",
    "type": "Monstre",
    "level_min": 1,
    "level_max": 5,
    "hp": 30,
    "pa": 3,
    "pm": 3,
    "stats": {"agilite": 15},
    "drops": [{"item": "Plume de Tofu", "rate": 60}]
  }'
```

## 🔧 Architecture

```
┌─────────────────────────────────────┐
│         Client (React/Vue/etc)       │
└─────────────┬───────────────────────┘
              │ HTTP/REST
┌─────────────▼───────────────────────┐
│      Dofus Retro API (Express)      │
│  ┌──────────────┐  ┌─────────────┐  │
│  │   Routes     │  │  Services   │  │
│  │  /api/items  │  │   CRUD      │  │
│  │  /api/mobs   │  │  Validation │  │
│  └──────────────┘  └──────┬──────┘  │
└───────────────────────────┼─────────┘
                            │
┌───────────────────────────▼─────────┐
│       SQLite (better-sqlite3)       │
│    ┌─────────┐ ┌─────────────────┐  │
│    │  items  │ │    monsters     │  │
│    │ weapons │ │    resources    │  │
│    │   sets  │ │   professions   │  │
│    └─────────┘ └─────────────────┘  │
└─────────────────────────────────────┘
```

## 📊 Schéma de la base de données

### Tables principales

| Table | Description |
|-------|-------------|
| `items` | Équipements (amulettes, anneaux, capes, etc.) |
| `weapons` | Armes avec caractéristiques de combat (PA, PO, dégâts) |
| `resources` | Ressources craftables/consommables |
| `monsters` | Monstres avec drops et statistiques |
| `sets` | Panoplies avec bonus de set |
| `professions` | Métiers avec recettes et zones de récolte |

## 🗺️ Roadmap

- [ ] Scraper Barbok.fr pour peupler automatiquement
- [ ] Authentification API Key
- [ ] Rate limiting
- [ ] Cache Redis
- [ ] GraphQL endpoint
- [ ] WebSocket pour temps réel

## 📚 Ressources Dofus Retro

- https://barbok.fr/ - Fan site historique
- https://www.dotrofus.com/ - Guides de quêtes
- https://solomonk.fr/ - Calculateur de stuff
- https://retro.dofusbook.net/ - Encyclopédie

---

Créé avec ❤️‍🔥 par OPENCLAW-DEV∞
