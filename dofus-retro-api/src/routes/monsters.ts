import { Router } from 'express';
import { all, get } from '../database';

const router = Router();

// GET /api/monsters - Liste tous les monstres
router.get('/', async (req, res) => {
  try {
    const { race, level_min, level_max, zone, is_boss, search, limit = '50', offset = '0' } = req.query;
    
    let query = 'SELECT * FROM monsters WHERE 1=1';
    const params: any[] = [];

    if (race) {
      query += ' AND race = ?';
      params.push(race);
    }

    if (level_min) {
      query += ' AND level_max >= ?';
      params.push(parseInt(level_min as string));
    }

    if (level_max) {
      query += ' AND level_min <= ?';
      params.push(parseInt(level_max as string));
    }

    if (is_boss !== undefined) {
      query += ' AND is_boss = ?';
      params.push(is_boss === 'true' ? 1 : 0);
    }

    if (search) {
      query += ' AND name LIKE ?';
      params.push(`%${search}%`);
    }

    query += ' ORDER BY level_min ASC, name ASC';
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit as string), parseInt(offset as string));

    const monsters = await all(query, params);

    const parsedMonsters = monsters.map((monster: any) => ({
      ...monster,
      stats: monster.stats ? JSON.parse(monster.stats) : null,
      resistances: monster.resistances ? JSON.parse(monster.resistances) : null,
      drops: monster.drops ? JSON.parse(monster.drops) : null,
      zones: monster.zones ? JSON.parse(monster.zones) : null
    }));

    res.json({
      success: true,
      count: parsedMonsters.length,
      data: parsedMonsters
    });
  } catch (error) {
    console.error('❌ Erreur GET /monsters:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// GET /api/monsters/:id - Détail d'un monstre
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const monster = await get('SELECT * FROM monsters WHERE id = ? OR ankama_id = ?', [id, id]);

    if (!monster) {
      return res.status(404).json({ success: false, error: 'Monstre non trouvé' });
    }

    res.json({
      success: true,
      data: {
        ...monster,
        stats: monster.stats ? JSON.parse(monster.stats) : null,
        resistances: monster.resistances ? JSON.parse(monster.resistances) : null,
        drops: monster.drops ? JSON.parse(monster.drops) : null,
        zones: monster.zones ? JSON.parse(monster.zones) : null
      }
    });
  } catch (error) {
    console.error('❌ Erreur GET /monsters/:id:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

export default router;
