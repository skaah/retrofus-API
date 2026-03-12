import { Router } from 'express';
import { all, get } from '../database';

const router = Router();

// GET /api/resources - Liste toutes les ressources
router.get('/', async (req, res) => {
  try {
    const { type, search, limit = '50', offset = '0' } = req.query;
    
    let query = 'SELECT * FROM resources WHERE 1=1';
    const params: any[] = [];

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }

    if (search) {
      query += ' AND name LIKE ?';
      params.push(`%${search}%`);
    }

    query += ' ORDER BY name ASC';
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit as string), parseInt(offset as string));

    const resources = await all(query, params);

    const parsedResources = resources.map((resource: any) => ({
      ...resource,
      drop_from: resource.drop_from ? JSON.parse(resource.drop_from) : null,
      craft_usage: resource.craft_usage ? JSON.parse(resource.craft_usage) : null
    }));

    res.json({
      success: true,
      count: parsedResources.length,
      data: parsedResources
    });
  } catch (error) {
    console.error('❌ Erreur GET /resources:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// GET /api/resources/:id - Détail d'une ressource
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await get('SELECT * FROM resources WHERE id = ? OR ankama_id = ?', [id, id]);

    if (!resource) {
      return res.status(404).json({ success: false, error: 'Ressource non trouvée' });
    }

    res.json({
      success: true,
      data: {
        ...resource,
        drop_from: resource.drop_from ? JSON.parse(resource.drop_from) : null,
        craft_usage: resource.craft_usage ? JSON.parse(resource.craft_usage) : null
      }
    });
  } catch (error) {
    console.error('❌ Erreur GET /resources/:id:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

export default router;
