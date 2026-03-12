# ❤️‍🔥 Dofus Retro API

API REST complète pour Dofus Retro (version 1.29). Données sur les items, armes, ressources, monstres et panoplies.

## 🚀 Démarrage rapide

```bash
# Installation des dépendances
npm install

# Compilation TypeScript
npm run build

# Démarrage en production
npm start

# Ou démarrage en développement (avec rechargement auto)
npm run dev
```

Le serveur démarre sur `http://localhost:3000`

## 📚 Documentation

Une fois le serveur lancé, accède à la documentation complète :
- **Documentation** : http://localhost:3000/docs
- **API Base** : http://localhost:3000/api
- **Health Check** : http://localhost:3000/health

## 📡 Endpoints

### Items (Équipements)
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/items` | Liste tous les équipements |
| GET | `/api/items/:id` | Détail d'un item |

**Paramètres de filtre :**
- `type` : amulette, anneau, bottes, cape, ceinture, chapeau, dofus
- `level_min` / `level_max` : filtrer par niveau
- `search` : recherche par nom
- `limit` / `offset` : pagination

### Armes
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/weapons` | Liste toutes les armes |
| GET | `/api/weapons/:id` | Détail d'une arme |

**Types d'armes :** épée, hache, marteau, baguette, arc, dague, bâton, pelle

### Ressources
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/resources` | Liste toutes les ressources |
| GET | `/api/resources/:id` | Détail d'une ressource |

### Monstres
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/monsters` | Liste tous les monstres |
| GET | `/api/monsters/:id` | Détail d'un monstre |

**Paramètres :**
- `race` : créature, oiseau, insecte, mort-vivant, humanoïde
- `is_boss` : true/false
- `level_min` / `level_max`

### Panoplies
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/sets` | Liste toutes les panoplies |
| GET | `/api/sets/:id` | Détail d'une panoplie |

## 💡 Exemples d'utilisation

```bash
# Tous les items
curl http://localhost:3000/api/items

# Items de type "anneau" entre niveau 10 et 30
curl "http://localhost:3000/api/items?type=anneau&level_min=10&level_max=30"

# Rechercher "bouftou"
curl "http://localhost:3000/api/items?search=bouftou"

# Toutes les épées
curl "http://localhost:3000/api/weapons?type=épée"

# Détail du Dofus Pourpre
curl http://localhost:3000/api/items/1

# Monstres de type "créature"
curl "http://localhost:3000/api/monsters?race=créature"
```

## 📊 Données initiales

L'API est pré-remplie avec :
- **15+ items** (amulettes, anneaux, capes, Dofus...)
- **11 armes** (épées, haches, baguettes, arcs...)
- **15 ressources** (laine, cuir, plumes, minerais...)
- **8 monstres** (bouftous, tofu, sanglier, chafer...)
- **2 panoplies** (Bouftou, Chef de Guerre)

Les données sont stockées dans une base SQLite (`database.sqlite`).

## 🏗️ Architecture

```
src/
├── index.ts           # Point d'entrée
├── database.ts        # Connexion SQLite
├── models/
│   └── types.ts       # Interfaces TypeScript
├── routes/
│   ├── items.ts       # Routes items
│   ├── weapons.ts     # Routes armes
│   ├── resources.ts   # Routes ressources
│   ├── monsters.ts    # Routes monstres
│   └── sets.ts        # Routes panoplies
└── data/
    └── seed.ts        # Données initiales

public/
└── index.html         # Documentation web
```

## 🔧 Stack technique

- **Runtime** : Node.js
- **Framework** : Express.js
- **Langage** : TypeScript
- **Base de données** : SQLite3
- **Middleware** : CORS, Helmet, Morgan

## 📝 Roadmap

- [ ] Endpoint `/api/search` (recherche globale)
- [ ] Endpoint `/api/recipes` (crafts)
- [ ] Authentification API Key
- [ ] Rate limiting
- [ ] Cache Redis
- [ ] Pagination avancée (cursor-based)
- [ ] Export JSON/CSV
- [ ] Docker support

## ⚠️ Disclaimer

Cette API est un projet **non officiel** créé par la communauté.  
Dofus est une marque déposée d'[Ankama](https://www.ankama.com).  
Les images et noms appartiennent à Ankama Studio.

---

🔨 Construit avec ❤️‍🔥 par **OPENCLAW-DEV∞**
