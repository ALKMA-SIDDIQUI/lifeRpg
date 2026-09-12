const express = require('express');
const { pool } = require('../db/pool');
const { authenticateToken } = require('../middleware/auth');
const { calculateProgression } = require('../engine/progression');
const { getStreak } = require('../engine/streak');

const router = express.Router();

/**
 * Get character profile, progression, streak, and equipped gear
 * GET /api/character
 */
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const charRes = await pool.query(
      'SELECT * FROM characters WHERE user_id = $1',
      [req.user.id]
    );

    if (charRes.rows.length === 0) {
      return res.status(404).json({ error: 'Character not found for user.' });
    }

    const character = charRes.rows[0];
    const progression = calculateProgression(character.total_xp);
    const streak = await getStreak(pool, req.user.id);

    // Fetch equipped items with bonuses
    const equippedItemsRes = await pool.query(
      `SELECT i.* FROM inventory inv
       JOIN items i ON inv.item_id = i.id
       WHERE inv.user_id = $1 AND inv.is_equipped = true`,
      [req.user.id]
    );

    // Calculate total effective attributes including equipped item bonuses
    let bonusStrength = 0;
    let bonusIntellect = 0;
    let bonusWisdom = 0;
    let bonusVitality = 0;

    for (const item of equippedItemsRes.rows) {
      const bonus = item.attribute_bonus || {};
      if (bonus.strength) bonusStrength += bonus.strength;
      if (bonus.intellect) bonusIntellect += bonus.intellect;
      if (bonus.wisdom) bonusWisdom += bonus.wisdom;
      if (bonus.vitality) bonusVitality += bonus.vitality;
    }

    return res.json({
      character: {
        ...character,
        progression,
        effectiveStats: {
          strength: character.strength + bonusStrength,
          intellect: character.intellect + bonusIntellect,
          wisdom: character.wisdom + bonusWisdom,
          vitality: character.vitality + bonusVitality,
          base: {
            strength: character.strength,
            intellect: character.intellect,
            wisdom: character.wisdom,
            vitality: character.vitality,
          },
          bonuses: {
            strength: bonusStrength,
            intellect: bonusIntellect,
            wisdom: bonusWisdom,
            vitality: bonusVitality,
          },
        },
        equippedItems: equippedItemsRes.rows,
        streak,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Change Avatar Class
 * PUT /api/character/class
 */
router.put('/class', authenticateToken, async (req, res, next) => {
  const { avatar_class } = req.body;
  const allowedClasses = ['cyber_knight', 'neon_sorcerer', 'quantum_rogue'];

  if (!allowedClasses.includes(avatar_class)) {
    return res.status(400).json({ error: `Invalid class. Allowed: ${allowedClasses.join(', ')}` });
  }

  try {
    const updateRes = await pool.query(
      `UPDATE characters SET avatar_class = $1, updated_at = NOW() WHERE user_id = $2 RETURNING *`,
      [avatar_class, req.user.id]
    );

    const character = updateRes.rows[0];
    const progression = calculateProgression(character.total_xp);

    return res.json({
      message: 'Avatar class updated.',
      character: { ...character, progression },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Equip or unequip an item
 * PUT /api/character/equip
 */
router.put('/equip', authenticateToken, async (req, res, next) => {
  const { item_key, unequip } = req.body;

  if (!item_key) {
    return res.status(400).json({ error: 'item_key is required.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Verify user owns item
    const itemRes = await client.query(
      `SELECT i.*, inv.id as inv_id, inv.is_equipped FROM items i
       JOIN inventory inv ON i.id = inv.item_id
       WHERE i.item_key = $1 AND inv.user_id = $2`,
      [item_key, req.user.id]
    );

    if (itemRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'You do not own this item.' });
    }

    const item = itemRes.rows[0];
    const category = item.category;

    if (unequip) {
      // Unequip item
      await client.query(
        'UPDATE inventory SET is_equipped = false WHERE id = $1',
        [item.inv_id]
      );

      // Reset character equipped slot
      if (category === 'theme') {
        await client.query("UPDATE characters SET equipped_theme = 'cyber_neon' WHERE user_id = $1", [req.user.id]);
      } else if (category === 'badge') {
        await client.query("UPDATE characters SET equipped_badge = 'novice_adventurer' WHERE user_id = $1", [req.user.id]);
      } else if (category === 'relic') {
        await client.query("UPDATE characters SET equipped_relic = 'none' WHERE user_id = $1", [req.user.id]);
      }
    } else {
      // Unequip any other item in same category first
      await client.query(
        `UPDATE inventory SET is_equipped = false
         WHERE user_id = $1 AND item_id IN (SELECT id FROM items WHERE category = $2)`,
        [req.user.id, category]
      );

      // Equip this item
      await client.query(
        'UPDATE inventory SET is_equipped = true WHERE id = $1',
        [item.inv_id]
      );

      // Update character equipped field
      if (category === 'theme') {
        await client.query('UPDATE characters SET equipped_theme = $1 WHERE user_id = $2', [item_key, req.user.id]);
      } else if (category === 'badge') {
        await client.query('UPDATE characters SET equipped_badge = $1 WHERE user_id = $2', [item_key, req.user.id]);
      } else if (category === 'relic') {
        await client.query('UPDATE characters SET equipped_relic = $1 WHERE user_id = $2', [item_key, req.user.id]);
      }
    }

    await client.query('COMMIT');

    // Fetch updated character
    const charRes = await pool.query('SELECT * FROM characters WHERE user_id = $1', [req.user.id]);
    const character = charRes.rows[0];
    const progression = calculateProgression(character.total_xp);

    return res.json({
      message: unequip ? `Unequipped ${item.name}.` : `Equipped ${item.name}!`,
      character: { ...character, progression },
    });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
});

// Multer Storage Configuration for User Avatar Uploads
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const avatarsDir = process.env.VERCEL
  ? path.join('/tmp', 'uploads', 'avatars')
  : path.resolve(__dirname, '../../uploads/avatars');
try {
  if (!fs.existsSync(avatarsDir)) {
    fs.mkdirSync(avatarsDir, { recursive: true });
  }
} catch (err) {
  console.warn('[Storage] Upload directory note:', err.message);
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanExt = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) ? ext : '.png';
    const filename = `avatar-${req.user.id}-${Date.now()}${cleanExt}`;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];

  if (allowedMimeTypes.includes(file.mimetype) && allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    const err = new Error('Invalid file type. Only JPG, PNG, and WEBP images are supported.');
    err.code = 'INVALID_FILE_TYPE';
    cb(err, false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter,
}).single('avatar');

/**
 * Upload or replace user profile image
 * POST /api/character/avatar
 */
router.post('/avatar', authenticateToken, (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'Image file exceeds the 2MB size limit. Please upload a smaller image.' });
      }
      if (err.code === 'INVALID_FILE_TYPE') {
        return res.status(400).json({ error: err.message });
      }
      return res.status(400).json({ error: err.message || 'Unable to upload image. Please try again.' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No image file was provided.' });
    }

    try {
      // 1. Fetch current avatar to delete previous file
      const currentRes = await pool.query(
        'SELECT avatar_url FROM characters WHERE user_id = $1',
        [req.user.id]
      );
      if (currentRes.rows.length > 0 && currentRes.rows[0].avatar_url) {
        const oldUrl = currentRes.rows[0].avatar_url;
        if (oldUrl.startsWith('/uploads/avatars/')) {
          const oldFilePath = path.join(__dirname, '../../', oldUrl);
          if (fs.existsSync(oldFilePath)) {
            try { fs.unlinkSync(oldFilePath); } catch (e) { /* ignore unlink error */ }
          }
        }
      }

      // 2. Persist new avatar URL
      const relativeUrl = `/uploads/avatars/${req.file.filename}`;
      const updateRes = await pool.query(
        `UPDATE characters SET avatar_url = $1, updated_at = NOW()
         WHERE user_id = $2
         RETURNING *`,
        [relativeUrl, req.user.id]
      );

      const character = updateRes.rows[0];
      const progression = calculateProgression(character.total_xp);

      return res.json({
        message: 'Profile image uploaded successfully!',
        avatar_url: relativeUrl,
        character: { ...character, progression },
      });
    } catch (dbErr) {
      // Remove uploaded file if DB query fails
      if (req.file && fs.existsSync(req.file.path)) {
        try { fs.unlinkSync(req.file.path); } catch (e) { /* ignore */ }
      }
      next(dbErr);
    }
  });
});

/**
 * Remove user profile image
 * DELETE /api/character/avatar
 */
router.delete('/avatar', authenticateToken, async (req, res, next) => {
  try {
    const currentRes = await pool.query(
      'SELECT avatar_url FROM characters WHERE user_id = $1',
      [req.user.id]
    );

    if (currentRes.rows.length > 0 && currentRes.rows[0].avatar_url) {
      const oldUrl = currentRes.rows[0].avatar_url;
      if (oldUrl.startsWith('/uploads/avatars/')) {
        const oldFilePath = path.join(__dirname, '../../', oldUrl);
        if (fs.existsSync(oldFilePath)) {
          try { fs.unlinkSync(oldFilePath); } catch (e) { /* ignore */ }
        }
      }
    }

    const updateRes = await pool.query(
      `UPDATE characters SET avatar_url = NULL, updated_at = NOW()
       WHERE user_id = $1
       RETURNING *`,
      [req.user.id]
    );

    const character = updateRes.rows[0];
    const progression = calculateProgression(character.total_xp);

    return res.json({
      message: 'Profile image removed successfully.',
      avatar_url: null,
      character: { ...character, progression },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

