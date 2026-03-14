#!/usr/bin/env python3
"""
Auto-Import Checker
Vérifie s'il y a des fichiers d'import en attente et les traite automatiquement
"""

import os
import json
from pathlib import Path
from datetime import datetime

def check_and_process_imports():
    """Vérifie et traite les imports en attente"""
    
    imports_dir = Path("imports")
    if not imports_dir.exists():
        return None
    
    json_files = list(imports_dir.glob("*.json"))
    json_files = [f for f in json_files if not f.name.startswith("example") and f.name != "README.md"]
    
    if not json_files:
        return None
    
    print(f"🔄 {len(json_files)} fichier(s) d'import trouvé(s)")
    
    # Exécuter l'enrichisseur
    os.system("python3 dofusbook_api_enricher.py")
    
    # Déplacer les fichiers traités
    processed_dir = imports_dir / "processed"
    processed_dir.mkdir(exist_ok=True)
    
    for f in json_files:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        new_name = f"{f.stem}_{timestamp}{f.suffix}"
        f.rename(processed_dir / new_name)
    
    return len(json_files)

if __name__ == "__main__":
    os.chdir("/root/.openclaw/workspace")
    result = check_and_process_imports()
    if result:
        print(f"✅ {result} import(s) traité(s)")
    else:
        print("ℹ️ Aucun import en attente")
