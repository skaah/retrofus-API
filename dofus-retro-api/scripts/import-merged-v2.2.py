#!/usr/bin/env python3
"""
Import des données fusionnées (v2.2) dans SQLite
Source: seed-data-merged-v2.2.json
"""

import json
import sqlite3
from pathlib import Path

DB_PATH = Path("/root/.openclaw/workspace/dofus-retro-api/database.sqlite")
DATA_FILE = Path("/root/.openclaw/workspace/dofus-retro-api/data/seed-data-merged-v2.2.json")

def init_tables(conn):
    """Crée les tables si elles n'existent pas"""
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ankama_id INTEGER UNIQUE,
            name TEXT NOT NULL,
            description TEXT,
            type TEXT NOT NULL,
            level INTEGER NOT NULL,
            image_url TEXT,
            conditions TEXT,
            stats TEXT,
            set_id INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS weapons (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ankama_id INTEGER UNIQUE,
            name TEXT NOT NULL,
            description TEXT,
            type TEXT NOT NULL,
            level INTEGER NOT NULL,
            image_url TEXT,
            conditions TEXT,
            stats TEXT,
            ap_cost INTEGER,
            uses_per_turn INTEGER,
            range_min INTEGER,
            range_max INTEGER,
            crit_chance INTEGER,
            crit_bonus INTEGER,
            base_damage TEXT,
            set_id INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ankama_id INTEGER UNIQUE,
            name TEXT NOT NULL,
            level INTEGER,
            image_url TEXT,
            items TEXT,
            bonuses TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS monsters (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ankama_id INTEGER UNIQUE,
            name TEXT NOT NULL,
            description TEXT,
            race TEXT,
            level_min INTEGER,
            level_max INTEGER,
            image_url TEXT,
            stats TEXT,
            resistances TEXT,
            drops TEXT,
            zones TEXT,
            is_boss BOOLEAN DEFAULT 0,
            is_archmonster BOOLEAN DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS resources (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ankama_id INTEGER UNIQUE,
            name TEXT NOT NULL,
            description TEXT,
            type TEXT NOT NULL,
            level INTEGER,
            image_url TEXT,
            drop_from TEXT,
            craft_usage TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    print("✅ Tables initialisées")

def clear_data(conn):
    """Nettoie les données existantes"""
    cursor = conn.cursor()
    cursor.execute('DELETE FROM items')
    cursor.execute('DELETE FROM weapons')
    cursor.execute('DELETE FROM sets')
    cursor.execute('DELETE FROM monsters')
    cursor.execute('DELETE FROM resources')
    conn.commit()
    print("🗑️  Données existantes nettoyées")

def import_data(conn):
    """Importe les données depuis le JSON"""
    cursor = conn.cursor()
    
    print('\n📥 Chargement de seed-data-merged-v2.2.json...')
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"\n📊 Contenu à importer:")
    print(f"   - Items: {len(data.get('items', []))}")
    print(f"   - Weapons: {len(data.get('weapons', []))}")
    print(f"   - Sets: {len(data.get('sets', []))}")
    print(f"   - Monsters: {len(data.get('monsters', []))}")
    print(f"   - Resources: {len(data.get('resources', []))}")
    
    # Import Items
    print('\n🔹 Import des items...')
    count = 0
    for item in data.get('items', []):
        try:
            cursor.execute('''
                INSERT INTO items (name, description, type, level, image_url, stats)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                item.get('name', ''),
                item.get('description'),
                item.get('type', 'Équipement'),
                item.get('level', 1),
                item.get('image_url'),
                json.dumps(item.get('stats', {}))
            ))
            count += 1
            if count % 500 == 0:
                print(f"   {count} items...")
        except Exception as e:
            print(f"   ❌ Erreur item {item.get('name')}: {e}")
    print(f"   ✅ {count} items importés")
    
    # Import Weapons
    print('\n🔹 Import des armes...')
    count = 0
    for weapon in data.get('weapons', []):
        try:
            cursor.execute('''
                INSERT INTO weapons (name, description, type, level, image_url, stats, ap_cost)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (
                weapon.get('name', ''),
                weapon.get('description'),
                weapon.get('type', 'Arme'),
                weapon.get('level', 1),
                weapon.get('image_url'),
                json.dumps(weapon.get('stats', {})),
                weapon.get('stats', {}).get('pa')
            ))
            count += 1
            if count % 200 == 0:
                print(f"   {count} armes...")
        except Exception as e:
            print(f"   ❌ Erreur arme {weapon.get('name')}: {e}")
    print(f"   ✅ {count} armes importées")
    
    # Import Sets
    print('\n🔹 Import des panoplies...')
    count = 0
    for set_item in data.get('sets', []):
        try:
            cursor.execute('''
                INSERT INTO sets (name, level, image_url, bonuses)
                VALUES (?, ?, ?, ?)
            ''', (
                set_item.get('name', ''),
                set_item.get('level', 1),
                set_item.get('image_url'),
                json.dumps(set_item.get('stats', {}))
            ))
            count += 1
        except Exception as e:
            print(f"   ❌ Erreur set {set_item.get('name')}: {e}")
    print(f"   ✅ {count} panoplies importées")
    
    # Import Monsters
    print('\n🔹 Import des monstres...')
    count = 0
    for monster in data.get('monsters', []):
        try:
            level = monster.get('level', 1)
            cursor.execute('''
                INSERT INTO monsters (name, description, race, level_min, level_max, image_url)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                monster.get('name', ''),
                monster.get('description'),
                monster.get('race'),
                monster.get('level_min', level),
                monster.get('level_max', level),
                monster.get('image_url')
            ))
            count += 1
        except Exception as e:
            print(f"   ❌ Erreur monstre {monster.get('name')}: {e}")
    print(f"   ✅ {count} monstres importés")
    
    # Import Resources
    print('\n🔹 Import des ressources...')
    count = 0
    for resource in data.get('resources', []):
        try:
            cursor.execute('''
                INSERT INTO resources (name, description, type, level, image_url)
                VALUES (?, ?, ?, ?, ?)
            ''', (
                resource.get('name', ''),
                resource.get('description'),
                resource.get('type', 'Ressource'),
                resource.get('level'),
                resource.get('image_url')
            ))
            count += 1
        except Exception as e:
            print(f"   ❌ Erreur ressource {resource.get('name')}: {e}")
    print(f"   ✅ {count} ressources importées")
    
    conn.commit()
    print('\n🎉 IMPORT TERMINÉ AVEC SUCCÈS !')
    
    # Stats finales
    cursor.execute('SELECT COUNT(*) FROM items')
    items_count = cursor.fetchone()[0]
    cursor.execute('SELECT COUNT(*) FROM weapons')
    weapons_count = cursor.fetchone()[0]
    cursor.execute('SELECT COUNT(*) FROM sets')
    sets_count = cursor.fetchone()[0]
    cursor.execute('SELECT COUNT(*) FROM monsters')
    monsters_count = cursor.fetchone()[0]
    cursor.execute('SELECT COUNT(*) FROM resources')
    resources_count = cursor.fetchone()[0]
    
    total = items_count + weapons_count + sets_count + monsters_count + resources_count
    print(f"\n📊 TOTAL EN BASE: {total} éléments")
    print(f"   - Items: {items_count}")
    print(f"   - Weapons: {weapons_count}")
    print(f"   - Sets: {sets_count}")
    print(f"   - Monsters: {monsters_count}")
    print(f"   - Resources: {resources_count}")

def main():
    print("=" * 60)
    print("IMPORT V2.2 - DOFUS RETRO API")
    print("=" * 60)
    
    conn = sqlite3.connect(DB_PATH)
    try:
        init_tables(conn)
        clear_data(conn)
        import_data(conn)
    finally:
        conn.close()
        print("\n✅ Connexion fermée")

if __name__ == "__main__":
    main()
