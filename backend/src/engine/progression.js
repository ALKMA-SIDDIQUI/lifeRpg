/**
 * Non-Linear RPG Progression Engine
 * 
 * Each level requires progressively more XP according to quadratic progression:
 * XP_step(L) = 25 * L^2 + 75 * L
 * 
 * Level 1 -> 100 XP required to reach Level 2
 * Level 2 -> 250 XP required to reach Level 3
 * Level 3 -> 450 XP required to reach Level 4
 * Level 4 -> 700 XP required to reach Level 5
 * Level 5 -> 1000 XP required to reach Level 6
 */

/**
 * Returns the XP required to advance from level L to level L + 1
 * @param {number} level - Current level (>= 1)
 * @returns {number} XP required for this level step
 */
function getXpForLevelStep(level) {
  const l = Math.max(1, Math.floor(level));
  return 25 * (l * l) + 75 * l;
}

/**
 * Precomputes cumulative XP thresholds up to level 100
 */
const MAX_LEVEL = 100;
const cumulativeThresholds = [0]; // Index 1 is level 1 start (0 XP)

for (let i = 1; i <= MAX_LEVEL; i++) {
  const step = getXpForLevelStep(i);
  cumulativeThresholds[i] = cumulativeThresholds[i - 1] + step;
}

/**
 * Calculates complete progression state from total lifetime XP
 * @param {number} totalXp - Total lifetime XP accumulated
 * @returns {Object} progression state
 */
function calculateProgression(totalXp) {
  const xp = Math.max(0, Math.floor(totalXp || 0));
  
  let level = 1;
  while (level < MAX_LEVEL && xp >= cumulativeThresholds[level]) {
    level++;
  }

  const levelStartXp = cumulativeThresholds[level - 1];
  const nextLevelThreshold = cumulativeThresholds[level];
  const currentLevelXp = xp - levelStartXp;
  const nextLevelXpRequired = nextLevelThreshold - levelStartXp;
  const xpRemaining = Math.max(0, nextLevelXpRequired - currentLevelXp);
  const progressPercentage = Math.min(100, Math.max(0, (currentLevelXp / nextLevelXpRequired) * 100));

  return {
    level,
    totalXp: xp,
    currentLevelXp,
    nextLevelXpRequired,
    xpRemaining,
    progressPercentage: Math.round(progressPercentage * 10) / 10,
    cumulativeStart: levelStartXp,
    cumulativeNext: nextLevelThreshold,
  };
}

/**
 * Detects if a level-up occurred between two XP amounts
 * @param {number} oldTotalXp 
 * @param {number} newTotalXp 
 * @returns {Object} level-up event details
 */
function checkLevelUp(oldTotalXp, newTotalXp) {
  const oldProg = calculateProgression(oldTotalXp);
  const newProg = calculateProgression(newTotalXp);

  const leveledUp = newProg.level > oldProg.level;
  const levelsGained = newProg.level - oldProg.level;

  return {
    leveledUp,
    oldLevel: oldProg.level,
    newLevel: newProg.level,
    levelsGained: Math.max(0, levelsGained),
    oldProg,
    newProg,
    statBonus: leveledUp ? {
      vitality: levelsGained * 5,
      goldBonus: levelsGained * 100,
    } : null,
  };
}

module.exports = {
  getXpForLevelStep,
  calculateProgression,
  checkLevelUp,
  MAX_LEVEL,
};
