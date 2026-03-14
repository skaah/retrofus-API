#!/usr/bin/env python3
"""
Dofus Retro API - Dashboard Reporter
Génère un rapport visuel de l'état de l'API
"""

import json
import os
from pathlib import Path
from datetime import datetime
from typing import Dict, List

def load_json(path: Path) -> Dict:
    """Charge un fichier JSON"""
    try:
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return data
    except Exception as e:
        return {}

def get_items_by_level(items: List[Dict]) -> Dict[str, int]:
    """Répartition des items par niveau"""
    ranges = {}
    for item in items:
        level = item.get("level", 0)
        range_start = (level // 20) * 20
        range_key = f"{range_start}-{range_start+19}"
        ranges[range_key] = ranges.get(range_key, 0) + 1
    return dict(sorted(ranges.items(), key=lambda x: int(x[0].split('-')[0])))

def get_items_by_type(items: List[Dict]) -> Dict[str, int]:
    """Répartition par type"""
    types = {}
    for item in items:
        t = item.get("type", "Inconnu")
        types[t] = types.get(t, 0) + 1
    return dict(sorted(types.items(), key=lambda x: -x[1]))

def generate_dashboard():
    """Génère le dashboard complet"""
    
    api_dir = Path("dofus-retro-api/data")
    
    # Charger les données
    seed_data = load_json(api_dir / "seed-data-final.json")
    items_data = load_json(api_dir / "items-enriched.json")
    weapons_data = load_json(api_dir / "weapons-enriched.json")
    sets_data = load_json(api_dir / "sets-enriched.json")
    monsters_data = load_json(api_dir / "monsters-enriched.json")
    resources_data = load_json(api_dir / "resources-enriched.json")
    classes_data = load_json(api_dir / "classes-enriched.json")
    spells_data = load_json(api_dir / "spells-enriched.json")
    dungeons_data = load_json(api_dir / "dungeons-enriched.json")
    quests_data = load_json(api_dir / "quests-enriched.json")
    
    # Extraire les listes
    items = items_data.get("items", []) if isinstance(items_data, dict) else items_data
    weapons = weapons_data.get("weapons", []) if isinstance(weapons_data, dict) else weapons_data
    sets_list = sets_data.get("sets", []) if isinstance(sets_data, dict) else sets_data
    monsters = monsters_data.get("monsters", []) if isinstance(monsters_data, dict) else monsters_data
    resources = resources_data.get("resources", []) if isinstance(resources_data, dict) else resources_data
    classes = classes_data.get("classes", []) if isinstance(classes_data, dict) else classes_data
    spells = spells_data.get("spells", []) if isinstance(spells_data, dict) else spells_data
    dungeons = dungeons_data.get("dungeons", []) if isinstance(dungeons_data, dict) else dungeons_data
    quests = quests_data.get("quests", []) if isinstance(quests_data, dict) else quests_data
    
    # Calculs
    total_items = len(items)
    total_weapons = len(weapons)
    total_sets = len(sets_list)
    total_monsters = len(monsters)
    total_resources = len(resources)
    total_classes = len(classes)
    total_spells = len(spells)
    total_dungeons = len(dungeons)
    total_quests = len(quests)
    
    grand_total = total_items + total_weapons + total_sets + total_monsters + total_resources + total_classes + total_spells + total_dungeons + total_quests
    
    # Items par niveau
    items_by_level = get_items_by_level(items)
    
    # Items par type
    items_by_type = get_items_by_type(items)
    
    # Générer le rapport
    report = f"""
╔════════════════════════════════════════════════════════════════╗
║           🔥 DOFUS RETRO API - DASHBOARD                       ║
║           {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}                          ║
╚════════════════════════════════════════════════════════════════╝

📊 VUE D'ENSEMBLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Total Éléments:     {grand_total:,}
  
📦 PAR CATÉGORIE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  👕 Items:           {total_items:4d} / 500   {'█' * (total_items // 20)}{'░' * (25 - total_items // 20)} {total_items//5}%
  ⚔️  Armes:           {total_weapons:4d} / 300   {'█' * (total_weapons // 20)}{'░' * (15 - total_weapons // 20)} {total_weapons//3}%
  👔 Panoplies:        {total_sets:4d} / 100   {'█' * (total_sets // 5)}{'░' * (20 - total_sets // 5)} {total_sets}%
  👹 Monstres:         {total_monsters:4d} / 200   {'█' * (total_monsters // 20)}{'░' * (10 - total_monsters // 20)} {total_monsters//2}%
  🌿 Ressources:       {total_resources:4d} / 300   {'█' * (total_resources // 20)}{'░' * (15 - total_resources // 20)} {total_resources//3}%
  🧙 Classes:          {total_classes:4d} / 12    {'█' * total_classes}{'░' * (12 - total_classes)} {total_classes//12*100}%
  ✨ Sorts:            {total_spells:4d} / 350   {'█' * (total_spells // 20)}{'░' * (17 - total_spells // 20)} {total_spells//35}%
  🏰 Donjons:          {total_dungeons:4d} / 50    {'█' * (total_dungeons // 5)}{'░' * (10 - total_dungeons // 5)} {total_dungeons//5*10}%
  📜 Quêtes:           {total_quests:4d} / 60    {'█' * (total_quests // 6)}{'░' * (10 - total_quests // 6)} {total_quests//6*10}%

📈 RÉPARTITION DES ITEMS PAR NIVEAU
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""
    
    for level_range, count in items_by_level.items():
        bar = '█' * (count // 2)
        report += f"  Niv {level_range:>6}: {count:3d} {bar}\n"
    
    report += f"""
🏷️  RÉPARTITION PAR TYPE (Top 10)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""
    for i, (item_type, count) in enumerate(list(items_by_type.items())[:10]):
        bar = '█' * (count // 3)
        report += f"  {item_type:15s}: {count:3d} {bar}\n"
    
    # Items manquants prioritaires
    report += f"""
⚠️  PRIORITÉS D'ENRICHISSEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🔴 HAUTE - Items high-level (190-200) manquants
     → Kralano, Le Kumokan, Le Kim, Coiffe de Bill de Grobe...
     
  🟡 MOYENNE - Armes à compléter
     → Besoin de {300 - total_weapons} armes supplémentaires
     
  🟢 FAIBLE - Quêtes et donjons
     → {60 - total_quests} quêtes, {50 - total_dungeons} donjons à créer

🎯 PROCHAINES ACTIONS RECOMMANDÉES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1. Scraper DofusBook avec l'extension Chrome
  2. Importer les fichiers JSON dans imports/
  3. Lancer: python3 dofusbook_api_enricher.py
  4. Vérifier le rapport: dofusbook_comparison_report.json

════════════════════════════════════════════════════════════════
"""
    
    return report

if __name__ == "__main__":
    os.chdir("/root/.openclaw/workspace")
    dashboard = generate_dashboard()
    print(dashboard)
    
    # Sauvegarder dans un fichier
    with open("API_DASHBOARD.txt", "w", encoding="utf-8") as f:
        f.write(dashboard)
    
    print("\n💾 Dashboard sauvegardé dans: API_DASHBOARD.txt")
