#!/usr/bin/env python3
"""
DofusBook API Comparator
Compare l'API existante avec les données de référence et identifie les gaps
"""

import json
from pathlib import Path
from typing import Dict, List, Set
from dataclasses import dataclass

@dataclass
class ItemGap:
    """Représente un gap entre l'API et la référence"""
    name: str
    level: int
    item_type: str
    gap_type: str  # 'missing', 'stat_mismatch', 'level_wrong'
    details: str
    reference_data: Dict = None
    api_data: Dict = None

class DofusAPIComparator:
    """Compare l'API avec les données de référence"""
    
    # Items emblématiques à vérifier (niveaux et types vérifiés sur DofusBook)
    REFERENCE_ITEMS = [
        # High-level items manquants
        {"name": "Kralano", "level": 198, "type": "Chapeau", "priority": "high"},
        {"name": "Le Kumokan", "level": 196, "type": "Chapeau", "priority": "high"},
        {"name": "Le Kim", "level": 135, "type": "Chapeau", "priority": "high"},
        {"name": "Coiffe de Bill de Grobe", "level": 195, "type": "Chapeau", "priority": "high"},
        {"name": "L'amulette Grobe Bambou", "level": 194, "type": "Amulette", "priority": "high"},
        {"name": "Cape Ilyza'aile", "level": 194, "type": "Cape", "priority": "high"},
        {"name": "Sandales Circulaires du Kimbo", "level": 193, "type": "Bottes", "priority": "high"},
        {"name": "Kralamansion", "level": 192, "type": "Amulette", "priority": "high"},
        {"name": "Ilyzanneau", "level": 191, "type": "Anneau", "priority": "medium"},
        {"name": "Qu'Tanneau", "level": 191, "type": "Anneau", "priority": "medium"},
        {"name": "Bottes Qu'Tanées", "level": 190, "type": "Bottes", "priority": "medium"},
        {"name": "Voile d'encre", "level": 191, "type": "Cape", "priority": "medium"},
        {"name": "Amunite", "level": 189, "type": "Amulette", "priority": "medium"},
        {"name": "Casque Harnage", "level": 188, "type": "Chapeau", "priority": "medium"},
        {"name": "Ceinture Rasboulaire du Rasboul", "level": 182, "type": "Ceinture", "priority": "medium"},
        {"name": "Ceinture Toré", "level": 182, "type": "Ceinture", "priority": "medium"},
        {"name": "Chaussons Pignons", "level": 180, "type": "Bottes", "priority": "medium"},
        {"name": "Ougamulette", "level": 180, "type": "Amulette", "priority": "medium"},
        {"name": "Coiffe du Tynril", "level": 164, "type": "Chapeau", "priority": "medium"},
        {"name": "Goldoture", "level": 164, "type": "Ceinture", "priority": "medium"},
        {"name": "Sandales du Minotot", "level": 163, "type": "Bottes", "priority": "medium"},
        {"name": "Zothulette", "level": 162, "type": "Amulette", "priority": "medium"},
        {"name": "Blopronne Royale", "level": 161, "type": "Chapeau", "priority": "medium"},
        {"name": "Le Nahitse", "level": 160, "type": "Chapeau", "priority": "medium"},
        
        # Items emblématiques à vérifier
        {"name": "Gelano", "level": 60, "type": "Anneau", "priority": "critical"},
        {"name": "Amulette du Bouftou", "level": 10, "type": "Amulette", "priority": "critical"},
        {"name": "Bottes de Klim", "level": 51, "type": "Bottes", "priority": "high"},
        {"name": "Ceinture du Mulou", "level": 74, "type": "Ceinture", "priority": "high"},
        {"name": "Anneau du Mulou", "level": 74, "type": "Anneau", "priority": "high"},
        {"name": "Coiffe du Mulou", "level": 77, "type": "Chapeau", "priority": "high"},
    ]
    
    REFERENCE_SETS = [
        {"name": "Panoplie du Bouftou", "pieces": 5, "priority": "critical"},
        {"name": "Panoplie du Mulou", "pieces": 4, "priority": "high"},
        {"name": "Panoplie du Dragoeuf", "pieces": 8, "priority": "high"},
        {"name": "Panoplie du Minotot", "pieces": 8, "priority": "high"},
        {"name": "Panoplie du Tynril", "pieces": 4, "priority": "medium"},
        {"name": "Panoplie Blop", "pieces": 4, "priority": "medium"},
    ]
    
    def __init__(self, api_dir: str = "dofus-retro-api/data"):
        self.api_dir = Path(api_dir)
        self.gaps: List[ItemGap] = []
        
    def load_api_data(self):
        """Charge les données de l'API"""
        print("📚 Chargement des données API...")
        
        items_path = self.api_dir / "items-enriched.json"
        with open(items_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            self.api_items = {item["name"].lower(): item for item in data.get("items", [])}
        
        sets_path = self.api_dir / "sets-enriched.json"
        with open(sets_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            self.api_sets = {s["name"].lower(): s for s in data.get("sets", [])}
        
        print(f"  ✅ {len(self.api_items)} items, {len(self.api_sets)} panoplies")
        
    def check_items(self):
        """Vérifie les items de référence"""
        print("\n🔍 Vérification des items...")
        
        for ref in self.REFERENCE_ITEMS:
            name_lower = ref["name"].lower()
            
            if name_lower not in self.api_items:
                self.gaps.append(ItemGap(
                    name=ref["name"],
                    level=ref["level"],
                    item_type=ref["type"],
                    gap_type="missing",
                    details=f"Item manquant de l'API (niveau {ref['level']})",
                    reference_data=ref
                ))
            else:
                api_item = self.api_items[name_lower]
                api_level = api_item.get("level", 0)
                
                # Vérifier le niveau
                if api_level != ref["level"]:
                    self.gaps.append(ItemGap(
                        name=ref["name"],
                        level=api_level,
                        item_type=api_item.get("type", "?"),
                        gap_type="level_wrong",
                        details=f"Niveau incorrect: API={api_level}, Référence={ref['level']}",
                        reference_data=ref,
                        api_data=api_item
                    ))
                
                # Vérifier si les stats sont présentes
                if not api_item.get("stats"):
                    self.gaps.append(ItemGap(
                        name=ref["name"],
                        level=api_level,
                        item_type=api_item.get("type", "?"),
                        gap_type="stat_mismatch",
                        details="Stats manquantes",
                        api_data=api_item
                    ))
        
        print(f"  ⚠️ {len([g for g in self.gaps if g.gap_type == 'missing'])} items manquants")
        print(f"  ⚠️ {len([g for g in self.gaps if g.gap_type == 'level_wrong'])} niveaux incorrects")
        print(f"  ⚠️ {len([g for g in self.gaps if g.gap_type == 'stat_mismatch'])} stats manquantes")
        
    def check_sets(self):
        """Vérifie les panoplies de référence"""
        print("\n👕 Vérification des panoplies...")
        
        for ref in self.REFERENCE_SETS:
            name_lower = ref["name"].lower()
            
            if name_lower not in self.api_sets:
                self.gaps.append(ItemGap(
                    name=ref["name"],
                    level=0,
                    item_type="Panoplie",
                    gap_type="missing_set",
                    details=f"Panoplie manquante ({ref['pieces']} pièces)",
                    reference_data=ref
                ))
        
        print(f"  ⚠️ {len([g for g in self.gaps if g.gap_type == 'missing_set'])} panoplies manquantes")
        
    def generate_missing_items_list(self) -> List[Dict]:
        """Génère la liste des items à créer"""
        missing = []
        
        for gap in self.gaps:
            if gap.gap_type == "missing" and gap.reference_data:
                missing.append({
                    "name": gap.name,
                    "level": gap.level,
                    "type": gap.item_type,
                    "priority": gap.reference_data.get("priority", "medium"),
                    "source": "dofusbook"
                })
        
        return sorted(missing, key=lambda x: (x["priority"] != "critical", x["priority"] != "high", -x["level"]))
        
    def generate_report(self):
        """Génère un rapport complet"""
        print("\n" + "=" * 60)
        print("📊 RAPPORT DE COMPARAISON")
        print("=" * 60)
        
        # Grouper par priorité
        critical = [g for g in self.gaps if g.reference_data and g.reference_data.get("priority") == "critical"]
        high = [g for g in self.gaps if g.reference_data and g.reference_data.get("priority") == "high"]
        medium = [g for g in self.gaps if g.reference_data and g.reference_data.get("priority") == "medium"]
        
        print(f"\n🚨 CRITIQUE ({len(critical)} items):")
        for gap in critical[:10]:
            print(f"   - {gap.name} (Niv {gap.level}, {gap.item_type})")
            if gap.details:
                print(f"     → {gap.details}")
        
        print(f"\n🔴 HAUTE ({len(high)} items):")
        for gap in high[:10]:
            print(f"   - {gap.name} (Niv {gap.level}, {gap.item_type})")
        if len(high) > 10:
            print(f"     ... et {len(high) - 10} autres")
        
        print(f"\n🟡 MOYENNE ({len(medium)} items):")
        print(f"   {len(medium)} items à vérifier")
        
        # Sauvegarder le rapport JSON
        report = {
            "timestamp": "2026-03-14",
            "summary": {
                "total_gaps": len(self.gaps),
                "critical": len(critical),
                "high": len(high),
                "medium": len(medium),
                "missing_items": len([g for g in self.gaps if g.gap_type == "missing"]),
                "wrong_levels": len([g for g in self.gaps if g.gap_type == "level_wrong"]),
                "missing_sets": len([g for g in self.gaps if g.gap_type == "missing_set"])
            },
            "items_to_create": self.generate_missing_items_list(),
            "all_gaps": [
                {
                    "name": g.name,
                    "level": g.level,
                    "type": g.item_type,
                    "gap_type": g.gap_type,
                    "details": g.details
                }
                for g in self.gaps
            ]
        }
        
        report_path = Path("dofusbook_comparison_report.json")
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        
        print(f"\n💾 Rapport complet sauvegardé: {report_path}")
        
        return report
        
    def run(self):
        """Lance la comparaison complète"""
        print("=" * 60)
        print("🔍 DofusBook API Comparator")
        print("=" * 60)
        
        self.load_api_data()
        self.check_items()
        self.check_sets()
        return self.generate_report()


if __name__ == "__main__":
    comparator = DofusAPIComparator()
    report = comparator.run()
    
    print("\n✨ Prochaines étapes recommandées:")
    print("   1. Utiliser l'extension Chrome pour scraper les items CRITIQUES")
    print("   2. Placer les exports JSON dans le dossier 'imports/'")
    print("   3. Lancer: python3 dofusbook_api_enricher.py")
