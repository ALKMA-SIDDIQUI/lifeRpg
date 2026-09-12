const express = require('express');
const { pool } = require('../db/pool');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * Get user's inventory
 * GET /api/inventory
 */
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const { rows: inventory } = await pool.query(
      `SELECT inv.id as inventory_id, inv.is_equipped, inv.acquired_at,
              i.id as item_id, i.item_key, i.name, i.description,
              i.category, i.price, i.icon, i.rarity, i.attribute_bonus, i.visual_effect
       FROM inventory inv
       JOIN items i ON inv.item_id = i.id
       WHERE inv.user_id = $1
       ORDER BY inv.is_equipped DESC, i.category ASC, inv.acquired_at DESC`,
      [req.user.id]
    );

    const categories = {
      relics: inventory.filter(item => item.category === 'relic'),
      companions: inventory.filter(item => item.category === 'companion'),
      themes: inventory.filter(item => item.category === 'theme'),
      badges: inventory.filter(item => item.category === 'badge'),
    };

    return res.json({
      inventory,
      categories,
      totalItems: inventory.length,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
