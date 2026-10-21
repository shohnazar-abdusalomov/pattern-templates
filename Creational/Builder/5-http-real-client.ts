/**
 * 5. HttpClient Real Client Demonstration
 * Real API so'rovlari (JSONPlaceholder) orqali Builder pattern imkoniyatlarini sinash.
 */

import { HttpClient } from './4-http-client-builder.js';

interface IPost {
  userId: number;
  id?: number;
  title: string;
  body: string;
}

interface IUser {
  id: number;
  name: string;
  username: string;
  email: string;
}

async function runRealClientDemo() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('       5. BUILDER PATTERN: REAL HTTP CLIENT DEMO           ');
  console.log('═══════════════════════════════════════════════════════════\n');

  // --- 1. REAL GET SO'ROV (Query param + Header + Secures + Bearer Token) ---
  console.log('--- 1. REAL GET SO\'ROV (https://jsonplaceholder.typicode.com/posts/1) ---');
  try {
    const getRequest = HttpClient.get('http://jsonplaceholder.typicode.com/posts/1')
      .secures(true) // Avtomatik http:// ni https:// ga almashtiradi
      .setHeader('Accept-Language', 'uz-UZ')
      .setHeaders({
        'X-Client-App': 'AntigravityApp',
        'X-Environment': 'Production',
      })
      .setQueryParams({
        format: 'json',
        version: 2,
      })
      .setBearerAuth('secret_bearer_token_999')
      .setTimeout(6000)
      .build();

    console.log(`Qurilgan so'rov manzili: ${getRequest.getFullUrl()}`);
    console.log(`So'rov sarlavhalari (Headers):`, getRequest.headers);

    const response = await getRequest.execute<IPost>();
    console.log(`\n✅ GET Javob muvaffaqiyatli: ${response.status} ${response.statusText} (${response.durationMs}ms)`);
    console.log(`Server javob ma'lumoti:`, response.data);
  } catch (err: any) {
    console.error('❌ GET Xatolik:', err.message);
  }

  // --- 2. REAL POST SO'ROV (setBodies orqali bir nechta obyektni birlashtirish) ---
  console.log('\n--- 2. REAL POST SO\'ROV (setBodies orqali merge qilingan body) ---');
  try {
    const postRequest = HttpClient.post('https://jsonplaceholder.typicode.com/posts')
      .setHeaders({
        'Custom-Header-A': 'ValueA',
        'Custom-Header-B': 'ValueB',
      })
      .setBodies(
        { title: 'Builder Pattern in TypeScript' },
        { body: 'Xotiraga tejamkor, oson kengaytiriladigan va real loyihalarga mos HTTP Client' },
        { userId: 42 }
      )
      .setTimeout(6000)
      .build();

    console.log(`Yuborilayotgan tana (Body):`, postRequest.body);

    const postResponse = await postRequest.execute<IPost>();
    console.log(`\n✅ POST Javob muvaffaqiyatli: ${postResponse.status} ${postResponse.statusText} (${postResponse.durationMs}ms)`);
    console.log(`Yaratilgan yangi resurs:`, postResponse.data);
  } catch (err: any) {
    console.error('❌ POST Xatolik:', err.message);
  }

  // --- 3. REAL GET USERS RO'YXATI ---
  console.log('\n--- 3. REAL GET (Foydalanuvchilar ro\'yxati) ---');
  try {
    const usersRequest = HttpClient.get('https://jsonplaceholder.typicode.com/users')
      .setQueryParam('_limit', 3)
      .setTimeout(5000)
      .build();

    const usersResponse = await usersRequest.execute<IUser[]>();
    console.log(`✅ Olingan foydalanuvchilar soni: ${usersResponse.data.length}`);
    console.table(usersResponse.data.map(u => ({ id: u.id, name: u.name, email: u.email })));
  } catch (err: any) {
    console.error('❌ Users so\'rovi xatosi:', err.message);
  }
}

if (process.argv[1]?.includes('5-http-real-client') || process.argv[1]?.includes('real')) {
  runRealClientDemo().catch(console.error);
}
