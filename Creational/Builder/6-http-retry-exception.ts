/**
 * 6. HttpClient + Retry Strategy & Custom Exception Handling
 * 
 * Ushbu modulda quyidagilar namoyish etiladi:
 * 1. Tipga asoslangan xususiy istisnolar (Custom Exceptions: Timeout, Status, Network)
 * 2. Exponential Backoff algoritmi asosida qayta urinish (Retry Strategy)
 * 3. 4xx va 5xx xatoliklar o'rtasidagi farqli strategiyalar (Fail-fast vs Retry)
 */

import {
  HttpClient,
  HttpClientException,
  HttpNetworkException,
  HttpStatusException,
  HttpTimeoutException,
} from './4-http-client-builder.js';

export {
  HttpClientException,
  HttpNetworkException,
  HttpStatusException,
  HttpTimeoutException,
};

async function runRetryAndExceptionDemo() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('   6. BUILDER PATTERN: RETRY STRATEGY & CUSTOM EXCEPTIONS  ');
  console.log('═══════════════════════════════════════════════════════════\n');

  // --- 1. SINOV: 503 SERVICE UNAVAILABLE + EXPONENTIAL RETRY (3 ta urinish) ---
  console.log('--- 1. SINOV: 503 SERVER XATOSI + RETRY (3 ta urinish va Exponential Backoff) ---');
  try {
    const retryRequest = HttpClient.get('https://httpstat.us/503')
      .setTimeout(3000)
      .setRetries(3, 400, 2) // 3 marta urinish: 400ms, 800ms
      .build();

    console.log(`URL: ${retryRequest.getFullUrl()}`);
    console.log(`Retry konfiguratsiyasi:`, retryRequest.retryConfig);

    await retryRequest.execute();
  } catch (err: any) {
    if (err instanceof HttpStatusException) {
      console.log(`\n🎯 HttpStatusException ushlandi (Retry urinishlaridan so'ng):`);
      console.log(`• Status kodi    : ${err.status} (${err.statusText})`);
      console.log(`• URL            : ${err.url}`);
      console.log(`• Method         : ${err.method}`);
      console.log(`• Vaqt           : ${err.timestamp}`);
      console.log(`• Xatolik xabari : ${err.message}`);
    } else if (err instanceof HttpNetworkException) {
      console.log(`\n🎯 Tarmoq / Server xatosi ushlandi (3 ta Retry urinishlaridan so'ng):`);
      console.log(`• Asl sabab      : ${err.originalError?.message || err.message}`);
      console.log(`• URL            : ${err.url}`);
    } else {
      console.error('Kutilmagan xatolik:', err);
    }
  }

  // --- 2. SINOV: TIMEOUT EXCEPTION (Kutish vaqti chegarasidan oshganda) ---
  console.log('\n--- 2. SINOV: TIMEOUT EXCEPTION (AbortController bilan 80ms cheklov) ---');
  try {
    const timeoutRequest = HttpClient.get('https://jsonplaceholder.typicode.com/posts')
      .setTimeout(80) // Ataylab juda kam vaqt beriladi (80ms)
      .setRetries(1)  // Retry qilinmasin
      .build();

    await timeoutRequest.execute();
  } catch (err: any) {
    if (err instanceof HttpTimeoutException) {
      console.log(`\n🎯 HttpTimeoutException ushlandi:`);
      console.log(`• Berilgan timeout : ${err.timeoutMs}ms`);
      console.log(`• Xato nomi        : ${err.name}`);
      console.log(`• Xatolik xabari   : ${err.message}`);
    } else {
      console.log(`Boshqa xato: ${err.name} - ${err.message}`);
    }
  }

  // --- 3. SINOV: 404 NOT FOUND (Fail-Fast: 4xx xatolar retry qilinmaydi) ---
  console.log('\n--- 3. SINOV: 404 CLIENT ERROR (Fail-fast prinsipi: Retry qilmasdan darhol to\'xtash) ---');
  try {
    const clientErrorRequest = HttpClient.get('https://jsonplaceholder.typicode.com/non-existing-endpoint-404')
      .setRetries(4, 500, 2) // Retries 4 ta berilsa ham, 404 da behuda qayta so'rov yuborilmaydi!
      .build();

    await clientErrorRequest.execute();
  } catch (err: any) {
    if (err instanceof HttpStatusException) {
      console.log(`\n🎯 Fail-Fast ishladi: ${err.status} xatosida qayta urinishlar darhol bekor qilindi!`);
      console.log(`• Resurs topilmadi: ${err.url}`);
    } else {
      console.log(`Xato: ${err.message}`);
    }
  }

  // --- 4. SINOV: TARMOQ XATOSI (Network Failure / Invalid Hostname) ---
  console.log('\n--- 4. SINOV: NETWORK EXCEPTION (Mavjud bo\'lmagan domen / DNS xatosi) ---');
  try {
    const networkFailRequest = HttpClient.get('https://invalid-non-existent-domain-12345.xyz/api')
      .setTimeout(2000)
      .setRetries(2, 300, 1.5)
      .build();

    await networkFailRequest.execute();
  } catch (err: any) {
    if (err instanceof HttpNetworkException) {
      console.log(`\n🎯 HttpNetworkException ushlandi:`);
      console.log(`• Asl xatolik sababi: ${err.originalError?.message || err.message}`);
      console.log(`• URL               : ${err.url}`);
    } else {
      console.log(`Xato: ${err.message}`);
    }
  }
}

if (process.argv[1]?.includes('6-http-retry-exception') || process.argv[1]?.includes('retry')) {
  runRetryAndExceptionDemo().catch(console.error);
}
