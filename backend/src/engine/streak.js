/**
 * Streak Calculation Engine
 * 
 * Accurately tracks daily streaks, consecutive days, missed days, and max streaks.
 */

function getDayDifference(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  d1.setUTCHours(0, 0, 0, 0);
  d2.setUTCHours(0, 0, 0, 0);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

function getTodayString() {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

/**
 * Updates or creates streak record on task completion
 * @param {Object} client - pg client or pool
 * @param {number} userId 
 * @returns {Promise<Object>} updated streak info
 */
async function recordStreakActivity(client, userId) {
  const today = getTodayString();
  const res = await client.query('SELECT * FROM streaks WHERE user_id = $1', [userId]);

  if (res.rows.length === 0) {
    const insertRes = await client.query(
      `INSERT INTO streaks (user_id, current_streak, max_streak, last_activity_date, updated_at)
       VALUES ($1, 1, 1, $2, NOW())
       RETURNING current_streak, max_streak, last_activity_date`,
      [userId, today]
    );
    return {
      current_streak: 1,
      max_streak: 1,
      streakIncreased: true,
      sameDay: false,
      streakReset: false,
    };
  }

  const streak = res.rows[0];
  const lastDate = streak.last_activity_date ? new Date(streak.last_activity_date).toISOString().split('T')[0] : null;

  if (!lastDate) {
    // First activity recorded
    await client.query(
      `UPDATE streaks SET current_streak = 1, max_streak = GREATEST(max_streak, 1), last_activity_date = $2, updated_at = NOW()
       WHERE user_id = $1`,
      [userId, today]
    );
    return { current_streak: 1, max_streak: Math.max(1, streak.max_streak), streakIncreased: true, sameDay: false };
  }

  const diffDays = getDayDifference(lastDate, today);

  if (diffDays === 0) {
    // Same day activity - maintain current streak
    return {
      current_streak: streak.current_streak,
      max_streak: streak.max_streak,
      streakIncreased: false,
      sameDay: true,
      streakReset: false,
    };
  } else if (diffDays === 1) {
    // Consecutive day activity!
    const newStreak = streak.current_streak + 1;
    const newMax = Math.max(newStreak, streak.max_streak);
    await client.query(
      `UPDATE streaks SET current_streak = $2, max_streak = $3, last_activity_date = $4, updated_at = NOW()
       WHERE user_id = $1`,
      [userId, newStreak, newMax, today]
    );
    return {
      current_streak: newStreak,
      max_streak: newMax,
      streakIncreased: true,
      sameDay: false,
      streakReset: false,
    };
  } else {
    // Missed 1 or more days - reset streak to 1
    await client.query(
      `UPDATE streaks SET current_streak = 1, last_activity_date = $2, updated_at = NOW()
       WHERE user_id = $1`,
      [userId, today]
    );
    return {
      current_streak: 1,
      max_streak: streak.max_streak,
      streakIncreased: true,
      sameDay: false,
      streakReset: true,
    };
  }
}

/**
 * Retrieves current streak state without modifying it
 */
async function getStreak(client, userId) {
  const res = await client.query('SELECT * FROM streaks WHERE user_id = $1', [userId]);
  if (res.rows.length === 0) {
    return { current_streak: 0, max_streak: 0, last_activity_date: null, is_active_today: false };
  }
  const streak = res.rows[0];
  const today = getTodayString();
  const lastDate = streak.last_activity_date ? new Date(streak.last_activity_date).toISOString().split('T')[0] : null;
  const is_active_today = lastDate === today;

  // If more than 1 day has elapsed since last activity, current streak is dormant/0 for display
  let displayStreak = streak.current_streak;
  if (lastDate && getDayDifference(lastDate, today) > 1) {
    displayStreak = 0;
  }

  return {
    current_streak: displayStreak,
    max_streak: streak.max_streak,
    last_activity_date: lastDate,
    is_active_today,
  };
}

module.exports = {
  recordStreakActivity,
  getStreak,
  getDayDifference,
};
