/**
 * DBConnection Singleton Pattern - Entry Point & Executable Demo
 */

import { DBConnection } from './db-connection.js';

export * from './db-connection.interface.js';
export * from './db-connection.js';

async function runSingletonDemo() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('       1. SINGLETON PATTERN: DATABASE CONNECTION DEMO      ');
  console.log('═══════════════════════════════════════════════════════════\n');

  console.log('--- 1. SINGLETON YAGONA NUSXA TEKSHIRUVI ---');
  // Ikki xil joydan getInstance chaqiriladi
  const dbInstance1 = DBConnection.getInstance({
    database: 'fintech_crm_db',
    host: 'db-cluster.aws.internal',
    port: 5432,
    user: 'db_admin',
  });

  const dbInstance2 = DBConnection.getInstance();

  console.log(`dbInstance1 ID: ${dbInstance1.getConnectionId()}`);
  console.log(`dbInstance2 ID: ${dbInstance2.getConnectionId()}`);

  const isIdentical = dbInstance1 === dbInstance2;
  console.log(`\nIkki o'zgaruvchi xotirada aynan bir xil obyektgami? -> ${isIdentical ? '✅ HA (Aynan bitta obyekt)' : '❌ YO\'Q'}`);

  console.log('\n--- 2. BAZA BILAN ULANI SH VA SO\'ROV YUBORISH ---');
  await dbInstance1.connect();

  console.log(`\nHozirgi ulanish holati: ${dbInstance1.getState()}`);
  console.log(`Baza konfiguratsiyasi:`, dbInstance1.getConfig());

  console.log('\n--- 3. SQL SO\'ROVLARINI AMALGA OSHIRISH ---');
  const users = await dbInstance1.query('SELECT * FROM users WHERE active = true;');
  console.log(`\nNatija [${users.command}] (${users.durationMs}ms):`);
  console.table(users.rows);

  console.log('\n--- 4. TRANZAKSIYA MOCK TESTI ---');
  await dbInstance1.transaction(async (trx) => {
    console.log('Tranzaksiya ichida yangi yozuv qo\'shilmoqda...');
    const insertResult = await trx.query('INSERT INTO audit_logs VALUES (?)', [{ event: 'USER_LOGIN' }]);
    console.log(`Audit log yozildi, Query ID: ${insertResult.queryId}`);
    return true;
  });

  console.log('\n--- 5. ULANI SH METRIKALARI ---');
  console.log(dbInstance1.getMetrics());

  console.log('\n--- 6. XAVFSIZ DISCONNECT ---');
  await dbInstance1.disconnect();
  console.log(`Yakuniy holat: ${dbInstance1.getState()}`);
}

// Fayl to'g'ridan-to'g'ri ishga tushirilganda demoni bajarish
if (process.argv[1]?.includes('DBConnection') || process.argv[1]?.includes('index')) {
  runSingletonDemo().catch(console.error);
}
