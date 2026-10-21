/**
 * 4. HttpClient Builder Pattern Core Implementation
 * Extracted and modularized from http-client-builder.ts
 */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

export interface HttpResponse<T = any> {
  readonly status: number;
  readonly statusText: string;
  readonly headers: Record<string, string>;
  readonly data: T;
  readonly durationMs: number;
}

export interface RetryConfig {
  readonly maxRetries: number;
  readonly delayMs: number;
  readonly backoffFactor: number;
}

// Custom Exception Hierarchy
export class HttpClientException extends Error {
  public readonly timestamp: string;
  public readonly url: string;
  public readonly method: HttpMethod;

  constructor(message: string, url: string, method: HttpMethod) {
    super(`[${method}] ${url} -> ${message}`);
    this.name = 'HttpClientException';
    this.timestamp = new Date().toISOString();
    this.url = url;
    this.method = method;
  }
}

export class HttpTimeoutException extends HttpClientException {
  public readonly timeoutMs: number;

  constructor(url: string, method: HttpMethod, timeoutMs: number) {
    super(`So'rov vaqti tugadi (${timeoutMs}ms kutildi)`, url, method);
    this.name = 'HttpTimeoutException';
    this.timeoutMs = timeoutMs;
  }
}

export class HttpStatusException extends HttpClientException {
  public readonly status: number;
  public readonly statusText: string;
  public readonly responseBody: any;

  constructor(
    url: string,
    method: HttpMethod,
    status: number,
    statusText: string,
    responseBody: any
  ) {
    super(`HTTP xatolik ${status} (${statusText}): ${JSON.stringify(responseBody)}`, url, method);
    this.name = 'HttpStatusException';
    this.status = status;
    this.statusText = statusText;
    this.responseBody = responseBody;
  }
}

export class HttpNetworkException extends HttpClientException {
  public readonly originalError: Error;

  constructor(url: string, method: HttpMethod, originalError: Error) {
    super(`Tarmoq xatosi: ${originalError.message}`, url, method);
    this.name = 'HttpNetworkException';
    this.originalError = originalError;
  }
}

/**
 * Immutable HttpRequest (Builder tomonidan yig'ilgan so'rov obyekti)
 */
export class HttpRequest {
  public readonly url: string;
  public readonly method: HttpMethod;
  public readonly headers: Readonly<Record<string, string>>;
  public readonly queryParams: Readonly<Record<string, string>>;
  public readonly body?: string;
  public readonly timeoutMs: number;
  public readonly isSecure: boolean;
  public readonly retryConfig: RetryConfig;

  constructor(builder: HttpClientBuilder) {
    this.url = builder.url;
    this.method = builder.method;
    this.headers = Object.freeze({ ...builder.headers });
    this.queryParams = Object.freeze({ ...builder.queryParams });
    this.body = builder.body;
    this.timeoutMs = builder.timeoutMs;
    this.isSecure = builder.isSecure;
    this.retryConfig = Object.freeze({ ...builder.retryConfig });
  }

  public getFullUrl(): string {
    const keys = Object.keys(this.queryParams);
    if (keys.length === 0) return this.url;

    const query = keys
      .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(this.queryParams[k])}`)
      .join('&');

    return this.url.includes('?') ? `${this.url}&${query}` : `${this.url}?${query}`;
  }

  public async execute<T = any>(): Promise<HttpResponse<T>> {
    let lastError: Error | null = null;
    const fullUrl = this.getFullUrl();

    for (let attempt = 1; attempt <= this.retryConfig.maxRetries; attempt++) {
      const startTime = Date.now();
      const controller = new AbortController();
      const timerId = setTimeout(() => controller.abort(), this.timeoutMs);

      try {
        const response = await fetch(fullUrl, {
          method: this.method,
          headers: this.headers,
          body: this.body,
          signal: controller.signal,
        });

        clearTimeout(timerId);
        const durationMs = Date.now() - startTime;

        let data: any = null;
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          data = await response.json();
        } else {
          data = await response.text();
        }

        if (!response.ok) {
          const statusEx = new HttpStatusException(
            fullUrl,
            this.method,
            response.status,
            response.statusText,
            data
          );

          // 4xx xatolar (429 dan tashqari) mijoz xatosi hisoblanadi, ularni qayta urinish (retry) ma'nosiz
          if (response.status >= 400 && response.status < 500 && response.status !== 429) {
            throw statusEx;
          }

          lastError = statusEx;
        } else {
          const respHeaders: Record<string, string> = {};
          response.headers.forEach((val, key) => {
            respHeaders[key] = val;
          });

          return {
            status: response.status,
            statusText: response.statusText,
            headers: respHeaders,
            data: data as T,
            durationMs,
          };
        }
      } catch (err: any) {
        clearTimeout(timerId);

        if (err instanceof HttpStatusException) {
          lastError = err;
          if (err.status >= 400 && err.status < 500 && err.status !== 429) {
            throw err;
          }
        } else if (err.name === 'AbortError') {
          lastError = new HttpTimeoutException(fullUrl, this.method, this.timeoutMs);
        } else {
          lastError = new HttpNetworkException(fullUrl, this.method, err);
        }
      }

      if (attempt < this.retryConfig.maxRetries) {
        const waitTime = this.retryConfig.delayMs * Math.pow(this.retryConfig.backoffFactor, attempt - 1);
        console.warn(`[Retry #${attempt}] ${this.method} ${fullUrl} xatolik. ${waitTime}ms dan keyin qayta urinilmoqda...`);
        await new Promise((res) => setTimeout(res, waitTime));
      }
    }

    throw lastError!;
  }
}

/**
 * Fluent HttpClient Builder
 */
export class HttpClientBuilder {
  public url: string = '';
  public method: HttpMethod = 'GET';
  public headers: Record<string, string> = {
    'User-Agent': 'Optimal-TS-HttpClient/1.0',
    'Accept': 'application/json',
  };
  public queryParams: Record<string, string> = {};
  public body?: string;
  public timeoutMs: number = 5000;
  public isSecure: boolean = false;
  public retryConfig: RetryConfig = {
    maxRetries: 1,
    delayMs: 300,
    backoffFactor: 2,
  };

  constructor(url?: string, method: HttpMethod = 'GET') {
    if (url) this.url = url;
    this.method = method;
  }

  public setURL(url: string): this {
    this.url = url.trim();
    return this;
  }

  public setMethod(method: HttpMethod): this {
    this.method = method;
    return this;
  }

  public setHeader(key: string, value: string): this {
    if (key && value != null) {
      this.headers[key] = value;
    }
    return this;
  }

  public setHeaders(headers: Record<string, string>): this {
    if (headers && typeof headers === 'object') {
      Object.assign(this.headers, headers);
    }
    return this;
  }

  public setBody(body: any): this {
    if (typeof body === 'object' && body !== null) {
      this.body = JSON.stringify(body);
      this.setHeader('Content-Type', 'application/json');
    } else if (body != null) {
      this.body = String(body);
    }
    return this;
  }

  public setBodies(...bodies: (Record<string, any> | string)[]): this {
    if (bodies.length === 0) return this;

    if (bodies.every((b) => typeof b === 'object' && b !== null)) {
      const merged = Object.assign({}, ...bodies);
      return this.setBody(merged);
    }

    return this.setBody(bodies.map(String).join('\n'));
  }

  public setQueryParam(key: string, value: string | number | boolean): this {
    if (key && value != null) {
      this.queryParams[key] = String(value);
    }
    return this;
  }

  public setQueryParams(params: Record<string, string | number | boolean>): this {
    if (params) {
      for (const [key, val] of Object.entries(params)) {
        if (val != null) {
          this.queryParams[key] = String(val);
        }
      }
    }
    return this;
  }

  public secure(enabled: boolean = true): this {
    this.isSecure = enabled;
    if (enabled && this.url.startsWith('http://')) {
      this.url = this.url.replace(/^http:\/\//i, 'https://');
    }
    return this;
  }

  public secures(enabled: boolean = true): this {
    return this.secure(enabled);
  }

  public setBearerAuth(token: string): this {
    if (!token) throw new Error("Bearer token bo'sh bo'lishi mumkin emas!");
    return this.setHeader('Authorization', `Bearer ${token}`);
  }

  public setBasicAuth(username: string, password: string): this {
    const credentials = Buffer.from(`${username}:${password}`).toString('base64');
    return this.setHeader('Authorization', `Basic ${credentials}`);
  }

  public setApiKey(key: string, headerName: string = 'X-API-Key'): this {
    return this.setHeader(headerName, key);
  }

  public setTimeout(timeoutMs: number): this {
    if (timeoutMs <= 0) throw new Error("Timeout musbat son bo'lishi kerak!");
    this.timeoutMs = timeoutMs;
    return this;
  }

  public setRetry(maxRetries: number, delayMs: number = 400, backoffFactor: number = 2): this {
    this.retryConfig = {
      maxRetries: Math.max(1, maxRetries),
      delayMs: Math.max(0, delayMs),
      backoffFactor: Math.max(1, backoffFactor),
    };
    return this;
  }

  public setRetries(maxRetries: number, delayMs: number = 400, backoffFactor: number = 2): this {
    return this.setRetry(maxRetries, delayMs, backoffFactor);
  }

  public build(): HttpRequest {
    if (!this.url) {
      throw new Error("URL manzili ko'rsatilishi shart!");
    }

    if (!this.url.startsWith('http://') && !this.url.startsWith('https://')) {
      throw new Error(`Noto'g'ri protokol! URL http:// yoki https:// bilan boshlanishi kerak: ${this.url}`);
    }

    if (this.isSecure && !this.url.startsWith('https://')) {
      throw new Error(`Xavfsizlik talabi (secure) faol: URL albatta https:// bo'lishi kerak! Berilgan: ${this.url}`);
    }

    if ((this.method === 'GET' || this.method === 'HEAD') && this.body) {
      throw new Error(`${this.method} so'rovida body yuborish HTTP standartiga to'g'ri kelmaydi!`);
    }

    return new HttpRequest(this);
  }
}

/**
 * HttpClient Facade
 */
export class HttpClient {
  public static builder(url?: string, method: HttpMethod = 'GET'): HttpClientBuilder {
    return new HttpClientBuilder(url, method);
  }

  public static get(url: string): HttpClientBuilder {
    return new HttpClientBuilder(url, 'GET');
  }

  public static post(url: string): HttpClientBuilder {
    return new HttpClientBuilder(url, 'POST');
  }

  public static put(url: string): HttpClientBuilder {
    return new HttpClientBuilder(url, 'PUT');
  }

  public static patch(url: string): HttpClientBuilder {
    return new HttpClientBuilder(url, 'PATCH');
  }

  public static delete(url: string): HttpClientBuilder {
    return new HttpClientBuilder(url, 'DELETE');
  }
}

function runHttpClientBuilderDemo() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('         4. BUILDER PATTERN: HTTP CLIENT BUILDER DEMO      ');
  console.log('═══════════════════════════════════════════════════════════\n');

  const request = HttpClient.post('https://api.example.com/v1/orders')
    .secure(true)
    .setHeader('Accept-Language', 'uz-UZ')
    .setApiKey('secret_api_key_xyz987')
    .setQueryParams({ sandbox: true, currency: 'USD' })
    .setBody({
      orderId: 'ORD-9021',
      totalAmount: 450.0,
      items: ['Keyboard', 'Monitor'],
    })
    .setTimeout(4000)
    .setRetries(2, 500, 2)
    .build();

  console.log('✅ HttpRequest obyekti Builder orqali muvaffaqiyatli qurildi:');
  console.log(`• Full URL   : ${request.getFullUrl()}`);
  console.log(`• HTTP Method: ${request.method}`);
  console.log(`• Timeout    : ${request.timeoutMs}ms`);
  console.log(`• Headers    :`, request.headers);
  console.log(`• Body       : ${request.body}`);
  console.log(`• RetryConfig:`, request.retryConfig);
}

if (process.argv[1]?.includes('4-http-client-builder') || process.argv[1]?.endsWith('http-client-builder.ts')) {
  runHttpClientBuilderDemo();
}
