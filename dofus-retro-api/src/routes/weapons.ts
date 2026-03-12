import { Router } from 'express';
import { all, get } from '../database';

const router = Router();

// GET /api/weapons - Liste toutes les armes
router.get('/', async (req, res) => {
  try {
    const { type, level_min, level_max, search, limit = '50', offset = '0' } = req.query;
    
    let query = 'SELECT * FROM weapons WHERE 1=1';
    const params: any[] = [];

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }

    if (level_min) {
      query += ' AND level >= ?';
      params.push(parseInt(level_min as string));
    }

    if (level_max) {
      query += ' AND level <= ?';
      params.push(parseInt(level_max as string));
    }

    if (search) {
      query += ' AND name LIKE ?';
      params.push(`%${search}%`);
    }

    query += ' ORDER BY level ASC, name ASC';
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit as string), parseInt(offset as string));

    const weapons = await all(query, params);

    const parsedWeapons = weapons.map((weapon: any) => ({
      ...weapon,
      conditions: weapon.conditions ? JSON.parse(weapon.conditions) : null,
      stats: weapon.stats ? JSON.parse(weapon.stats) : null,
      base_damage: weapon.base_damage ? JSON.parse(weapon.base_damage) : null
    }));

    res.json({
      success: true,
      count: parsedWeapons.length,
      data: parsedWeapons
    });
  } catch (error) {
    console.error('❌ Erreur GET /weapons:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// GET /api/weapons/:id - Détail d'une arme
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const weapon = await get('SELECT * FROM weapons WHERE id = ? OR ankama_id = ?', [id, id]);

    if (!weapon) {
      return res.status(404).json({ success: false, error: 'Arme non trouvée' });
    }

    res.json({
      success: true,
      data: {
        ...weapon,
        conditions: weapon.conditions ? JSON.parse(weapon.conditions) : null,
        stats: weapon.stats ? JSON.parse(weapon.stats) : null,
        base_damage: weapon.base_damage ? JSON.parse(weapon.base_damage) : null
      }
    });
  } catch (error) {
    console.error('❌ Erreur GET /weapons/:id:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// GET /api/weapons/types - Liste des types d'armes
router.get('/meta/types', async (req, res) => {
  try {
    const types = await all('SELECT DISTINCT type FROM weapons ORDER BY type');
    res.json({
      success: true,
      data: types.map((t: any) => t.type)
    });
  } catch (error) {
    console.error('❌ Erreur GET /weapons/types:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

export default router;
