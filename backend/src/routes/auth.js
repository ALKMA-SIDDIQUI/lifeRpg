const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../db/pool');
const { authenticateToken, generateToken } = require('../middleware/auth');
const { calculateProgression } = require('../engine/progression');

const router = express.Router();

/**
 * Register a new user
 * POST /api/auth/register
 */
router.post('/register', async (req, res, next) => {
  const { email, username, password, avatar_class } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ error: 'Email, username, and password are required.' });
  }

  const trimmedEmail = email.trim().toLowerCase();
  const trimmedUsername = username.trim();

  if (trimmedUsername.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters long.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check existing
    const existingCheck = await client.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [trimmedEmail, trimmedUsername]
    );
    if (existingCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'A user with this email or username already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user
    const userRes = await client.query(
      `INSERT INTO users (email, username, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, email, username, created_at`,
      [trimmedEmail, trimmedUsername, passwordHash]
    );
    const newUser = userRes.rows[0];

    // Insert character
    const charClass = avatar_class || 'cyber_knight';
    const charRes = await client.query(
      `INSERT INTO characters (user_id, name, avatar_class, level, total_xp, gold, strength, intellect, wisdom, vitality, equipped_theme, equipped_badge, equipped_relic)
       VALUES ($1, $2, $3, 1, 0, 50, 10, 10, 10, 10, 'cyber_neon', 'novice_adventurer', 'none')
       RETURNING *`,
      [newUser.id, trimmedUsername, charClass]
    );
    const character = charRes.rows[0];

    // Initialize streak
    await client.query(
      `INSERT INTO streaks (user_id, current_streak, max_streak, last_activity_date)
       VALUES ($1, 0, 0, NULL)`,
      [newUser.id]
    );

    // Grant default starter items to inventory
    const starterItems = await client.query(
      "SELECT id, item_key FROM items WHERE item_key IN ('cyber_neon', 'novice_adventurer')"
    );
    for (const item of starterItems.rows) {
      await client.query(
        `INSERT INTO inventory (user_id, item_id, is_equipped)
         VALUES ($1, $2, true)
         ON CONFLICT DO NOTHING`,
        [newUser.id, item.id]
      );
    }

    await client.query('COMMIT');

    const token = generateToken(newUser);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const progression = calculateProgression(character.total_xp);

    return res.status(201).json({
      message: 'Welcome to Life RPG, Adventurer!',
      user: newUser,
      token,
      character: {
        ...character,
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

/**
 * Login existing user
 * POST /api/auth/login
 */
router.post('/login', async (req, res, next) => {
  const { emailOrUsername, password } = req.body;

  if (!emailOrUsername || !password) {
    return res.status(400).json({ error: 'Username or email and password are required.' });
  }

  try {
    const loginIdent = emailOrUsername.trim().toLowerCase();
    const userRes = await pool.query(
      `SELECT * FROM users WHERE LOWER(email) = $1 OR LOWER(username) = $1`,
      [loginIdent]
    );

    if (userRes.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials. User not found.' });
    }

    const user = userRes.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials. Incorrect password.' });
    }

    const charRes = await pool.query('SELECT * FROM characters WHERE user_id = $1', [user.id]);
    const character = charRes.rows[0];
    const progression = calculateProgression(character ? character.total_xp : 0);

    const token = generateToken(user);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: 'Logged in successfully.',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        created_at: user.created_at,
      },
      token,
      character: character ? { ...character, progression } : null,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Get current session user & character
 * GET /api/auth/me
 */
router.get('/me', authenticateToken, async (req, res, next) => {
  try {
    const userRes = await pool.query(
      'SELECT id, email, username, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const charRes = await pool.query('SELECT * FROM characters WHERE user_id = $1', [req.user.id]);
    const character = charRes.rows[0];
    const progression = calculateProgression(character ? character.total_xp : 0);

    return res.json({
      user: userRes.rows[0],
      character: character ? { ...character, progression } : null,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Logout
 * POST /api/auth/logout
 */
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ message: 'Logged out successfully.' });
});

module.exports = router;
