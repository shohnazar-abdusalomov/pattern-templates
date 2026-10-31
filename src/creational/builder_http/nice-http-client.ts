import {
  InvalidUrlError,
  NetworkError,
  NiceHttpError,
  ServerError,
  TimeoutError,
  UnknownError,
} from './custom-exceptions.js';
import { Resource } from './nice-response.js';
import { addParamsToUrl } from './utils.js';

export interface NiceHttpClientConfig {
  baseUrl: string;
  cookies?: Record<string, string>;
  headers?: Record<string, string>;
  connectionTimeout?: number;
  readTimeout?: number;
  writeTimeout?: number;
  cacheControl?: string;
  retryOnConnectionFailure?: boolean;
  retryLimit?: number;
}

export class NiceHttpClient {
  private readonly baseUrl: string;
  private readonly cookies: Map<string, string>;
  private readonly headers: Map<string, string>;
  private readonly connectionTimeout: number;
  private readonly readTimeout: number;
  private readonly writeTimeout: number;
  private readonly cacheControl: string;
  private readonly retryOnConnectionFailure: boolean;
  private readonly retryLimit: number;

  private constructor(config: {
    baseUrl: string;
    cookies: Map<string, string>;
    headers: Map<string, string>;
    connectionTimeout: number;
    readTimeout: number;
    writeTimeout: number;
    cacheControl: string;
    retryOnConnectionFailure: boolean;
    retryLimit: number;
  }) {
    this.baseUrl = config.baseUrl;
    this.cookies = new Map(config.cookies);
    this.headers = new Map(config.headers);
    this.connectionTimeout = config.connectionTimeout;
    this.readTimeout = config.readTimeout;
    this.writeTimeout = config.writeTimeout;
    this.cacheControl = config.cacheControl;
    this.retryOnConnectionFailure = config.retryOnConnectionFailure;
    this.retryLimit = config.retryLimit;
  }

  static get Builder(): typeof NiceHttpClientBuilder {
    return NiceHttpClientBuilder;
  }

  async get<T = any>(
    endpoint: string,
    queryParams: Record<string, string> = {},
    customHeaders: Record<string, string> = {}
  ): Promise<Resource<T>> {
    return this.executeRequest<T>('GET', endpoint, queryParams, customHeaders);
  }

  async post<T = any>(
    endpoint: string,
    queryParams: Record<string, string> = {},
    customHeaders: Record<string, string> = {},
    body?: any
  ): Promise<Resource<T>> {
    return this.executeRequest<T>('POST', endpoint, queryParams, customHeaders, body);
  }

  async postForm<T = any>(
    endpoint: string,
    queryParams: Record<string, string> = {},
    customHeaders: Record<string, string> = {},
    formData: Record<string, string> = {}
  ): Promise<Resource<T>> {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(formData)) {
      params.append(key, value);
    }
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      ...customHeaders,
    };
    return this.executeRequest<T>('POST', endpoint, queryParams, headers, params.toString());
  }

  private buildUrl(endpoint: string, queryParams: Record<string, string>): string {
    const cleanBase = this.baseUrl.replace(/\/+$/, '');
    const cleanEndpoint = endpoint.replace(/^\/+/, '');
    const fullUrl = cleanEndpoint ? `${cleanBase}/${cleanEndpoint}` : cleanBase;

    try {
      new URL(fullUrl);
    } catch {
      throw new InvalidUrlError(fullUrl);
    }

    return addParamsToUrl(fullUrl, queryParams);
  }

  private buildHeaders(customHeaders: Record<string, string>): Record<string, string> {
    const merged: Record<string, string> = {};

    for (const [k, v] of this.headers.entries()) {
      merged[k] = v;
    }
    for (const [k, v] of Object.entries(customHeaders)) {
      merged[k] = v;
    }

    if (this.cookies.size > 0) {
      const cookieEntries: string[] = [];
      for (const [k, v] of this.cookies.entries()) {
        cookieEntries.push(`${k}=${v}`);
      }
      merged['Cookie'] = cookieEntries.join('; ');
    }

    if (this.cacheControl) {
      merged['Cache-Control'] = this.cacheControl;
    }

    return merged;
  }

  private async executeRequest<T>(
    method: string,
    endpoint: string,
    queryParams: Record<string, string>,
    customHeaders: Record<string, string>,
    body?: any
  ): Promise<Resource<T>> {
    let targetUrl: string;
    try {
      targetUrl = this.buildUrl(endpoint, queryParams);
    } catch (e) {
      if (e instanceof NiceHttpError) {
        return Resource.error(e);
      }
      return Resource.error(new InvalidUrlError(endpoint));
    }

    const headers = this.buildHeaders(customHeaders);
    const maxAttempts =
      this.retryOnConnectionFailure && this.retryLimit > 0 ? this.retryLimit : 1;

    let lastError: NiceHttpError = new UnknownError();

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const timeoutMs = this.readTimeout || this.connectionTimeout || 10000;
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);

        let serializedBody: BodyInit | undefined = undefined;
        if (body !== undefined) {
          if (typeof body === 'string') {
            serializedBody = body;
          } else {
            if (!headers['Content-Type']) {
              headers['Content-Type'] = 'application/json';
            }
            serializedBody = JSON.stringify(body);
          }
        }

        const response = await fetch(targetUrl, {
          method,
          headers,
          body: serializedBody,
          signal: controller.signal,
        }).finally(() => clearTimeout(timer));

        const text = await response.text();

        if (response.ok) {
          let parsed: any;
          try {
            parsed = JSON.parse(text);
          } catch {
            parsed = text;
          }
          return Resource.success<T>(parsed as T);
        }

        lastError = new ServerError(
          response.status,
          text,
          `Unexpected response code ${response.status} | ${response.statusText}`
        );
      } catch (err: any) {
        if (err?.name === 'AbortError') {
          lastError = new TimeoutError(`Timeout error after ${this.readTimeout}ms`, err);
        } else if (err?.code === 'ENOTFOUND' || err?.code === 'ECONNREFUSED' || err instanceof TypeError) {
          lastError = new NetworkError(`Network error: ${err.message}`, err);
        } else if (err instanceof NiceHttpError) {
          lastError = err;
        } else {
          lastError = new UnknownError(err?.message || 'Something went wrong', err);
        }
      }

      if (attempt < maxAttempts) {
        console.log(`Attempt ${attempt} failed (${lastError.message}). Retrying...`);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    return Resource.error(lastError);
  }
}

export class NiceHttpClientBuilder {
  private _baseUrl = '';
  private readonly _cookies = new Map<string, string>();
  private readonly _headers = new Map<string, string>();
  private _connectionTimeout = 10000;
  private _readTimeout = 10000;
  private _writeTimeout = 10000;
  private _cacheControl = 'no-cache';
  private _retryOnConnectionFailure = true;
  private _retryLimit = 3;

  constructor(baseUrl?: string) {
    if (baseUrl) {
      this._baseUrl = baseUrl;
    }
  }

  baseUrl(url: string): this {
    this._baseUrl = url;
    return this;
  }

  cookies(cookies: Record<string, string>): this {
    this._cookies.clear();
    for (const [k, v] of Object.entries(cookies)) {
      this._cookies.set(k, v);
    }
    return this;
  }

  headers(headers: Record<string, string>): this {
    this._headers.clear();
    for (const [k, v] of Object.entries(headers)) {
      this._headers.set(k, v);
    }
    return this;
  }

  addHeader(name: string, value: string): this {
    this._headers.set(name, value);
    return this;
  }

  connectionTimeout(timeout: number): this {
    this._connectionTimeout = timeout;
    return this;
  }

  readTimeout(timeout: number): this {
    this._readTimeout = timeout;
    return this;
  }

  writeTimeout(timeout: number): this {
    this._writeTimeout = timeout;
    return this;
  }

  cacheControl(cacheControl: string): this {
    this._cacheControl = cacheControl;
    return this;
  }

  retryOnConnectionFailure(retry: boolean): this {
    this._retryOnConnectionFailure = retry;
    return this;
  }

  retryLimit(limit: number): this {
    this._retryLimit = limit;
    return this;
  }

  build(): NiceHttpClient {
    if (!this._baseUrl) {
      throw new InvalidUrlError('Base URL must be provided');
    }
    return new (NiceHttpClient as any)({
      baseUrl: this._baseUrl,
      cookies: this._cookies,
      headers: this._headers,
      connectionTimeout: this._connectionTimeout,
      readTimeout: this._readTimeout,
      writeTimeout: this._writeTimeout,
      cacheControl: this._cacheControl,
      retryOnConnectionFailure: this._retryOnConnectionFailure,
      retryLimit: this._retryLimit,
    });
  }
}
