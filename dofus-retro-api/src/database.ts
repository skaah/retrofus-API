import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';

const DB_PATH = path.join(__dirname, '..', 'database.sqlite');

export const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Erreur connexion SQLite:', err.message);
  } else {
    console.log('✅ Connecté à SQLite');
  }
});

export const run = promisify(db.run.bind(db));
export const get = promisify(db.get.bind(db));
export const all = promisify(db.all.bind(db));

export async function initDatabase(): Promise<void> {
  // Table Items (équipements génériques)
  await run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ankama_id INTEGER UNIQUE,
      name TEXT NOT NULL,
      description TEXT,
      type TEXT NOT NULL,
      level INTEGER NOT NULL,
      image_url TEXT,
      conditions TEXT, -- JSON array
      stats TEXT, -- JSON object
      set_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Table Weapons (armes avec caractéristiques de combat)
  await run(`
    CREATE TABLE IF NOT EXISTS weapons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ankama_id INTEGER UNIQUE,
      name TEXT NOT NULL,
      description TEXT,
      type TEXT NOT NULL, -- épée, hache, baguette, etc.
      level INTEGER NOT NULL,
      image_url TEXT,
      conditions TEXT, -- JSON array
      stats TEXT, -- JSON object
      ap_cost INTEGER,
      uses_per_turn INTEGER,
      range_min INTEGER,
      range_max INTEGER,
      crit_chance INTEGER,
      crit_bonus INTEGER,
      base_damage TEXT, -- JSON { "neutral": "10-15", "air": "5-8" }
      set_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Table Resources
  await run(`
    CREATE TABLE IF NOT EXISTS resources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ankama_id INTEGER UNIQUE,
      name TEXT NOT NULL,
      description TEXT,
      type TEXT NOT NULL, -- plume, cuir, bois, minerai, etc.
      level INTEGER,
      image_url TEXT,
      drop_from TEXT, -- JSON array de monstres
      craft_usage TEXT, -- JSON array de recettes
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Table Monsters
  await run(`
    CREATE TABLE IF NOT EXISTS monsters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ankama_id INTEGER UNIQUE,
      name TEXT NOT NULL,
      description TEXT,
      race TEXT, -- plume, chafers, bandits, etc.
      level_min INTEGER,
      level_max INTEGER,
      image_url TEXT,
      stats TEXT, -- JSON { hp, pa, pm, initiative }
      resistances TEXT, -- JSON { neutral, earth, fire, water, air }
      drops TEXT, -- JSON array de ressources
      zones TEXT, -- JSON array
      is_boss BOOLEAN DEFAULT 0,
      is_archmonster BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Table Sets (panoplies)
  await run(`
    CREATE TABLE IF NOT EXISTS sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ankama_id INTEGER UNIQUE,
      name TEXT NOT NULL,
      level INTEGER,
      image_url TEXT,
      items TEXT, -- JSON array d'item_ids
      bonuses TEXT, -- JSON array des bonus par nombre d'items équipés
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Table Recipes (craft)
  await run(`
    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      result_item_id INTEGER NOT NULL,
      result_quantity INTEGER DEFAULT 1,
      job TEXT, -- forgeron, tailleur, alchimiste, etc.
      level_required INTEGER,
      ingredients TEXT, -- JSON array [{ item_id, quantity }]
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✅ Tables créées avec succès');
}
