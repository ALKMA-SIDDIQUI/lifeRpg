const { pool } = require('./pool');
const { runMigrations } = require('./migrate');
require('dotenv').config();

async function testConnection() {
  console.log('==============================================');
  console.log('⚡ LIFE RPG — Database Connection Diagnostics');
  console.log('==============================================');

  const rawUrl = process.env.DATABASE_URL || '';
  // Mask password for security
  const maskedUrl = rawUrl.replace(/:([^:@]+)@/, ':****@');
  console.log(`Target Connection: ${maskedUrl || 'DEFAULT (Localhost:5433)'}`);

  const isSupabase = rawUrl.includes('supabase.co') || rawUrl.includes('supabase.com') || rawUrl.includes('pooler.supabase');
  console.log(`Target Type: ${isSupabase ? '☁️ Supabase Cloud Managed PostgreSQL' : '🖥️ Local PostgreSQL'}`);

  try {
    console.log('\n[1/3] Testing handshake & authentication...');
    const result = await pool.query('SELECT NOW() as db_time, current_database() as db_name, version() as pg_version');
    console.log('✅ Connection established successfully!');
    console.log(`   Database Name : ${result.rows[0].db_name}`);
    console.log(`   Server Time   : ${result.rows[0].db_time}`);
    console.log(`   PG Version    : ${result.rows[0].pg_version.split('on')[0]}`);

    console.log('\n[2/3] Running migrations (creating tables & seeding items)...');
    await runMigrations();
    console.log('✅ Migrations & seed data verified on database!');

    console.log('\n[3/3] Inspecting table status...');
    const tablesRes = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    const tableNames = tablesRes.rows.map(r => r.table_name);
    console.log(`✅ Public tables present (${tableNames.length}):`, tableNames.join(', '));

    const itemsCountRes = await pool.query('SELECT COUNT(*) as count FROM items');
    console.log(`✅ Default shop catalog items loaded: ${itemsCountRes.rows[0].count} items`);

    console.log('\n🎉 ALL CHECKS PASSED: Database is ready for LIFE RPG production & development!');
    console.log('==============================================');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ DATABASE CONNECTION FAILED:');
    console.error(err.message);
    if (err.code) console.error(`Error Code: ${err.code}`);

    if (err.message.includes('password authentication failed')) {
      console.error('\n👉 Tip: Please verify your Supabase database password in DATABASE_URL.');
    } else if (err.message.includes('ENOTFOUND') || err.message.includes('getaddrinfo')) {
      console.error('\n👉 Tip: The database host could not be resolved. Check project reference or internet connection.');
    } else if (err.message.includes('timeout')) {
      console.error('\n👉 Tip: Connection timed out. Make sure your network allows connecting to Supabase on port 5432 or 6543 (Pooler).');
    }
    console.log('==============================================');
    process.exit(1);
  }
}

testConnection();
