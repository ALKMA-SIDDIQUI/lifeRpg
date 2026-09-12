process.env.NODE_ENV = 'test';
const assert = require('assert');
const http = require('http');
const { app } = require('../src/index');
const { pool } = require('../src/db/pool');

let server;
let port;
let baseUrl;

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(baseUrl + path);
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(
      url,
      {
        method,
        headers,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const json = data ? JSON.parse(data) : {};
            resolve({ status: res.statusCode, data: json });
          } catch (e) {
            resolve({ status: res.statusCode, text: data });
          }
        });
      }
    );

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

function uploadRequest(path, filename, buffer, mimeType, token = null) {
  return new Promise((resolve, reject) => {
    const boundary = '----WebKitFormBoundary' + Math.random().toString(16).slice(2);
    const url = new URL(baseUrl + path);

    const header = `--${boundary}\r\nContent-Disposition: form-data; name="avatar"; filename="${filename}"\r\nContent-Type: ${mimeType}\r\n\r\n`;
    const footer = `\r\n--${boundary}--\r\n`;

    const payload = Buffer.concat([
      Buffer.from(header, 'utf8'),
      buffer,
      Buffer.from(footer, 'utf8'),
    ]);

    const headers = {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': payload.length,
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(url, { method: 'POST', headers }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, text: data });
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting LIFE RPG Automated Test Suite...\n');

  server = app.listen(0);
  port = server.address().port;
  baseUrl = `http://localhost:${port}`;

  const testUser = {
    email: `tester_${Date.now()}@liferpg.dev`,
    username: `CyberWarrior_${Date.now().toString().slice(-4)}`,
    password: 'password123',
    avatar_class: 'cyber_knight',
  };

  let token = null;

  try {
    // 1. Health check
    console.log('1. Testing /api/health...');
    const health = await request('GET', '/api/health');
    assert.strictEqual(health.status, 200);
    assert.strictEqual(health.data.status, 'online');
    console.log('   ✓ Health check passed.\n');

    // 2. Registration
    console.log('2. Testing User Registration (/api/auth/register)...');
    const regRes = await request('POST', '/api/auth/register', testUser);
    assert.strictEqual(regRes.status, 201, `Expected 201, got ${regRes.status}: ${JSON.stringify(regRes.data)}`);
    assert.ok(regRes.data.token, 'Token must be present in registration response');
    assert.strictEqual(regRes.data.user.email, testUser.email);
    assert.strictEqual(regRes.data.character.level, 1);
    assert.strictEqual(regRes.data.character.total_xp, 0);
    assert.strictEqual(regRes.data.character.gold, 50);
    token = regRes.data.token;
    console.log('   ✓ User registered with initial Level 1 character & starter items.\n');

    // 3. Prevent duplicate registration
    console.log('3. Testing Duplicate Registration Prevention...');
    const dupRes = await request('POST', '/api/auth/register', testUser);
    assert.strictEqual(dupRes.status, 409);
    console.log('   ✓ Duplicate registration properly rejected.\n');

    // 4. Login
    console.log('4. Testing User Login (/api/auth/login)...');
    const loginRes = await request('POST', '/api/auth/login', {
      emailOrUsername: testUser.username,
      password: testUser.password,
    });
    assert.strictEqual(loginRes.status, 200);
    assert.ok(loginRes.data.token);
    console.log('   ✓ Login successful.\n');

    // 5. Auth Me
    console.log('5. Testing Session Verification (/api/auth/me)...');
    const meRes = await request('GET', '/api/auth/me', null, token);
    assert.strictEqual(meRes.status, 200);
    assert.strictEqual(meRes.data.character.name, testUser.username);
    console.log('   ✓ Current session verified.\n');

    // 6. Quest Creation
    console.log('6. Testing Quest Creation (/api/tasks)...');
    const quest1 = await request('POST', '/api/tasks', {
      title: 'Complete DSA Graph Traversal',
      description: 'Solve BFS and DFS algorithms on LeetCode',
      category: 'Coding',
      difficulty: 'HARD',
    }, token);
    assert.strictEqual(quest1.status, 201);
    assert.strictEqual(quest1.data.task.title, 'Complete DSA Graph Traversal');
    assert.strictEqual(quest1.data.task.xp_reward, 150);
    assert.strictEqual(quest1.data.task.attribute_reward, 'Intellect');
    const quest1Id = quest1.data.task.id;
    console.log('   ✓ Quest created with dynamic rewards.\n');

    // 7. Quest Listing & Filtering
    console.log('7. Testing Quest Listing (/api/tasks)...');
    const listRes = await request('GET', '/api/tasks?category=Coding', null, token);
    assert.strictEqual(listRes.status, 200);
    assert.ok(listRes.data.tasks.length >= 1);
    console.log('   ✓ Quest list and filter verified.\n');

    // 8. Quest Completion, Level Up & Non-linear progression
    console.log('8. Testing Quest Completion & Level-Up Event (/api/tasks/:id/complete)...');
    const compRes = await request('POST', `/api/tasks/${quest1Id}/complete`, null, token);
    assert.strictEqual(compRes.status, 200);
    assert.strictEqual(compRes.data.rewards.xp, 150);
    assert.strictEqual(compRes.data.levelUp.leveledUp, true);
    assert.strictEqual(compRes.data.levelUp.oldLevel, 1);
    assert.strictEqual(compRes.data.levelUp.newLevel, 2);
    assert.strictEqual(compRes.data.character.level, 2);
    assert.strictEqual(compRes.data.character.total_xp, 150);
    assert.strictEqual(compRes.data.streak.current_streak, 1);
    assert.strictEqual(compRes.data.character.intellect, 25);
    console.log(`   ✓ Leveled up to Level ${compRes.data.character.level}! New XP: ${compRes.data.character.total_xp}, Gold: ${compRes.data.character.gold}, Intellect: ${compRes.data.character.intellect}`);

    // 9. Prevent completing twice
    console.log('9. Testing Prevent Double Completion...');
    const compAgain = await request('POST', `/api/tasks/${quest1Id}/complete`, null, token);
    assert.strictEqual(compAgain.status, 400);
    console.log('   ✓ Duplicate completion prevented.\n');

    // 10. Shop Catalog
    console.log('10. Testing Shop Catalog (/api/shop/items)...');
    const shopRes = await request('GET', '/api/shop/items', null, token);
    assert.strictEqual(shopRes.status, 200);
    assert.ok(shopRes.data.items.length >= 10);
    console.log(`   ✓ Found ${shopRes.data.items.length} items in shop.\n`);

    // 11. Shop Purchase
    console.log('11. Testing Shop Purchase (/api/shop/buy)...');
    const buyRes = await request('POST', '/api/shop/buy', { item_key: 'abyssal_void' }, token);
    assert.strictEqual(buyRes.status, 201, `Purchase failed: ${JSON.stringify(buyRes.data)}`);
    assert.strictEqual(buyRes.data.character.gold, 125);
    console.log(`   ✓ Purchased 'Abyssal Void'! Gold remaining: ${buyRes.data.goldRemaining}\n`);

    // 12. Prevent duplicate purchase of unique item
    console.log('12. Testing Duplicate Purchase Prevention...');
    const dupBuy = await request('POST', '/api/shop/buy', { item_key: 'abyssal_void' }, token);
    assert.strictEqual(dupBuy.status, 400);
    console.log('   ✓ Duplicate purchase prohibited.\n');

    // 13. Inventory & Equip
    console.log('13. Testing Inventory & Equip Theme (/api/inventory & /api/character/equip)...');
    const invRes = await request('GET', '/api/inventory', null, token);
    assert.strictEqual(invRes.status, 200);
    const hasAbyssal = invRes.data.inventory.some((i) => i.item_key === 'abyssal_void');
    assert.ok(hasAbyssal, 'Inventory must contain newly purchased item');

    const equipRes = await request('PUT', '/api/character/equip', { item_key: 'abyssal_void' }, token);
    assert.strictEqual(equipRes.status, 200);
    assert.strictEqual(equipRes.data.character.equipped_theme, 'abyssal_void');
    console.log('   ✓ Successfully equipped Abyssal Void theme.\n');

    // 14. Dashboard Stats
    console.log('14. Testing Aggregated Dashboard (/api/stats/dashboard)...');
    const dashRes = await request('GET', '/api/stats/dashboard', null, token);
    assert.strictEqual(dashRes.status, 200);
    assert.strictEqual(dashRes.data.counts.completed, 1);
    assert.strictEqual(dashRes.data.recentActivity.length, 1);
    assert.strictEqual(dashRes.data.streak.current_streak, 1);
    console.log('   ✓ Dashboard stats verified.\n');

    // 15. User Avatar Upload
    console.log('15. Testing Profile Avatar Upload (/api/character/avatar)...');
    const validPngBuffer = Buffer.from(
      '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c63000100000500010d0a2db40000000049454e44ae426082',
      'hex'
    );
    const uploadRes = await uploadRequest(
      '/api/character/avatar',
      'avatar.png',
      validPngBuffer,
      'image/png',
      token
    );
    assert.strictEqual(uploadRes.status, 200, `Upload failed: ${JSON.stringify(uploadRes.data)}`);
    assert.ok(uploadRes.data.avatar_url, 'avatar_url must be returned');
    assert.ok(uploadRes.data.avatar_url.startsWith('/uploads/avatars/'));

    // Verify avatar persisted on character
    const charAfterUpload = await request('GET', '/api/character', null, token);
    assert.strictEqual(charAfterUpload.status, 200);
    assert.strictEqual(charAfterUpload.data.character.avatar_url, uploadRes.data.avatar_url);
    console.log(`   ✓ Avatar uploaded and persisted: ${uploadRes.data.avatar_url}\n`);

    // 16. Reject Invalid Image Format
    console.log('16. Testing Invalid Avatar Format Rejection...');
    const invalidBuffer = Buffer.from('plain text file not an image', 'utf8');
    const invalidUploadRes = await uploadRequest(
      '/api/character/avatar',
      'malicious.txt',
      invalidBuffer,
      'text/plain',
      token
    );
    assert.strictEqual(invalidUploadRes.status, 400);
    console.log('   ✓ Non-image file upload rejected with 400 Bad Request.\n');

    // 17. Remove Avatar
    console.log('17. Testing Avatar Removal (/api/character/avatar)...');
    const removeRes = await request('DELETE', '/api/character/avatar', null, token);
    assert.strictEqual(removeRes.status, 200);
    assert.strictEqual(removeRes.data.avatar_url, null);

    const charAfterRemove = await request('GET', '/api/character', null, token);
    assert.strictEqual(charAfterRemove.data.character.avatar_url, null);
    console.log('   ✓ Avatar removed successfully and reset to null in DB.\n');

    // 18. Security Isolation: Unauthenticated Avatar Mutation
    console.log('18. Testing Security Isolation for Avatar Endpoints...');
    const unauthUpload = await uploadRequest('/api/character/avatar', 'avatar.png', validPngBuffer, 'image/png', null);
    assert.strictEqual(unauthUpload.status, 401);
    const unauthDelete = await request('DELETE', '/api/character/avatar', null, null);
    assert.strictEqual(unauthDelete.status, 401);
    console.log('   ✓ Unauthenticated avatar mutations properly rejected with 401 Unauthorized.\n');

    console.log('🎉 ALL 18 AUTOMATED TESTS PASSED WITH ZERO REGRESSIONS! ⚔️\n');
    server.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed with error:', err);
    if (server) server.close();
    process.exit(1);
  }
}

runTests();
