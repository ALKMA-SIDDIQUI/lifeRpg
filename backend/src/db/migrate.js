const fs = require('fs');
const path = require('path');
const { pool } = require('./pool');

const defaultItems = [
  // Relics
  {
    item_key: 'cyber_katana',
    name: 'Cyber Katana',
    description: 'A razor-sharp thermal blade pulsing with overclocked plasma energy.',
    category: 'relic',
    price: 120,
    icon: 'Sword',
    rarity: 'RARE',
    attribute_bonus: JSON.stringify({ strength: 12 }),
    visual_effect: 'laser_edge'
  },
  {
    item_key: 'quantum_grimoire',
    name: 'Quantum Grimoire',
    description: 'Encrypted ancient formulas compiled into a holographic neural codex.',
    category: 'relic',
    price: 150,
    icon: 'BookOpen',
    rarity: 'EPIC',
    attribute_bonus: JSON.stringify({ intellect: 15 }),
    visual_effect: 'hologram_aura'
  },
  {
    item_key: 'chronos_hourglass',
    name: 'Chronos Hourglass',
    description: 'Distorts temporal dilation to maintain peak deep-work focus.',
    category: 'relic',
    price: 180,
    icon: 'Hourglass',
    rarity: 'EPIC',
    attribute_bonus: JSON.stringify({ wisdom: 14 }),
    visual_effect: 'time_warp'
  },
  {
    item_key: 'titan_exosuit',
    name: 'Titan Core Aegis',
    description: 'Reinforced hydraulic carbon plating that bolsters extreme endurance.',
    category: 'relic',
    price: 220,
    icon: 'Shield',
    rarity: 'LEGENDARY',
    attribute_bonus: JSON.stringify({ vitality: 20 }),
    visual_effect: 'shield_pulse'
  },
  {
    item_key: 'infinity_circuit',
    name: 'Infinity Neuro-Matrix',
    description: 'Ultimate cybernetic transcendence unit harmonizing all disciplines.',
    category: 'relic',
    price: 500,
    icon: 'Cpu',
    rarity: 'MYTHIC',
    attribute_bonus: JSON.stringify({ strength: 20, intellect: 20, wisdom: 20, vitality: 20 }),
    visual_effect: 'cosmic_storm'
  },

  // Companions
  {
    item_key: 'cyber_phoenix',
    name: 'Cyber Phoenix',
    description: 'A digital familiar born from burning neon embers that revives your focus.',
    category: 'companion',
    price: 250,
    icon: 'Flame',
    rarity: 'EPIC',
    attribute_bonus: JSON.stringify({ vitality: 10 }),
    visual_effect: 'ember_trail'
  },
  {
    item_key: 'robo_owl',
    name: 'Synapse Owl',
    description: 'A cybernetic aerial scout that sharpens clarity and retention.',
    category: 'companion',
    price: 200,
    icon: 'Eye',
    rarity: 'RARE',
    attribute_bonus: JSON.stringify({ wisdom: 10 }),
    visual_effect: 'radar_ping'
  },
  {
    item_key: 'neon_hound',
    name: 'Volt Wolf',
    description: 'A loyal bio-mechanical hound crackling with kinetic electricity.',
    category: 'companion',
    price: 220,
    icon: 'Zap',
    rarity: 'RARE',
    attribute_bonus: JSON.stringify({ strength: 10 }),
    visual_effect: 'spark_pulse'
  },

  // Themes
  {
    item_key: 'cyber_neon',
    name: 'Cyber Neon (Default)',
    description: 'High-contrast electric cyan and deep obsidian cyber aesthetics.',
    category: 'theme',
    price: 0,
    icon: 'Palette',
    rarity: 'COMMON',
    attribute_bonus: JSON.stringify({}),
    visual_effect: 'theme_cyber_neon'
  },
  {
    item_key: 'abyssal_void',
    name: 'Abyssal Void',
    description: 'Dark obsidian with ominous bioluminescent ultraviolet glow.',
    category: 'theme',
    price: 100,
    icon: 'Moon',
    rarity: 'RARE',
    attribute_bonus: JSON.stringify({}),
    visual_effect: 'theme_abyssal_void'
  },
  {
    item_key: 'solar_flare',
    name: 'Solar Flare',
    description: 'Radiant ember orange and molten gold cyber aesthetics.',
    category: 'theme',
    price: 150,
    icon: 'Sun',
    rarity: 'EPIC',
    attribute_bonus: JSON.stringify({}),
    visual_effect: 'theme_solar_flare'
  },
  {
    item_key: 'emerald_matrix',
    name: 'Emerald Matrix',
    description: 'Terminal green phosphor radiance reminiscent of vintage cyberdecks.',
    category: 'theme',
    price: 120,
    icon: 'Terminal',
    rarity: 'RARE',
    attribute_bonus: JSON.stringify({}),
    visual_effect: 'theme_emerald_matrix'
  },

  // Badges
  {
    item_key: 'novice_adventurer',
    name: 'Novice Adventurer',
    description: 'Awarded to all warriors who dare to take the first step.',
    category: 'badge',
    price: 0,
    icon: 'Award',
    rarity: 'COMMON',
    attribute_bonus: JSON.stringify({}),
    visual_effect: 'badge_novice'
  },
  {
    item_key: 'code_sorcerer',
    name: 'Code Sorcerer',
    description: 'Master of algorithms, debugging, and computational logic.',
    category: 'badge',
    price: 80,
    icon: 'Code',
    rarity: 'RARE',
    attribute_bonus: JSON.stringify({ intellect: 5 }),
    visual_effect: 'badge_coder'
  },
  {
    item_key: 'iron_lifter',
    name: 'Iron Lifter',
    description: 'Forged through unrelenting discipline in physical exertion.',
    category: 'badge',
    price: 80,
    icon: 'Dumbbell',
    rarity: 'RARE',
    attribute_bonus: JSON.stringify({ strength: 5 }),
    visual_effect: 'badge_lifter'
  },
  {
    item_key: 'infinite_scholar',
    name: 'Infinite Scholar',
    description: 'A persistent reader who gathers wisdom day after day.',
    category: 'badge',
    price: 80,
    icon: 'Book',
    rarity: 'RARE',
    attribute_bonus: JSON.stringify({ wisdom: 5 }),
    visual_effect: 'badge_scholar'
  },
  {
    item_key: 'streak_titan',
    name: 'Streak Titan',
    description: 'Unstoppable daily momentum across weeks of consistency.',
    category: 'badge',
    price: 160,
    icon: 'Flame',
    rarity: 'EPIC',
    attribute_bonus: JSON.stringify({ vitality: 8 }),
    visual_effect: 'badge_titan'
  }
];

async function runMigrations() {
  console.log('[Migration] Starting database migration...');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await client.query(schemaSql);
    await client.query('ALTER TABLE characters ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT NULL;');
    console.log('[Migration] Schema tables, columns, and indexes verified.');

    // Seed default items
    for (const item of defaultItems) {
      await client.query(
        `INSERT INTO items (item_key, name, description, category, price, icon, rarity, attribute_bonus, visual_effect)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (item_key) DO UPDATE SET
           name = EXCLUDED.name,
           description = EXCLUDED.description,
           category = EXCLUDED.category,
           price = EXCLUDED.price,
           icon = EXCLUDED.icon,
           rarity = EXCLUDED.rarity,
           attribute_bonus = EXCLUDED.attribute_bonus,
           visual_effect = EXCLUDED.visual_effect`,
        [
          item.item_key,
          item.name,
          item.description,
          item.category,
          item.price,
          item.icon,
          item.rarity,
          item.attribute_bonus,
          item.visual_effect
        ]
      );
    }
    console.log(`[Migration] Successfully seeded/verified ${defaultItems.length} shop items.`);

    await client.query('COMMIT');
    console.log('[Migration] Database migration completed successfully.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[Migration] Failed to run migration:', err);
    throw err;
  } finally {
    client.release();
  }
}

if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { runMigrations };
