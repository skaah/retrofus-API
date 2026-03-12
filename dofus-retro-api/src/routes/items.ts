import { Router } from 'express';
import { all, get } from '../database';

const router = Router();

// GET /api/items - Liste tous les items avec filtres optionnels
router.get('/', async (req, res) => {
  try {
    const { type, level_min, level_max, search, limit = '50', offset = '0' } = req.query;
    
    let query = 'SELECT * FROM items WHERE 1=1';
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

    const items = await all(query, params);

    // Parser les JSON
    const parsedItems = items.map((item: any) => ({
      ...item,
      conditions: item.conditions ? JSON.parse(item.conditions) : null,
      stats: item.stats ? JSON.parse(item.stats) : null
    }));

    res.json({
      success: true,
      count: parsedItems.length,
      data: parsedItems
    });
  } catch (error) {
    console.error('❌ Erreur GET /items:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// GET /api/items/:id - Détail d'un item
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await get('SELECT * FROM items WHERE id = ? OR ankama_id = ?', [id, id]);

    if (!item) {
      return res.status(404).json({ success: false, error: 'Item non trouvé' });
    }

    res.json({
      success: true,
      data: {
        ...item,
        conditions: item.conditions ? JSON.parse(item.conditions) : null,
        stats: item.stats ? JSON.parse(item.stats) : null
      }
    });
  } catch (error) {
    console.error('❌ Erreur GET /items/:id:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// GET /api/items/types - Liste des types d'items
router.get('/meta/types', async (req, res) => {
  try {
    const types = await all('SELECT DISTINCT type FROM items ORDER BY type');
    res.json({
      success: true,
      data: types.map((t: any) => t.type)
    });
  } catch (error) {
    console.error('❌ Erreur GET /items/types:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

export default router;
