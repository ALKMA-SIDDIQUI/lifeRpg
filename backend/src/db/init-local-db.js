const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const pgBinDir = 'C:\\Program Files\\PostgreSQL\\18\\bin';
const dataDir = path.resolve(__dirname, '../../local_pg_data');
const port = process.env.PGPORT || 5433;
const dbName = process.env.PGDATABASE || 'liferpg';

async function initAndStartLocalDb() {
  console.log(`[Local DB] Ensuring local PostgreSQL cluster on port ${port}...`);

  const initdbExe = path.join(pgBinDir, 'initdb.exe');
  const pgctlExe = path.join(pgBinDir, 'pg_ctl.exe');
  const psqlExe = path.join(pgBinDir, 'psql.exe');

  if (!fs.existsSync(initdbExe)) {
    console.warn(`[Local DB] PostgreSQL binary not found at ${pgBinDir}. Using external DATABASE_URL.`);
    return;
  }

  // 1. Initialize cluster if data dir doesn't exist
  if (!fs.existsSync(dataDir)) {
    console.log(`[Local DB] Initializing cluster at ${dataDir}...`);
    try {
      execSync(`"${initdbExe}" -D "${dataDir}" -U postgres -A trust --encoding=UTF8`, { stdio: 'inherit' });
      console.log('[Local DB] Cluster initialized.');
    } catch (e) {
      console.error('[Local DB] Failed to initdb:', e.message);
      return;
    }
  }

  // 2. Start cluster if not already running
  try {
    const logFile = path.resolve(__dirname, '../../local_pg.log');
    console.log(`[Local DB] Starting PostgreSQL on port ${port}...`);
    execSync(`"${pgctlExe}" -D "${dataDir}" -o "-p ${port}" -l "${logFile}" start`, { stdio: 'inherit' });
    console.log(`[Local DB] PostgreSQL started on port ${port}.`);
  } catch (e) {
    // If already running, pg_ctl might exit with message, which is fine
    console.log('[Local DB] Server startup status checked.');
  }

  // 3. Create database if not exists
  try {
    execSync(`"${psqlExe}" -U postgres -p ${port} -h localhost -c "CREATE DATABASE ${dbName};"`, { stdio: 'pipe' });
    console.log(`[Local DB] Database "${dbName}" created.`);
  } catch (e) {
    // Already exists
    console.log(`[Local DB] Database "${dbName}" ready.`);
  }
}

if (require.main === module) {
  initAndStartLocalDb()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { initAndStartLocalDb };
