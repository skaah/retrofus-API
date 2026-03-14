# Dossier Imports

Placez ici les fichiers JSON exportés par l'extension Chrome **DofusBook Retro Scraper**.

## Format attendu

Les fichiers doivent avoir le format suivant (généré automatiquement par l'extension):

```json
{
  "url": "https://retro.dofusbook.net/fr/encyclopedie/items/gelano",
  "timestamp": "2026-03-14T10:30:00.000Z",
  "items": [
    {
      "type": "item",
      "name": "Gelano",
      "level": 60,
      "item_type": "Anneau",
      "image_url": "https://...",
      "stats": {
        "vitalite": { "min": 40, "max": 60 },
        "sagesse": { "min": 20, "max": 30 },
        "pm": 1
      },
      "recipe": [...]
    }
  ]
}
```

## Utilisation

1. Allez sur retro.dofusbook.net avec Chrome
2. Naviguez vers l'item/panoplie à scraper
3. Cliquez sur l'extension 🔥
4. Le fichier JSON se télécharge automatiquement
5. **Copiez le fichier dans ce dossier `imports/`**
6. Lancez: `python3 dofusbook_api_enricher.py`

## Items prioritaires à scraper

Voir le fichier `dofusbook_comparison_report.json` pour la liste complète.

### Priorité CRITIQUE
- Gelano (Niv 60)
- Amulette du Bouftou (Niv 10)

### Priorité HAUTE
- Kralano (Niv 198)
- Le Kumokan (Niv 196)
- Le Kim (Niv 135)
- Coiffe de Bill de Grobe (Niv 195)
- Sandales Circulaires du Kimbo (Niv 193)
- etc.

