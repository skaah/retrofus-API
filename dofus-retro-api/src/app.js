const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new Database(path.join(__dirname, 'dofus-retro.db'));

// Initialize database schema
function initDatabase() {
  // Items table
  db.exec(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ankama_id INTEGER UNIQUE,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      level INTEGER,
      description TEXT,
      image_url TEXT,
      stats TEXT, -- JSON string
      conditions TEXT, -- JSON string
      set_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Weapons table (extends items)
  db.exec(`
    CREATE TABLE IF NOT EXISTS weapons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_id INTEGER,
      pa INTEGER,
      po INTEGER,
      cc TEXT,
      ec TEXT,
      damage_type TEXT,
      damage TEXT, -- JSON string
      FOREIGN KEY (item_id) REFERENCES items(id)
    )
  `);

  // Resources table
  db.exec(`
    CREATE TABLE IF NOT EXISTS resources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ankama_id INTEGER UNIQUE,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      level INTEGER,
      description TEXT,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Monsters table
  db.exec(`
    CREATE TABLE IF NOT EXISTS monsters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ankama_id INTEGER UNIQUE,
      name TEXT NOT NULL,
      type TEXT,
      level_min INTEGER,
      level_max INTEGER,
      hp INTEGER,
      pa INTEGER,
      pm INTEGER,
      resistances TEXT, -- JSON string
      stats TEXT, -- JSON string
      drops TEXT, -- JSON string
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Sets table (panoplies)
  db.exec(`
    CREATE TABLE IF NOT EXISTS sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ankama_id INTEGER UNIQUE,
      name TEXT NOT NULL,
      level INTEGER,
      items TEXT, -- JSON array of item IDs
      bonus TEXT, -- JSON string
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Professions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS professions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      gathering_locations TEXT, -- JSON string
      recipes TEXT, -- JSON string
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✅ Database initialized');
}

initDatabase();

// ============ ROUTES ============

// Health check
app.get('/', (req, res) => {
  res.json({
    name: 'Dofus Retro API',
    version: '1.0.0',
    description: 'Unofficial API for Dofus Retro game data',
    endpoints: {
      items: '/api/items',
      weapons: '/api/weapons',
      resources: '/api/resources',
      monsters: '/api/monsters',
      sets: '/api/sets',
      professions: '/api/professions'
    }
  });
});

// ============ ITEMS ============

// Get all items with pagination and filters
app.get('/api/items', (req, res) => {
  const { type, level_min, level_max, search, limit = 50, offset = 0 } = req.query;
  
  let sql = 'SELECT * FROM items WHERE 1=1';
  const params = [];

  if (type) {
    sql += ' AND type = ?';
    params.push(type);
  }
  if (level_min) {
    sql += ' AND level >= ?';
    params.push(parseInt(level_min));
  }
  if (level_max) {
    sql += ' AND level <= ?';
    params.push(parseInt(level_max));
  }
  if (search) {
    sql += ' AND name LIKE ?';
    params.push(`%${search}%`);
  }

  sql += ' LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));

  const items = db.prepare(sql).all(...params);
  
  // Parse JSON fields
  const parsedItems = items.map(item => ({
    ...item,
    stats: item.stats ? JSON.parse(item.stats) : null,
    conditions: item.conditions ? JSON.parse(item.conditions) : null
  }));

  res.json({
    count: parsedItems.length,
    limit: parseInt(limit),
    offset: parseInt(offset),
    items: parsedItems
  });
});

// Get item by ID
app.get('/api/items/:id', (req, res) => {
  const item = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id);
  
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  item.stats = item.stats ? JSON.parse(item.stats) : null;
  item.conditions = item.conditions ? JSON.parse(item.conditions) : null;

  res.json(item);
});

// Create item
app.post('/api/items', (req, res) => {
  const { ankama_id, name, type, level, description, image_url, stats, conditions, set_id } = req.body;
  
  try {
    const result = db.prepare(`
      INSERT INTO items (ankama_id, name, type, level, description, image_url, stats, conditions, set_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      ankama_id,
      name,
      type,
      level,
      description,
      image_url,
      stats ? JSON.stringify(stats) : null,
      conditions ? JSON.stringify(conditions) : null,
      set_id
    );

    res.status(201).json({ id: result.lastInsertRowid, message: 'Item created' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============ WEAPONS ============

// Get all weapons
app.get('/api/weapons', (req, res) => {
  const { type, level_min, limit = 50, offset = 0 } = req.query;
  
  let sql = `
    SELECT w.*, i.name, i.type as item_type, i.level, i.description, i.image_url, i.stats, i.conditions
    FROM weapons w
    JOIN items i ON w.item_id = i.id
    WHERE 1=1
  `;
  const params = [];

  if (type) {
    sql += ' AND i.type = ?';
    params.push(type);
  }
  if (level_min) {
    sql += ' AND i.level >= ?';
    params.push(parseInt(level_min));
  }

  sql += ' LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));

  const weapons = db.prepare(sql).all(...params);
  
  const parsedWeapons = weapons.map(w => ({
    ...w,
    stats: w.stats ? JSON.parse(w.stats) : null,
    conditions: w.conditions ? JSON.parse(w.conditions) : null,
    damage: w.damage ? JSON.parse(w.damage) : null
  }));

  res.json({
    count: parsedWeapons.length,
    limit: parseInt(limit),
    offset: parseInt(offset),
    weapons: parsedWeapons
  });
});

// Create weapon
app.post('/api/weapons', (req, res) => {
  const { item_id, pa, po, cc, ec, damage_type, damage } = req.body;
  
  try {
    const result = db.prepare(`
      INSERT INTO weapons (item_id, pa, po, cc, ec, damage_type, damage)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      item_id, pa, po, cc, ec, damage_type,
      damage ? JSON.stringify(damage) : null
    );

    res.status(201).json({ id: result.lastInsertRowid, message: 'Weapon created' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============ RESOURCES ============

// Get all resources
app.get('/api/resources', (req, res) => {
  const { type, level_min, search, limit = 50, offset = 0 } = req.query;
  
  let sql = 'SELECT * FROM resources WHERE 1=1';
  const params = [];

  if (type) {
    sql += ' AND type = ?';
    params.push(type);
  }
  if (level_min) {
    sql += ' AND level >= ?';
    params.push(parseInt(level_min));
  }
  if (search) {
    sql += ' AND name LIKE ?';
    params.push(`%${search}%`);
  }

  sql += ' LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));

  const resources = db.prepare(sql).all(...params);

  res.json({
    count: resources.length,
    limit: parseInt(limit),
    offset: parseInt(offset),
    resources
  });
});

// Get resource by ID
app.get('/api/resources/:id', (req, res) => {
  const resource = db.prepare('SELECT * FROM resources WHERE id = ?').get(req.params.id);
  
  if (!resource) {
    return res.status(404).json({ error: 'Resource not found' });
  }

  res.json(resource);
});

// Create resource
app.post('/api/resources', (req, res) => {
  const { ankama_id, name, type, level, description, image_url } = req.body;
  
  try {
    const result = db.prepare(`
      INSERT INTO resources (ankama_id, name, type, level, description, image_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(ankama_id, name, type, level, description, image_url);

    res.status(201).json({ id: result.lastInsertRowid, message: 'Resource created' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============ MONSTERS ============

// Get all monsters
app.get('/api/monsters', (req, res) => {
  const { type, level_min, level_max, search, limit = 50, offset = 0 } = req.query;
  
  let sql = 'SELECT * FROM monsters WHERE 1=1';
  const params = [];

  if (type) {
    sql += ' AND type = ?';
    params.push(type);
  }
  if (level_min) {
    sql += ' AND level_min >= ?';
    params.push(parseInt(level_min));
  }
  if (level_max) {
    sql += ' AND level_max <= ?';
    params.push(parseInt(level_max));
  }
  if (search) {
    sql += ' AND name LIKE ?';
    params.push(`%${search}%`);
  }

  sql += ' LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));

  const monsters = db.prepare(sql).all(...params);
  
  const parsedMonsters = monsters.map(m => ({
    ...m,
    resistances: m.resistances ? JSON.parse(m.resistances) : null,
    stats: m.stats ? JSON.parse(m.stats) : null,
    drops: m.drops ? JSON.parse(m.drops) : null
  }));

  res.json({
    count: parsedMonsters.length,
    limit: parseInt(limit),
    offset: parseInt(offset),
    monsters: parsedMonsters
  });
});

// Get monster by ID
app.get('/api/monsters/:id', (req, res) => {
  const monster = db.prepare('SELECT * FROM monsters WHERE id = ?').get(req.params.id);
  
  if (!monster) {
    return res.status(404).json({ error: 'Monster not found' });
  }

  monster.resistances = monster.resistances ? JSON.parse(monster.resistances) : null;
  monster.stats = monster.stats ? JSON.parse(monster.stats) : null;
  monster.drops = monster.drops ? JSON.parse(monster.drops) : null;

  res.json(monster);
});

// Create monster
app.post('/api/monsters', (req, res) => {
  const { ankama_id, name, type, level_min, level_max, hp, pa, pm, resistances, stats, drops, image_url } = req.body;
  
  try {
    const result = db.prepare(`
      INSERT INTO monsters (ankama_id, name, type, level_min, level_max, hp, pa, pm, resistances, stats, drops, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      ankama_id, name, type, level_min, level_max, hp, pa, pm,
      resistances ? JSON.stringify(resistances) : null,
      stats ? JSON.stringify(stats) : null,
      drops ? JSON.stringify(drops) : null,
      image_url
    );

    res.status(201).json({ id: result.lastInsertRowid, message: 'Monster created' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============ SETS (PANOPLIES) ============

// Get all sets
app.get('/api/sets', (req, res) => {
  const { level_min, search, limit = 50, offset = 0 } = req.query;
  
  let sql = 'SELECT * FROM sets WHERE 1=1';
  const params = [];

  if (level_min) {
    sql += ' AND level >= ?';
    params.push(parseInt(level_min));
  }
  if (search) {
    sql += ' AND name LIKE ?';
    params.push(`%${search}%`);
  }

  sql += ' LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));

  const sets = db.prepare(sql).all(...params);
  
  const parsedSets = sets.map(s => ({
    ...s,
    items: s.items ? JSON.parse(s.items) : null,
    bonus: s.bonus ? JSON.parse(s.bonus) : null
  }));

  res.json({
    count: parsedSets.length,
    limit: parseInt(limit),
    offset: parseInt(offset),
    sets: parsedSets
  });
});

// Get set by ID with items
app.get('/api/sets/:id', (req, res) => {
  const set = db.prepare('SELECT * FROM sets WHERE id = ?').get(req.params.id);
  
  if (!set) {
    return res.status(404).json({ error: 'Set not found' });
  }

  set.items = set.items ? JSON.parse(set.items) : null;
  set.bonus = set.bonus ? JSON.parse(set.bonus) : null;

  // Get items in set
  if (set.items && set.items.length > 0) {
    const placeholders = set.items.map(() => '?').join(',');
    const items = db.prepare(`SELECT * FROM items WHERE id IN (${placeholders})`).all(...set.items);
    set.item_details = items.map(item => ({
      ...item,
      stats: item.stats ? JSON.parse(item.stats) : null
    }));
  }

  res.json(set);
});

// Create set
app.post('/api/sets', (req, res) => {
  const { ankama_id, name, level, items, bonus, image_url } = req.body;
  
  try {
    const result = db.prepare(`
      INSERT INTO sets (ankama_id, name, level, items, bonus, image_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      ankama_id, name, level,
      items ? JSON.stringify(items) : null,
      bonus ? JSON.stringify(bonus) : null,
      image_url
    );

    res.status(201).json({ id: result.lastInsertRowid, message: 'Set created' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============ PROFESSIONS ============

// Get all professions
app.get('/api/professions', (req, res) => {
  const professions = db.prepare('SELECT * FROM professions').all();
  
  const parsedProfessions = professions.map(p => ({
    ...p,
    gathering_locations: p.gathering_locations ? JSON.parse(p.gathering_locations) : null,
    recipes: p.recipes ? JSON.parse(p.recipes) : null
  }));

  res.json({ professions: parsedProfessions });
});

// Get profession by ID
app.get('/api/professions/:id', (req, res) => {
  const profession = db.prepare('SELECT * FROM professions WHERE id = ?').get(req.params.id);
  
  if (!profession) {
    return res.status(404).json({ error: 'Profession not found' });
  }

  profession.gathering_locations = profession.gathering_locations ? JSON.parse(profession.gathering_locations) : null;
  profession.recipes = profession.recipes ? JSON.parse(profession.recipes) : null;

  res.json(profession);
});

// Create profession
app.post('/api/professions', (req, res) => {
  const { name, description, gathering_locations, recipes } = req.body;
  
  try {
    const result = db.prepare(`
      INSERT INTO professions (name, description, gathering_locations, recipes)
      VALUES (?, ?, ?, ?)
    `).run(
      name, description,
      gathering_locations ? JSON.stringify(gathering_locations) : null,
      recipes ? JSON.stringify(recipes) : null
    );

    res.status(201).json({ id: result.lastInsertRowid, message: 'Profession created' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============ SEED DATA ============

// Endpoint to seed sample data
app.post('/api/seed', (req, res) => {
  const { key } = req.query;
  
  if (key !== 'dofus-retro-2024') {
    return res.status(403).json({ error: 'Invalid seed key' });
  }

  try {
    // Seed some sample items
    const sampleItems = [
      {
        name: 'Amulette du Bouftou',
        type: 'Amulette',
        level: 10,
        description: 'Une amulette faite de poils de bouftou.',
        stats: JSON.stringify({ force: 10, vitalite: 20 }),
        image_url: 'https://static.ankama.com/dofus/www/game/items/200/1234.png'
      },
      {
        name: 'Anneau du Bouftou',
        type: 'Anneau',
        level: 10,
        description: 'Un anneau fait de poils de bouftou.',
        stats: JSON.stringify({ sagesse: 5, vitalite: 15 }),
        image_url: 'https://static.ankama.com/dofus/www/game/items/200/1235.png'
      },
      {
        name: 'Bottes du Bouftou',
        type: 'Bottes',
        level: 10,
        description: 'Des bottes faites de cuir de bouftou.',
        stats: JSON.stringify({ agilite: 5, vitalite: 10 }),
        image_url: 'https://static.ankama.com/dofus/www/game/items/200/1236.png'
      }
    ];

    const insertItem = db.prepare(`
      INSERT OR IGNORE INTO items (name, type, level, description, stats, image_url)
      VALUES (@name, @type, @level, @description, @stats, @image_url)
    `);

    for (const item of sampleItems) {
      insertItem.run(item);
    }

    // Seed sample resources
    const sampleResources = [
      { name: 'Poil de Bouftou', type: 'Poil', level: 1, description: 'Un poil de bouftou.' },
      { name: 'Cuir de Bouftou', type: 'Cuir', level: 1, description: 'Un morceau de cuir de bouftou.' },
      { name: 'Sang de Bouftou', type: 'Sang', level: 1, description: 'Du sang de bouftou.' }
    ];

    const insertResource = db.prepare(`
      INSERT OR IGNORE INTO resources (name, type, level, description)
      VALUES (@name, @type, @level, @description)
    `);

    for (const resource of sampleResources) {
      insertResource.run(resource);
    }

    // Seed sample monsters
    const sampleMonsters = [
      {
        name: 'Bouftou',
        type: 'Monstre',
        level_min: 1,
        level_max: 10,
        hp: 50,
        pa: 4,
        pm: 3,
        stats: JSON.stringify({ force: 10, agilite: 5 }),
        drops: JSON.stringify([
          { item: 'Poil de Bouftou', rate: 50 },
          { item: 'Cuir de Bouftou', rate: 30 }
        ])
      },
      {
        name: 'Boufton Noir',
        type: 'Monstre',
        level_min: 10,
        level_max: 20,
        hp: 100,
        pa: 4,
        pm: 4,
        stats: JSON.stringify({ force: 20, agilite: 10 }),
        drops: JSON.stringify([
          { item: 'Poil de Boufton Noir', rate: 40 },
          { item: 'Corne de Boufton Noir', rate: 20 }
        ])
      }
    ];

    const insertMonster = db.prepare(`
      INSERT OR IGNORE INTO monsters (name, type, level_min, level_max, hp, pa, pm, stats, drops)
      VALUES (@name, @type, @level_min, @level_max, @hp, @pa, @pm, @stats, @drops)
    `);

    for (const monster of sampleMonsters) {
      insertMonster.run(monster);
    }

    // Seed sample sets
    const sampleSets = [
      {
        name: 'Panoplie du Bouftou',
        level: 10,
        items: JSON.stringify([1, 2, 3]),
        bonus: JSON.stringify({ '2_items': { vitalite: 10 }, '3_items': { force: 15 } })
      }
    ];

    const insertSet = db.prepare(`
      INSERT OR IGNORE INTO sets (name, level, items, bonus)
      VALUES (@name, @level, @items, @bonus)
    `);

    for (const set of sampleSets) {
      insertSet.run(set);
    }

    // Seed professions
    const sampleProfessions = [
      {
        name: 'Paysan',
        description: 'Récolte des céréales et fabrique des pains.',
        gathering_locations: JSON.stringify(['Champs d\'Astrub', 'Plaines de Cania'])
      },
      {
        name: 'Mineur',
        description: 'Récolte des minerais et fabrique des alliages.',
        gathering_locations: JSON.stringify(['Mines d\'Astrub', 'Mines de Brakmar'])
      }
    ];

    const insertProfession = db.prepare(`
      INSERT OR IGNORE INTO professions (name, description, gathering_locations)
      VALUES (@name, @description, @gathering_locations)
    `);

    for (const profession of sampleProfessions) {
      insertProfession.run(profession);
    }

    res.json({ message: 'Database seeded successfully with sample data' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Dofus Retro API running on port ${PORT}`);
  console.log(`📖 API Documentation: http://localhost:${PORT}/`);
});

module.exports = app;
