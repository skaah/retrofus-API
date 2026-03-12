#!/usr/bin/env node
/**
 * Script d'import de données pour Dofus Retro API
 * 
 * Utilisation:
 *   node scripts/import-data.js <source> <file>
 * 
 * Exemples:
 *   node scripts/import-data.js json ./data/external-items.json
 *   node scripts/import-data.js csv ./data/monsters.csv
 */

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = path.join(__dirname, '..', 'database.sqlite');

// Connexion DB
const db = new sqlite3.Database(DB_PATH);

// Promisify
const run = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function(err) {
    if (err) reject(err);
    else resolve({ id: this.lastID, changes: this.changes });
  });
});

// Import JSON
async function importJSON(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  console.log(`📥 Import de ${data.length} éléments depuis ${filePath}`);
  
  for (const item of data) {
    // Détecter le type
    if (item.type && ['épée', 'hache', 'marteau', 'baguette', 'arc', 'dague', 'bâton', 'pelle'].includes(item.type)) {
      // Arme
      await run(`
        INSERT OR REPLACE INTO weapons 
        (ankama_id, name, description, type, level, image_url, conditions, stats,
         ap_cost, uses_per_turn, range_min, range_max, crit_chance, crit_bonus, base_damage)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        item.ankama_id, item.name, item.description, item.type, item.level,
        item.image_url, JSON.stringify(item.conditions), JSON.stringify(item.stats),
        item.ap_cost, item.uses_per_turn, item.range_min, item.range_max,
        item.crit_chance, item.crit_bonus, JSON.stringify(item.base_damage)
      ]);
    } else if (item.race || item.level_min !== undefined) {
      // Monstre
      await run(`
        INSERT OR REPLACE INTO monsters 
        (ankama_id, name, description, race, level_min, level_max, image_url,
         stats, resistances, drops, zones, is_boss, is_archmonster)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        item.ankama_id, item.name, item.description, item.race,
        item.level_min, item.level_max, item.image_url,
        JSON.stringify(item.stats), JSON.stringify(item.resistances),
        JSON.stringify(item.drops), JSON.stringify(item.zones),
        item.is_boss ? 1 : 0, item.is_archmonster ? 1 : 0
      ]);
    } else {
      // Item standard
      await run(`
        INSERT OR REPLACE INTO items 
        (ankama_id, name, description, type, level, image_url, conditions, stats, set_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        item.ankama_id, item.name, item.description, item.type, item.level,
        item.image_url, JSON.stringify(item.conditions), JSON.stringify(item.stats), item.set_id
      ]);
    }
  }
  
  console.log(`✅ Import terminé: ${data.length} éléments`);
}

// Main
async function main() {
  const [,, source, filePath] = process.argv;
  
  if (!source || !filePath) {
    console.log('Usage: node import-data.js <json|csv> <file>');
    process.exit(1);
  }
  
  try {
    if (source === 'json') {
      await importJSON(filePath);
    } else {
      console.log('❌ Format non supporté. Utilisez: json');
    }
  } catch (err) {
    console.error('❌ Erreur:', err.message);
    process.exit(1);
  }
  
  db.close();
}

main();
