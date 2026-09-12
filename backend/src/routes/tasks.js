const express = require('express');
const { pool } = require('../db/pool');
const { authenticateToken } = require('../middleware/auth');
const { calculateProgression, checkLevelUp } = require('../engine/progression');
const { recordStreakActivity, getStreak } = require('../engine/streak');

const router = express.Router();

const DIFFICULTY_CONFIG = {
  EASY: { xp: 40, gold: 20, attr: 5 },
  MEDIUM: { xp: 80, gold: 40, attr: 8 },
  HARD: { xp: 150, gold: 75, attr: 15 },
  EPIC: { xp: 300, gold: 150, attr: 25 },
  LEGENDARY: { xp: 600, gold: 300, attr: 50 },
};

const CATEGORY_DEFAULT_ATTRIBUTE = {
  Coding: 'Intellect',
  Study: 'Wisdom',
  Fitness: 'Strength',
  Reading: 'Wisdom',
  Health: 'Vitality',
  Personal: 'Vitality',
  Other: 'Intellect',
};

/**
 * Get all tasks for the authenticated user
 * GET /api/tasks
 */
router.get('/', authenticateToken, async (req, res, next) => {
  const { status, category, difficulty, sort } = req.query;

  try {
    let queryText = 'SELECT * FROM tasks WHERE user_id = $1';
    const params = [req.user.id];
    let paramIndex = 2;

    if (status === 'active') {
      queryText += ` AND is_completed = false`;
    } else if (status === 'completed') {
      queryText += ` AND is_completed = true`;
    }

    if (category && category !== 'All') {
      queryText += ` AND category = $${paramIndex++}`;
      params.push(category);
    }

    if (difficulty && difficulty !== 'All') {
      queryText += ` AND difficulty = $${paramIndex++}`;
      params.push(difficulty.toUpperCase());
    }

    if (sort === 'xp_desc') {
      queryText += ' ORDER BY xp_reward DESC, id DESC';
    } else if (sort === 'gold_desc') {
      queryText += ' ORDER BY gold_reward DESC, id DESC';
    } else if (sort === 'due_date') {
      queryText += ' ORDER BY due_date ASC NULLS LAST, id DESC';
    } else {
      queryText += ' ORDER BY is_completed ASC, created_at DESC';
    }

    const { rows } = await pool.query(queryText, params);
    return res.json({ tasks: rows });
  } catch (err) {
    next(err);
  }
});

/**
 * Create a new task
 * POST /api/tasks
 */
router.post('/', authenticateToken, async (req, res, next) => {
  const {
    title,
    description = '',
    category = 'Other',
    difficulty = 'MEDIUM',
    attribute_reward,
    due_date = null,
  } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Quest title cannot be empty.' });
  }

  const diffUpper = (difficulty || 'MEDIUM').toUpperCase();
  const config = DIFFICULTY_CONFIG[diffUpper] || DIFFICULTY_CONFIG.MEDIUM;

  const xpReward = Math.max(10, req.body.xp_reward ? parseInt(req.body.xp_reward, 10) : config.xp);
  const goldReward = Math.max(5, req.body.gold_reward ? parseInt(req.body.gold_reward, 10) : config.gold);
  const targetAttribute = attribute_reward || CATEGORY_DEFAULT_ATTRIBUTE[category] || 'Intellect';
  const attributeAmount = Math.max(1, req.body.attribute_amount ? parseInt(req.body.attribute_amount, 10) : config.attr);

  try {
    const insertRes = await pool.query(
      `INSERT INTO tasks (
        user_id, title, description, category, difficulty,
        xp_reward, gold_reward, attribute_reward, attribute_amount,
        is_completed, due_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, false, $10)
      RETURNING *`,
      [
        req.user.id,
        title.trim(),
        description.trim(),
        category,
        diffUpper,
        xpReward,
        goldReward,
        targetAttribute,
        attributeAmount,
        due_date || null,
      ]
    );

    return res.status(201).json({
      message: 'New quest registered in your logbook!',
      task: insertRes.rows[0],
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Update an existing task
 * PUT /api/tasks/:id
 */
router.put('/:id', authenticateToken, async (req, res, next) => {
  const taskId = parseInt(req.params.id, 10);
  const { title, description, category, difficulty, due_date, attribute_reward } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Quest title cannot be empty.' });
  }

  try {
    const taskCheck = await pool.query(
      'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
      [taskId, req.user.id]
    );

    if (taskCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Quest not found or unauthorized.' });
    }

    const currentTask = taskCheck.rows[0];
    const diffUpper = (difficulty || currentTask.difficulty).toUpperCase();
    const config = DIFFICULTY_CONFIG[diffUpper] || DIFFICULTY_CONFIG.MEDIUM;

    const xpReward = req.body.xp_reward ? parseInt(req.body.xp_reward, 10) : config.xp;
    const goldReward = req.body.gold_reward ? parseInt(req.body.gold_reward, 10) : config.gold;
    const targetAttribute = attribute_reward || currentTask.attribute_reward;
    const attrAmount = req.body.attribute_amount ? parseInt(req.body.attribute_amount, 10) : config.attr;

    const updateRes = await pool.query(
      `UPDATE tasks SET
        title = $1,
        description = $2,
        category = $3,
        difficulty = $4,
        xp_reward = $5,
        gold_reward = $6,
        attribute_reward = $7,
        attribute_amount = $8,
        due_date = $9
       WHERE id = $10 AND user_id = $11
       RETURNING *`,
      [
        title.trim(),
        (description || '').trim(),
        category || currentTask.category,
        diffUpper,
        xpReward,
        goldReward,
        targetAttribute,
        attrAmount,
        due_date !== undefined ? due_date : currentTask.due_date,
        taskId,
        req.user.id,
      ]
    );

    return res.json({
      message: 'Quest updated.',
      task: updateRes.rows[0],
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Delete a task
 * DELETE /api/tasks/:id
 */
router.delete('/:id', authenticateToken, async (req, res, next) => {
  const taskId = parseInt(req.params.id, 10);

  try {
    const delRes = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
      [taskId, req.user.id]
    );

    if (delRes.rows.length === 0) {
      return res.status(404).json({ error: 'Quest not found or unauthorized.' });
    }

    return res.json({ message: 'Quest deleted from logbook.', id: taskId });
  } catch (err) {
    next(err);
  }
});

/**
 * Complete a task
 * POST /api/tasks/:id/complete
 * Awards XP, Gold, attributes, streak, history, checks level-up!
 */
router.post('/:id/complete', authenticateToken, async (req, res, next) => {
  const taskId = parseInt(req.params.id, 10);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Fetch task and ensure ownership & uncompleted status
    const taskRes = await client.query(
      'SELECT * FROM tasks WHERE id = $1 AND user_id = $2 FOR UPDATE',
      [taskId, req.user.id]
    );

    if (taskRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Quest not found or unauthorized.' });
    }

    const task = taskRes.rows[0];

    if (task.is_completed) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'This quest has already been completed!' });
    }

    // 2. Mark task completed
    const updatedTaskRes = await client.query(
      `UPDATE tasks SET is_completed = true, completed_at = NOW()
       WHERE id = $1 RETURNING *`,
      [taskId]
    );
    const updatedTask = updatedTaskRes.rows[0];

    // 3. Fetch current character stats
    const charRes = await client.query(
      'SELECT * FROM characters WHERE user_id = $1 FOR UPDATE',
      [req.user.id]
    );
    const character = charRes.rows[0];

    // 4. Calculate progression & level-up
    const oldXp = character.total_xp;
    const newXp = oldXp + task.xp_reward;
    const levelUpInfo = checkLevelUp(oldXp, newXp);

    // 5. Calculate attribute bonuses
    let newStrength = character.strength;
    let newIntellect = character.intellect;
    let newWisdom = character.wisdom;
    let newVitality = character.vitality;

    const attrType = (task.attribute_reward || 'Intellect').toLowerCase();
    const attrGain = task.attribute_amount || 5;

    if (attrType === 'strength') newStrength += attrGain;
    else if (attrType === 'intellect') newIntellect += attrGain;
    else if (attrType === 'wisdom') newWisdom += attrGain;
    else if (attrType === 'vitality') newVitality += attrGain;
    else newIntellect += attrGain; // fallback

    // If level-up occurred, award bonus vitality and gold
    let bonusGold = 0;
    if (levelUpInfo.leveledUp) {
      newVitality += (levelUpInfo.statBonus?.vitality || 5);
      bonusGold = (levelUpInfo.statBonus?.goldBonus || 100);
    }

    const newGold = character.gold + task.gold_reward + bonusGold;
    const newLevel = levelUpInfo.newLevel;

    // 6. Update character
    const updatedCharRes = await client.query(
      `UPDATE characters SET
        level = $1,
        total_xp = $2,
        gold = $3,
        strength = $4,
        intellect = $5,
        wisdom = $6,
        vitality = $7,
        updated_at = NOW()
       WHERE id = $8
       RETURNING *`,
      [
        newLevel,
        newXp,
        newGold,
        newStrength,
        newIntellect,
        newWisdom,
        newVitality,
        character.id,
      ]
    );
    const updatedChar = updatedCharRes.rows[0];

    // 7. Update streak
    const streakResult = await recordStreakActivity(client, req.user.id);

    // 8. Record in task_history
    await client.query(
      `INSERT INTO task_history (
        user_id, task_id, task_title, category, xp_earned, gold_earned, attribute_earned, attribute_amount
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        req.user.id,
        task.id,
        task.title,
        task.category,
        task.xp_reward,
        task.gold_reward,
        task.attribute_reward,
        task.attribute_amount,
      ]
    );

    await client.query('COMMIT');

    const progression = calculateProgression(updatedChar.total_xp);

    return res.json({
      message: levelUpInfo.leveledUp ? '🎉 QUEST COMPLETED & LEVEL UP!' : '⚔️ Quest completed!',
      task: updatedTask,
      rewards: {
        xp: task.xp_reward,
        gold: task.gold_reward + bonusGold,
        attribute: task.attribute_reward,
        attributeAmount: task.attribute_amount,
        bonusGold,
      },
      levelUp: levelUpInfo,
      streak: streakResult,
      character: {
        ...updatedChar,
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
