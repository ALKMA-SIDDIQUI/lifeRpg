const express = require('express');
const { pool } = require('../db/pool');
const { authenticateToken } = require('../middleware/auth');
const { calculateProgression } = require('../engine/progression');

const router = express.Router();

/**
 * Get all shop items with user ownership status
 * GET /api/shop/items
 */
router.get('/items', authenticateToken, async (req, res, next) => {
  try {
    const { rows: items } = await pool.query(
      `SELECT i.*,
        CASE WHEN inv.id IS NOT NULL THEN true ELSE false END as owned,
        COALESCE(inv.is_equipped, false) as is_equipped
       FROM items i
       LEFT JOIN inventory inv ON i.id = inv.item_id AND inv.user_id = $1
       ORDER BY i.price ASC, i.id ASC`,
      [req.user.id]
    );

    return res.json({ items });
  } catch (err) {
    next(err);
  }
});

/**
 * Buy an item from the shop
 * POST /api/shop/buy
 */
router.post('/buy', authenticateToken, async (req, res, next) => {
  const { item_id, item_key } = req.body;

  if (!item_id && !item_key) {
    return res.status(400).json({ error: 'item_id or item_key is required.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Fetch item
    let itemRes;
    if (item_id) {
      itemRes = await client.query('SELECT * FROM items WHERE id = $1', [item_id]);
    } else {
      itemRes = await client.query('SELECT * FROM items WHERE item_key = $1', [item_key]);
    }

    if (itemRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Item not found in shop catalog.' });
    }

    const item = itemRes.rows[0];

    // 2. Check if user already owns it
    const ownedRes = await client.query(
      'SELECT id FROM inventory WHERE user_id = $1 AND item_id = $2',
      [req.user.id, item.id]
    );

    if (ownedRes.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'You already own this item!' });
    }

    // 3. Fetch character with lock
    const charRes = await client.query(
      'SELECT * FROM characters WHERE user_id = $1 FOR UPDATE',
      [req.user.id]
    );

    if (charRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Character not found.' });
    }

    const character = charRes.rows[0];

    // 4. Validate Gold balance
    if (character.gold < item.price) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        error: `Insufficient Gold! You need ${item.price} Gold, but currently have ${character.gold} Gold.`,
        requiredGold: item.price,
        currentGold: character.gold,
      });
    }

    // 5. Deduct Gold
    const newGold = character.gold - item.price;
    await client.query(
      'UPDATE characters SET gold = $1, updated_at = NOW() WHERE id = $2',
      [newGold, character.id]
    );

    // 6. Add to inventory
    const invRes = await client.query(
      `INSERT INTO inventory (user_id, item_id, is_equipped)
       VALUES ($1, $2, false)
       RETURNING *`,
      [req.user.id, item.id]
    );

    await client.query('COMMIT');

    const progression = calculateProgression(character.total_xp);

    return res.status(201).json({
      message: `🎉 Successfully acquired ${item.name}!`,
      item,
      inventoryItem: invRes.rows[0],
      goldRemaining: newGold,
      character: {
        ...character,
        gold: newGold,
        progression,
      },
    });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
});

module.exports = router;
