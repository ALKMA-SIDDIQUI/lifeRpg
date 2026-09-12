const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
require('dotenv').config();

const { pool } = require('./db/pool');
const { runMigrations } = require('./db/migrate');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const characterRoutes = require('./routes/character');
const shopRoutes = require('./routes/shop');
const inventoryRoutes = require('./routes/inventory');
const statsRoutes = require('./routes/stats');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  process.env.CLIENT_ORIGIN,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (e.g. mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive for local dev
    },
    credentials: true,
  })
);

const path = require('path');
const fs = require('fs');

const uploadsDir = process.env.VERCEL
  ? path.join('/tmp', 'uploads')
  : path.join(__dirname, '../uploads');
const avatarsDir = path.join(uploadsDir, 'avatars');
try {
  if (!fs.existsSync(avatarsDir)) {
    fs.mkdirSync(avatarsDir, { recursive: true });
  }
} catch (err) {
  console.warn('[Storage] Upload directory note:', err.message);
}



app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(uploadsDir));
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as time, version() as version');
    res.json({
      status: 'online',
      service: 'Life RPG Backend Engine',
      dbTime: result.rows[0].time,
      pgVersion: result.rows[0].version,
    });
  } catch (err) {
    res.status(503).json({ status: 'database_unavailable', error: err.message });
  }
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/character', characterRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/stats', statsRoutes);

// Error Handler
app.use(errorHandler);

// Server bootstrap
async function startServer() {
  try {
    console.log('[Server] Connecting to PostgreSQL database...');
    // Test DB connection
    await pool.query('SELECT 1');
    console.log('[Server] Database connection verified.');

    // Run migrations & seeds
    await runMigrations();

    const server = app.listen(PORT, () => {
      console.log(`⚔️ LIFE RPG Engine listening on port ${PORT}`);
      console.log(`🎮 API endpoint: http://localhost:${PORT}/api`);
    });

    return server;
  } catch (err) {
    console.error('[Server] Startup failed:', err.message);
    console.log('[Server] You may need to run "npm run db:init" or check your DATABASE_URL in .env');
    // Still listen so health endpoint can report status
    const server = app.listen(PORT, () => {
      console.log(`⚠️ Server running in degraded mode on port ${PORT}. Database connection pending.`);
    });
    return server;
  }
}

if ((require.main === module || !process.env.VERCEL) && process.env.NODE_ENV !== 'test') {
  startServer();
}


app.app = app;
app.startServer = startServer;
module.exports = app;

