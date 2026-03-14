#!/usr/bin/env python3
"""
DofusBook API Enricher
Importe les données exportées par l'extension Chrome et enrichit l'API existante
"""

import json
import os
import re
from pathlib import Path
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
from datetime import datetime

@dataclass
class EnrichmentReport:
    """Rapport d'enrichissement"""
    timestamp: str
    source_files: List[str]
    items_added: int
    items_updated: int
    items_unchanged: int
    errors: List[str]
    
    def to_dict(self):
        return asdict(self)

class DofusAPIEnricher:
    def __init__(self, api_dir: str = "data"):
        self.api_dir = Path(api_dir)
        self.imports_dir = Path("imports")
        self.imports_dir.mkdir(exist_ok=True)
        
        # Charger l'API existante
        self.load_existing_api()
        
    def load_existing_api(self):
        """Charge tous les fichiers de l'API existante"""
        print("📚 Chargement de l'API existante...")
        
        self.existing_items = self.load_json(self.api_dir / "items-enriched.json", "items")
        self.existing_weapons = self.load_json(self.api_dir / "weapons-enriched.json", "weapons")
        self.existing_sets = self.load_json(self.api_dir / "sets-enriched.json", "sets")
        
        # Index pour recherche rapide
        self.items_by_name = {item.get("name", "").lower(): item for item in self.existing_items}
        self.weapons_by_name = {w.get("name", "").lower(): w for w in self.existing_weapons}
        self.sets_by_name = {s.get("name", "").lower(): s for s in self.existing_sets}
        
        print(f"  ✅ {len(self.existing_items)} items chargés")
        print(f"  ✅ {len(self.existing_weapons)} armes chargées")
        print(f"  ✅ {len(self.existing_sets)} panoplies chargées")
        
    def load_json(self, path: Path, key: str = None) -> List[Dict]:
        """Charge un fichier JSON"""
        try:
            with open(path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                if key and key in data:
                    return data[key]
                return data if isinstance(data, list) else []
        except Exception as e:
            print(f"  ⚠️ Erreur chargement {path}: {e}")
            return []
    
    def import_dofusbook_export(self, filepath: Path) -> Dict[str, Any]:
        """Importe un fichier exporté par l'extension Chrome"""
        print(f"\n📥 Import: {filepath.name}")
        
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            imported = {
                "items": [],
                "panoplies": [],
                "source": str(filepath),
                "imported_at": datetime.now().isoformat()
            }
            
            # Détecter le format: liste complète ou item unique
            # Format 1: {"items": [{"name": "...", "image_url": "..."}, ...]} - liste de la page /items
            # Format 2: {"item": {...}} ou {"panoplie": {...}} - page détaillée
            
            if "items" in data and isinstance(data["items"], list):
                # Format liste (page /items avec plusieurs items)
                for item in data["items"]:
                    if item.get("name") and item.get("name") != "Items":  # Skip header
                        normalized = self.normalize_list_item(item)
                        if normalized:
                            imported["items"].append(normalized)
                            
            elif "item" in data:
                # Format item unique détaillé
                normalized = self.normalize_item(data["item"])
                if normalized:
                    imported["items"].append(normalized)
                    
            elif "panoplie" in data:
                # Format panoplie unique détaillée
                normalized = self.normalize_set(data["panoplie"])
                if normalized:
                    imported["panoplies"].append(normalized)
                    
            # Traiter les items au format détaillé (ancien format)
            elif "items" in data and isinstance(data["items"], list):
                for item in data["items"]:
                    normalized = self.normalize_item(item)
                    if normalized:
                        imported["items"].append(normalized)
            
            # Traiter une panoplie unique
            if "panoplie" in data:
                normalized = self.normalize_set(data["panoplie"])
                if normalized:
                    imported["panoplies"].append(normalized)
            elif "panoplies" in data:
                for panoplie in data["panoplies"]:
                    normalized = self.normalize_set(panoplie)
                    if normalized:
                        imported["panoplies"].append(normalized)
            
            print(f"  ✅ {len(imported['items'])} items, {len(imported['panoplies'])} panoplies")
            return imported
            
        except Exception as e:
            print(f"  ❌ Erreur: {e}")
            return {"items": [], "panoplies": [], "errors": [str(e)]}
    
    def normalize_item(self, raw_item: Dict) -> Optional[Dict]:
        """Normalise un item au format API standard"""
        if not raw_item.get("name"):
            return None
        
        normalized = {
            "name": raw_item.get("name", "Unknown"),
            "type": raw_item.get("item_type", raw_item.get("type", "Inconnu")),
            "level": int(raw_item.get("level", 0)) if raw_item.get("level") else 0,
            "description": raw_item.get("description", ""),
            "image_url": raw_item.get("image_url", ""),
            "stats": {},
            "scraped_from": raw_item.get("dofusbook_url", ""),
            "scraped_at": datetime.now().isoformat()
        }
        
        # Normaliser les stats
        raw_stats = raw_item.get("stats", {})
        for key, value in raw_stats.items():
            if isinstance(value, dict) and "min" in value:
                normalized["stats"][key] = value
            elif isinstance(value, (int, float)):
                normalized["stats"][key] = value
        
        # Recette
        if raw_item.get("recipe"):
            normalized["recipe"] = raw_item["recipe"]
        
        return normalized
    
    def normalize_set(self, raw_set: Dict) -> Optional[Dict]:
        """Normalise une panoplie au format API standard"""
        if not raw_set or not raw_set.get("name"):
            return None
        
        normalized = {
            "name": raw_set.get("name", "Unknown"),
            "level": int(raw_set.get("level", 0)) if raw_set.get("level") else 0,
            "pieces": raw_set.get("pieces", []),
            "bonuses": raw_set.get("bonuses", {}),
            "scraped_from": raw_set.get("dofusbook_url", ""),
            "scraped_at": datetime.now().isoformat()
        }
        
        return normalized
    
    def normalize_list_item(self, raw_item: Dict) -> Optional[Dict]:
        """Normalise un item de liste (format partiel depuis page /items)"""
        if not raw_item.get("name"):
            return None
        
        # Skip les headers comme "Items 1397"
        name = raw_item.get("name", "").strip()
        if not name or name.lower().startswith("items "):
            return None
        
        normalized = {
            "name": name,
            "type": raw_item.get("item_type", "Inconnu"),
            "level": 0,  # Niveau inconnu dans ce format
            "description": "",
            "image_url": raw_item.get("image_url", ""),
            "stats": {},
            "scraped_from": "https://retro.dofusbook.net/fr/encyclopedie/items",
            "scraped_at": datetime.now().isoformat(),
            "data_quality": "partial"  # Marquer comme données partielles
        }
        
        return normalized
    
    def merge_items(self, imported_items: List[Dict]) -> tuple:
        """Fusionne les items importés avec l'API existante"""
        added = 0
        updated = 0
        unchanged = 0
        
        for item in imported_items:
            name_lower = item["name"].lower()
            
            if name_lower in self.items_by_name:
                # Item existe - comparer et mettre à jour si nécessaire
                existing = self.items_by_name[name_lower]
                
                # Vérifier si des stats sont nouvelles ou différentes
                has_changes = self.has_stat_changes(existing.get("stats", {}), item.get("stats", {}))
                
                if has_changes:
                    # Fusionner les stats
                    existing["stats"] = self.merge_stats(existing.get("stats", {}), item.get("stats", {}))
                    existing["updated_at"] = datetime.now().isoformat()
                    existing["sources"] = existing.get("sources", []) + ["dofusbook"]
                    updated += 1
                else:
                    unchanged += 1
            else:
                # Nouvel item
                item["sources"] = ["dofusbook"]
                item["created_at"] = datetime.now().isoformat()
                self.existing_items.append(item)
                self.items_by_name[name_lower] = item
                added += 1
        
        return added, updated, unchanged
    
    def has_stat_changes(self, existing: Dict, imported: Dict) -> bool:
        """Vérifie si les stats importées sont différentes"""
        for key, value in imported.items():
            if key not in existing:
                return True
            if existing[key] != value:
                return True
        return False
    
    def merge_stats(self, existing: Dict, imported: Dict) -> Dict:
        """Fusionne deux ensembles de stats (privilégie les valeurs plus précises)"""
        merged = existing.copy()
        
        for key, value in imported.items():
            if key not in merged:
                merged[key] = value
            else:
                # Si l'importé a des ranges (min/max) et l'existant non, utiliser l'importé
                if isinstance(value, dict) and "min" in value:
                    if not isinstance(merged[key], dict):
                        merged[key] = value
                    # Sinon garder l'existant (supposé plus fiable)
        
        return merged
    
    def save_enriched_api(self):
        """Sauvegarde l'API enrichie"""
        print("\n💾 Sauvegarde de l'API enrichie...")
        
        # Sauvegarder items
        with open(self.api_dir / "items-enriched.json", 'w', encoding='utf-8') as f:
            json.dump({"items": self.existing_items}, f, ensure_ascii=False, indent=2)
        print(f"  ✅ {len(self.existing_items)} items sauvegardés")
        
        # Sauvegarder seed-data-final.json aussi
        self.update_seed_data()
        
    def update_seed_data(self):
        """Met à jour le fichier seed-data-final.json"""
        seed_path = self.api_dir / "seed-data-final.json"
        
        try:
            with open(seed_path, 'r', encoding='utf-8') as f:
                seed_data = json.load(f)
            
            # Mettre à jour la section items
            seed_data["items"] = self.existing_items
            seed_data["sets"] = self.existing_sets
            
            # Mettre à jour les métadonnées (peut être "metadata" ou "_metadata")
            meta_key = "metadata" if "metadata" in seed_data else "_metadata"
            if meta_key in seed_data:
                seed_data[meta_key]["last_updated"] = datetime.now().isoformat()
                seed_data[meta_key]["counts"]["items"] = len(self.existing_items)
                seed_data[meta_key]["counts"]["sets"] = len(self.existing_sets)
                seed_data[meta_key]["total_elements"] = sum(seed_data[meta_key]["counts"].values())
            
            with open(seed_path, 'w', encoding='utf-8') as f:
                json.dump(seed_data, f, ensure_ascii=False, indent=2)
            
            print(f"  ✅ seed-data-final.json mis à jour")
            
        except Exception as e:
            print(f"  ⚠️ Erreur mise à jour seed-data: {e}")
    
    def generate_quality_report(self) -> Dict:
        """Génère un rapport de qualité des données"""
        print("\n📊 Génération du rapport de qualité...")
        
        report = {
            "timestamp": datetime.now().isoformat(),
            "total_items": len(self.existing_items),
            "total_sets": len(self.existing_sets),
            "stats_coverage": {},
            "items_by_level": {},
            "items_by_type": {},
            "missing_images": [],
            "items_with_recipe": 0
        }
        
        # Analyser la couverture des stats
        all_stat_keys = set()
        for item in self.existing_items:
            all_stat_keys.update(item.get("stats", {}).keys())
        
        for key in all_stat_keys:
            count = sum(1 for item in self.existing_items if key in item.get("stats", {}))
            report["stats_coverage"][key] = count
        
        # Répartition par niveau
        for item in self.existing_items:
            level = item.get("level", 0)
            level_range = f"{level // 20 * 20}-{level // 20 * 20 + 19}"
            report["items_by_level"][level_range] = report["items_by_level"].get(level_range, 0) + 1
        
        # Répartition par type
        for item in self.existing_items:
            item_type = item.get("type", "Inconnu")
            report["items_by_type"][item_type] = report["items_by_type"].get(item_type, 0) + 1
        
        # Items sans images
        report["missing_images"] = [
            item["name"] for item in self.existing_items 
            if not item.get("image_url")
        ]
        
        # Items avec recette
        report["items_with_recipe"] = sum(
            1 for item in self.existing_items 
            if item.get("recipe")
        )
        
        # Sauvegarder le rapport
        report_path = self.api_dir / "quality-report.json"
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        
        print(f"  ✅ Rapport sauvegardé: {report_path}")
        return report
    
    def run(self, import_dir: str = "imports"):
        """Lance l'enrichissement complet"""
        print("=" * 60)
        print("🔥 DofusBook API Enricher")
        print("=" * 60)
        
        import_path = Path(import_dir)
        if not import_path.exists():
            print(f"\n⚠️ Dossier '{import_dir}' non trouvé")
            print("   Créez ce dossier et placez-y les exports JSON de l'extension Chrome")
            return
        
        # Trouver tous les fichiers JSON
        json_files = list(import_path.glob("*.json"))
        
        if not json_files:
            print(f"\n⚠️ Aucun fichier JSON trouvé dans '{import_dir}'")
            return
        
        print(f"\n📁 {len(json_files)} fichiers trouvés")
        
        # Importer chaque fichier
        total_added = 0
        total_updated = 0
        total_unchanged = 0
        
        for filepath in json_files:
            imported = self.import_dofusbook_export(filepath)
            
            # Fusionner les items
            if imported.get("items"):
                added, updated, unchanged = self.merge_items(imported["items"])
                total_added += added
                total_updated += updated
                total_unchanged += unchanged
            
            # Fusionner les panoplies
            if imported.get("panoplies"):
                for panoplie in imported["panoplies"]:
                    name_lower = panoplie["name"].lower()
                    if name_lower not in self.sets_by_name:
                        self.existing_sets.append(panoplie)
                        self.sets_by_name[name_lower] = panoplie
                        total_added += 1
        
        # Sauvegarder
        self.save_enriched_api()
        
        # Rapport de qualité
        quality = self.generate_quality_report()
        
        # Résumé
        print("\n" + "=" * 60)
        print("📊 RÉSUMÉ")
        print("=" * 60)
        print(f"  ➕ Items ajoutés: {total_added}")
        print(f"  🔄 Items mis à jour: {total_updated}")
        print(f"  ✅ Items inchangés: {total_unchanged}")
        print(f"  📦 Total items: {quality['total_items']}")
        print(f"  👕 Total panoplies: {quality['total_sets']}")
        print(f"  🖼️ Items avec recette: {quality['items_with_recipe']}")
        print(f"  ⚠️ Items sans image: {len(quality['missing_images'])}")
        print("=" * 60)


if __name__ == "__main__":
    enricher = DofusAPIEnricher(api_dir="dofus-retro-api/data")
    enricher.run(import_dir="imports")
