import { NiceHttpClient } from './nice-http-client.js';

export async function runBuilderHttpDemo(): Promise<void> {
  console.log('=== NiceHttpClient Builder Pattern Demo ===');
  const client = new NiceHttpClient.Builder('https://jsonplaceholder.typicode.com')
    .addHeader('User-Agent', 'PatternTemplatesClient/1.0')
    .connectionTimeout(5000)
    .readTimeout(5000)
    .retryOnConnectionFailure(true)
    .retryLimit(2)
    .build();

  console.log('Sending GET request to /posts/1...');
  const response = await client.get('/posts/1');

  if (response.isSuccess) {
    console.log('Success! Data:', response.data);
  } else {
    console.log('Error:', response.error.message);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runBuilderHttpDemo();
}
