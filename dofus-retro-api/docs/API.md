# 🎮 API Dofus Retro - Documentation

## 📋 Vue d'ensemble

API complète et enrichie pour Dofus Retro, couvrant tous les aspects du jeu.

- **Version** : 2.0
- **Dernière mise à jour** : 14 mars 2026
- **Total d'éléments** : 1002+
- **Statut** : ✅ Production Ready

---

## 📊 Contenu de l'API

| Catégorie | Quantité | Fichier source | Description |
|-----------|----------|----------------|-------------|
| **Items** | 169 | `items-enriched.json` | Équipements, consommables |
| **Armes** | 138 | `weapons-enriched.json` | Armes de mêlée et distance |
| **Ressources** | 155 | `resources-enriched.json` | Matériaux de craft |
| **Monstres** | 84 | `monsters-enriched.json` | Créatures avec butins |
| **Panoplies** | 35 | `sets-enriched.json` | Sets d'équipement complets |
| **Classes** | 12 | `classes-enriched.json` | Classes jouables avec sorts |
| **Sorts** | 312 | `spells-enriched.json` | Tous les sorts du jeu |
| **Donjons** | 45 | `dungeons-enriched.json` | Donjons avec stratégies |
| **Quêtes** | 52 | `quests-enriched.json` | Quêtes avec récompenses |
| **Professions** | 12 | Inclus dans `seed-data.json` | Métiers de récolte/craft |

**Total : 1002+ éléments documentés**

---

## 🗂️ Structure des fichiers

```
dofus-retro-api/
├── data/
│   ├── seed-data-final.json          # ⭐ FICHIER PRINCIPAL (fusionné)
│   ├── items-enriched.json           # Items détaillés
│   ├── weapons-enriched.json         # Armes
│   ├── resources-enriched.json       # Ressources
│   ├── monsters-enriched.json        # Monstres
│   ├── sets-enriched.json            # Panoplies
│   ├── classes-enriched.json         # Classes
│   ├── spells-enriched.json          # Sorts
│   ├── dungeons-enriched.json        # Donjons
│   ├── quests-enriched.json          # Quêtes
│   └── seed-data.json                # Données originales
├── src/
│   └── (code source si applicable)
├── docs/
│   └── API.md                        # Documentation API
└── README.md
```

---

## 🔌 Utilisation

### Fichier principal (recommandé)
```javascript
// Charger toutes les données
const data = require('./data/seed-data-final.json');

console.log(data.metadata.total_elements); // 1002
console.log(data.items.length);            // 169
console.log(data.spells.length);           // 312
```

### Fichiers individuels
```javascript
// Charger uniquement les sorts
const spells = require('./data/spells-enriched.json');

// Charger uniquement les donjons
const dungeons = require('./data/dungeons-enriched.json');
```

---

## 📖 Exemples de données

### Item
```json
{
  "name": "Amulette du Bouftou",
  "type": "Amulette",
  "level": 20,
  "stats": {
    "vitalite": 21,
    "sagesse": 7
  },
  "conditions": {},
  "panoplie": "Panoplie du Bouftou"
}
```

### Sort
```json
{
  "name": "Mot Interdit",
  "class": "Eniripsa",
  "level": 1,
  "pa": 4,
  "po": 8,
  "po_modifiable": true,
  "line_of_sight": true,
  "area": "mono",
  "damage_type": "Feu",
  "damage": {"min": 5, "max": 15},
  "effects": "Dommages Feu"
}
```

### Donjon
```json
{
  "name": "Donjon des Bouftous",
  "level": 20,
  "location": "Amakna (5,-6)",
  "key": "Clef du Donjon des Bouftous",
  "rooms": 4,
  "boss": "Bouftou Royal",
  "monsters": ["Bouftou", "Boufton Blanc", "Boufton Noir"],
  "rewards": {
    "items": ["Amulette du Bouftou", "Coiffe du Bouftou"],
    "xp": 5000
  },
  "strategy": "Tuer les Bouftons avant le Royal",
  "difficulty": "easy"
}
```

---

## 🚀 Intégration

### API REST (exemple Express)
```javascript
const express = require('express');
const data = require('./data/seed-data-final.json');

const app = express();

// GET /api/items
app.get('/api/items', (req, res) => {
  res.json(data.items);
});

// GET /api/spells/:class
app.get('/api/spells/:class', (req, res) => {
  const spells = data.spells.filter(s => 
    s.class.toLowerCase() === req.params.class.toLowerCase()
  );
  res.json(spells);
});

// GET /api/dungeons
app.get('/api/dungeons', (req, res) => {
  res.json(data.dungeons);
});
```

---

## 🔄 Maintenance automatisée

Le projet utilise un système multi-agents avec crons :

| Job | Fréquence | Description |
|-----|-----------|-------------|
| Enrichissement quotidien | 6h | Analyse des gaps |
| Fusion hebdomadaire | Dim/Mer 2h | Fusion complète |
| Backup GitHub | 1h | Auto-push |
| Rapport de progression | 20min | Suivi temps réel |

---

## 📚 Références

- [DofusBook Retro](https://retro.dofusbook.net)
- [Wiki Dofus](https://www.dofus.com)
- Repository GitHub : `https://github.com/skaah/retrofus-API.git`

---

## 📝 Licence

Données issues du jeu Dofus Retro (Ankama). Usage personnel et éducatif.

---

**Généré le** : 14 mars 2026  
**Par** : OpenClaw Agent System
