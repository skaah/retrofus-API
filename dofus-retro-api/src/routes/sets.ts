import { Router } from 'express';
import { all, get } from '../database';

const router = Router();

// GET /api/sets - Liste toutes les panoplies
router.get('/', async (req, res) => {
  try {
    const { level_min, level_max, search, limit = '50', offset = '0' } = req.query;
    
    let query = 'SELECT * FROM sets WHERE 1=1';
    const params: any[] = [];

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

    const sets = await all(query, params);

    const parsedSets = sets.map((set: any) => ({
      ...set,
      items: set.items ? JSON.parse(set.items) : null,
      bonuses: set.bonuses ? JSON.parse(set.bonuses) : null
    }));

    res.json({
      success: true,
      count: parsedSets.length,
      data: parsedSets
    });
  } catch (error) {
    console.error('❌ Erreur GET /sets:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// GET /api/sets/:id - Détail d'une panoplie
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const set = await get('SELECT * FROM sets WHERE id = ? OR ankama_id = ?', [id, id]);

    if (!set) {
      return res.status(404).json({ success: false, error: 'Panoplie non trouvée' });
    }

    res.json({
      success: true,
      data: {
        ...set,
        items: set.items ? JSON.parse(set.items) : null,
        bonuses: set.bonuses ? JSON.parse(set.bonuses) : null
      }
    });
  } catch (error) {
    console.error('❌ Erreur GET /sets/:id:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

export default router;
