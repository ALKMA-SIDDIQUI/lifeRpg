const express = require('express');
const { pool } = require('../db/pool');
const { authenticateToken } = require('../middleware/auth');
const { calculateProgression } = require('../engine/progression');
const { getStreak } = require('../engine/streak');

const router = express.Router();

/**
 * Get comprehensive dashboard overview
 * GET /api/stats/dashboard
 */
router.get('/dashboard', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;

    // 1. Character
    const charRes = await pool.query('SELECT * FROM characters WHERE user_id = $1', [userId]);
    if (charRes.rows.length === 0) {
      return res.status(404).json({ error: 'Character not found.' });
    }
    const character = charRes.rows[0];
    const progression = calculateProgression(character.total_xp);

    // 2. Streak
    const streak = await getStreak(pool, userId);

    // 3. Active quests (up to 5 for today's display)
    const activeQuestsRes = await pool.query(
      `SELECT * FROM tasks
       WHERE user_id = $1 AND is_completed = false
       ORDER BY due_date ASC NULLS LAST, xp_reward DESC, id DESC
       LIMIT 5`,
      [userId]
    );

    // 4. Counts
    const countsRes = await pool.query(
      `SELECT
         COUNT(*) FILTER (WHERE is_completed = false) as active_count,
         COUNT(*) FILTER (WHERE is_completed = true) as completed_count,
         COUNT(*) as total_count
       FROM tasks WHERE user_id = $1`,
      [userId]
    );

    // 5. Recent Activity (Task History)
    const historyRes = await pool.query(
      `SELECT * FROM task_history
       WHERE user_id = $1
       ORDER BY completed_at DESC
       LIMIT 10`,
      [userId]
    );

    // 6. Category breakdown of completed tasks
    const categoryStatsRes = await pool.query(
      `SELECT category, COUNT(*) as count, SUM(xp_earned) as total_xp
       FROM task_history
       WHERE user_id = $1
       GROUP BY category`,
      [userId]
    );

    return res.json({
      character: {
        ...character,
        progression,
      },
      streak,
      activeQuests: activeQuestsRes.rows,
      counts: {
        active: parseInt(countsRes.rows[0].active_count, 10),
        completed: parseInt(countsRes.rows[0].completed_count, 10),
        total: parseInt(countsRes.rows[0].total_count, 10),
      },
      recentActivity: historyRes.rows,
      categoryStats: categoryStatsRes.rows,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Get full task completion history
 * GET /api/stats/history
 */
router.get('/history', authenticateToken, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM task_history
       WHERE user_id = $1
       ORDER BY completed_at DESC
       LIMIT 50`,
      [req.user.id]
    );

    return res.json({ history: rows });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
