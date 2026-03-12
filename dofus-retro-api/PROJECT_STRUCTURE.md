# Structure du projet Dofus Retro API

```
dofus-retro-api/
│
├── 📁 src/
│   └── app.js                  # Application Express principale
│                               # - Routes CRUD pour tous les endpoints
│                               # - Connexion SQLite
│                               # - Seed de données
│
├── 📁 data/
│   └── seed-data.json          # Données d'exemple :
│                               #   - 8 items (Bouftou, Ours, Klime...)
│                               #   - 5 armes (Épée, Baguette, Arc...)
│                               #   - 28 ressources (Poils, Minerais, Bois...)
│                               #   - 5 monstres (Bouftou, Tofu, Arakne...)
│                               #   - 1 panoplie (Bouftou complète)
│                               #   - 12 métiers (Paysan, Mineur, Forgeron...)
│
├── 📄 Dockerfile               # Configuration Docker pour déploiement
├── 📄 railway.json             # Configuration Railway.app
├── 📄 package.json             # Dépendances et scripts npm
├── 📄 .gitignore               # Fichiers à ignorer par Git
│
├── 📄 README.md                # Documentation complète (API, endpoints, exemples)
├── 📄 GETTING_STARTED.md       # Guide de démarrage détaillé
└── 📄 PROJECT_STRUCTURE.md     # Ce fichier

## Fichiers générés au runtime
│
├── 📄 dofus-retro.db           # Base SQLite (créée au premier démarrage)
└── 📁 node_modules/            # Dépendances npm (npm install)
```

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (React/Vue/Mobile)                 │
└─────────────────────────────┬───────────────────────────────────┘
                              │ HTTP/JSON
┌─────────────────────────────▼───────────────────────────────────┐
│                    DOFUS RETRO API (Express.js)                  │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  MIDDLEWARES                                                │ │
│  │  • CORS (toutes origines)                                   │ │
│  │  • JSON Parser                                              │ │
│  └─────────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  ROUTES                                                     │ │
│  │                                                             │ │
│  │  /api/items       GET | POST | :id GET                     │ │
│  │  /api/weapons     GET | POST                               │ │
│  │  /api/resources   GET | POST | :id GET                     │ │
│  │  /api/monsters    GET | POST | :id GET                     │ │
│  │  /api/sets        GET | POST | :id GET                     │ │
│  │  /api/professions GET | POST | :id GET                     │ │
│  │  /api/seed        POST (avec clé)                          │ │
│  │                                                             │ │
│  └─────────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  DATABASE (SQLite via better-sqlite3)                       │ │
│  │                                                             │ │
│  │  • items        → Équipements                               │ │
│  │  • weapons      → Armes (PA, PO, dégâts...)                 │ │
│  │  • resources    → Ressources craft                          │ │
│  │  • monsters     → Monstres avec drops                       │ │
│  │  • sets         → Panoplies avec bonus                      │ │
│  │  • professions  → Métiers (récolte/fabrique)                │ │
│  │                                                             │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Flux de données

### 1. Requête GET /api/items
```
Client → Route /items → SQL Query → SQLite → JSON Response
```

### 2. Requête POST /api/items
```
Client → JSON Body → Validation → SQL Insert → ID retourné
```

### 3. Requête GET /api/sets/:id (avec relations)
```
Client → Route /sets/:id → Query set → Query items associés → Merge JSON Response
```

## Schémas de données

### Table : items
```sql
id (PK, INTEGER)
ankama_id (INTEGER, UNIQUE)
name (TEXT, NOT NULL)
type (TEXT, NOT NULL)        -- Amulette, Anneau, Bottes, Cape, etc.
level (INTEGER)
description (TEXT)
image_url (TEXT)
stats (TEXT/JSON)            -- { force: 10, vitalite: 20, ... }
conditions (TEXT/JSON)       -- { force: "> 50" }
set_id (INTEGER, FK)
created_at (DATETIME)
```

### Table : weapons
```sql
id (PK, INTEGER)
item_id (INTEGER, FK → items)
pa (INTEGER)                 -- Points d'action
po (INTEGER)                 -- Portée
cc (TEXT)                    -- Coups Critiques (ex: "1/50")
ec (TEXT)                    -- Échecs Critiques
damage_type (TEXT)           -- Neutre, Terre, Feu, Eau, Air
damage (TEXT/JSON)           -- { min: 10, max: 20 }
```

### Table : monsters
```sql
id (PK, INTEGER)
ankama_id (INTEGER, UNIQUE)
name (TEXT, NOT NULL)
type (TEXT)
level_min (INTEGER)
level_max (INTEGER)
hp (INTEGER)
pa (INTEGER)
pm (INTEGER)
resistances (TEXT/JSON)      -- { neutre: 0, feu: -10, ... }
stats (TEXT/JSON)            -- { force: 10, agilite: 5 }
drops (TEXT/JSON)            -- [{ item: "Poil", rate: 50 }]
image_url (TEXT)
```

## Endpoints détaillés

### Pagination
Tous les endpoints liste supportent :
- `?limit=50` (défaut: 50)
- `?offset=0` (défaut: 0)

### Filtres

**Items:**
- `?type=Amulette`
- `?level_min=10&level_max=50`
- `?search=bouftou`

**Monsters:**
- `?type=Monstre`
- `?level_min=1&level_max=20`
- `?search=tofu`

**Resources:**
- `?type=Poil`
- `?level_min=1`
- `?search=cuir`

## Scripts npm

```bash
npm start      # Lancer le serveur
npm run seed   # Peupler la base (requête POST /api/seed)
```

## Déploiement

### Local
```bash
npm install
npm start
```

### Docker
```bash
docker build -t dofus-retro-api .
docker run -p 3000:3000 dofus-retro-api
```

### Railway
Pousser sur GitHub → Connecter à Railway → Déploiement auto

## Données seed incluses

### Items (8)
- Panoplie du Bouftou complète (6 pièces)
- Amulette de l'Ours
- Bottes de Klime

### Weapons (5)
- Épée de Bois, Baguette de Bois, Arc de Bois
- Marteau de Bois
- Dagues de Fourbur

### Resources (28)
- **Bouftou**: Poil, Cuir, Sang, Corne
- **Tofu**: Plume, Bec, Oeil
- **Arakne**: Patte, Toile
- **Minerais**: Fer, Cuivre, Bronze, Kobalte
- **Céréales**: Blé, Orge, Avoine, Houblon
- **Fleurs**: Lin, Chanvre, Trèfle, Menthe, Edelweiss
- **Bois**: Frêne, Châtaignier, Noyer, Kaliptus

### Monsters (5)
- Bouftou (niv 1-10)
- Boufton Blanc (niv 5-15)
- Boufton Noir (niv 10-20)
- Tofu (niv 1-5)
- Arakne (niv 1-10)

### Sets (1)
- Panoplie du Bouftou (bonus 2 à 6 items)

### Professions (12)
- Récolte: Paysan, Mineur, Bûcheron, Alchimiste, Pêcheur, Chasseur
- Fabrication: Forgeron, Sculpteur, Cordonnier, Tailleur, Bijoutier, Boulanger

---

Créé par OPENCLAW-DEV∞
