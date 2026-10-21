/**
 * DBConnection - Singleton Pattern Implementation
 * 
 * Ushbu sinf barcha ilovada yagona ma'lumotlar bazasi ulanishini (Single Instance)
 * ta'minlaydi. Xotira tejaladi, ortiqcha ulanishlar yaratilishi oldi olinadi
 * va ulanish holati markazlashgan holda boshqariladi.
 */

import {
  ConnectionState,
  DatabaseDriver,
  IDatabaseConfig,
  IDatabaseConnection,
  IDatabaseMetrics,
  IQueryResult,
} from './db-connection.interface.js';

export class DBConnection implements IDatabaseConnection {
  /**
   * Singleton yagona nusxasi
   */
  private static instance: DBConnection | null = null;

  /**
   * Standart sozlamalar
   */
  private static readonly DEFAULT_CONFIG: IDatabaseConfig = {
    host: 'localhost',
    port: 5432,
    database: 'production_db',
    user: 'postgres_admin',
    driver: 'postgres',
    ssl: true,
    maxPoolSize: 10,
    idleTimeoutMs: 30000,
    connectionTimeoutMs: 5000,
  };

  private readonly connectionId: string;
  private readonly config: IDatabaseConfig;
  private state: ConnectionState = 'DISCONNECTED';
  private totalQueries: number = 0;
  private failedQueries: number = 0;
  private activePool: number = 0;
  private connectedAt: number = 0;
  private lastQueryAt?: string;

  /**
   * Konstruktor private qilib cheklangan.
   * Tashqaridan 'new DBConnection()' orqali chaqirish taqiqlanadi!
   */
  private constructor(customConfig?: Partial<IDatabaseConfig>) {
    if (DBConnection.instance) {
      throw new Error(
        "Xatolik: DBConnection Singleton sinfi! Yangi obyekt yaratish uchun 'DBConnection.getInstance()' dan foydalaning."
      );
    }

    this.connectionId = `conn_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
    this.config = Object.freeze({
      ...DBConnection.DEFAULT_CONFIG,
      ...customConfig,
    });
  }

  /**
   * Singleton nusxasini olish uchun yagona global kirish nuqtasi.
   */
  public static getInstance(config?: Partial<IDatabaseConfig>): DBConnection {
    if (!DBConnection.instance) {
      DBConnection.instance = new DBConnection(config);
    }
    return DBConnection.instance;
  }

  /**
   * Hozirda Singleton nusxasi yaratilgan yoki yo'qligini tekshirish.
   */
  public static hasInstance(): boolean {
    return DBConnection.instance !== null;
  }

  /**
   * Testlar yoki ulanishni butunlay yangilash uchun Singletonni tozalash metodi.
   */
  public static async resetInstance(): Promise<void> {
    if (DBConnection.instance) {
      if (DBConnection.instance.state === 'CONNECTED') {
        await DBConnection.instance.disconnect();
      }
      DBConnection.instance = null;
    }
  }

  /**
   * Ma'lumotlar bazasiga ulanishni ochish.
   */
  public async connect(): Promise<void> {
    if (this.state === 'CONNECTED') {
      console.log(`ℹ️ [DBConnection] (${this.connectionId}) Ulanish allaqachon faol.`);
      return;
    }

    if (this.state === 'CONNECTING') {
      console.log(`⏳ [DBConnection] (${this.connectionId}) Ulanish jarayoni ketmoqda...`);
      return;
    }

    this.state = 'CONNECTING';
    const driverName = (this.config.driver || 'postgres').toUpperCase();
    console.log(
      `🔌 [DBConnection] ${driverName} bazasiga ulanish boshlandi: ` +
      `${this.config.user}@${this.config.host}:${this.config.port}/${this.config.database}`
    );

    // Tarmoq orqali ulanish kechikishini simulyatsiya qilish
    await new Promise((resolve) => setTimeout(resolve, 350));

    this.state = 'CONNECTED';
    this.connectedAt = Date.now();
    this.activePool = 1;
    console.log(`✅ [DBConnection] Muvaffaqiyatli ulandi! Connection ID: ${this.connectionId}`);
  }

  /**
   * Ulanishni xavfsiz yopish (Graceful Shutdown).
   */
  public async disconnect(): Promise<void> {
    if (this.state === 'DISCONNECTED') {
      return;
    }

    this.state = 'DISCONNECTING';
    console.log(`🔌 [DBConnection] (${this.connectionId}) Baza bilan aloqa uzilmoqda...`);

    await new Promise((resolve) => setTimeout(resolve, 150));

    this.state = 'DISCONNECTED';
    this.activePool = 0;
    console.log(`🛑 [DBConnection] (${this.connectionId}) Baza ulanishi muvaffaqiyatli yopildi.`);
  }

  /**
   * SQL so'rovlarini xavfsiz bajarish.
   */
  public async query<T = Record<string, any>>(
    sql: string,
    params: unknown[] = []
  ): Promise<IQueryResult<T>> {
    if (this.state !== 'CONNECTED') {
      throw new Error(
        `Baza bilan ulanish mavjud emas! Hozirgi holat: ${this.state}. Avval 'await db.connect()' qiling.`
      );
    }

    const startTime = Date.now();
    const queryId = `qry_${Math.random().toString(36).substring(2, 8)}`;
    this.activePool = Math.min(this.config.maxPoolSize || 10, this.activePool + 1);

    try {
      // Baza so'rovi kechikishi
      await new Promise((resolve) => setTimeout(resolve, 80));

      this.totalQueries++;
      this.lastQueryAt = new Date().toISOString();

      // Namuna ma'lumotlar qaytarish simulyatsiyasi
      const mockRows: any[] = this.generateMockRows(sql, params);
      const durationMs = Date.now() - startTime;

      return {
        command: sql.trim().split(' ')[0].toUpperCase(),
        rowCount: mockRows.length,
        rows: mockRows as T[],
        durationMs,
        queryId,
        timestamp: this.lastQueryAt,
      };
    } catch (error) {
      this.failedQueries++;
      throw error;
    } finally {
      this.activePool = Math.max(1, this.activePool - 1);
    }
  }

  /**
   * Atomik tranzaksiyani bajarish (BEGIN -> EXECUTE -> COMMIT yoki ROLLBACK).
   */
  public async transaction<T>(callback: (trx: IDatabaseConnection) => Promise<T>): Promise<T> {
    if (this.state !== 'CONNECTED') {
      await this.connect();
    }

    console.log(`🔄 [DBConnection] TRANZAKSIYA BOSHLANDI (BEGIN)`);
    try {
      const result = await callback(this);
      console.log(`💾 [DBConnection] TRANZAKSIYA YAKUNLANDI (COMMIT)`);
      return result;
    } catch (err: any) {
      console.error(`⚠️ [DBConnection] TRANZAKSIYA BEKOR QILINDI (ROLLBACK): ${err.message}`);
      throw err;
    }
  }

  public getState(): ConnectionState {
    return this.state;
  }

  public getConfig(): Readonly<IDatabaseConfig> {
    return this.config;
  }

  public getConnectionId(): string {
    return this.connectionId;
  }

  public getMetrics(): IDatabaseMetrics {
    const uptime = this.connectedAt > 0 ? Math.floor((Date.now() - this.connectedAt) / 1000) : 0;
    const idlePool = Math.max(0, (this.config.maxPoolSize || 10) - this.activePool);

    return {
      connectionId: this.connectionId,
      state: this.state,
      totalQueriesExecuted: this.totalQueries,
      failedQueries: this.failedQueries,
      activePoolConnections: this.activePool,
      idlePoolConnections: idlePool,
      uptimeSeconds: uptime,
      lastQueryTimestamp: this.lastQueryAt,
    };
  }

  private generateMockRows(sql: string, params: unknown[]): any[] {
    const cleanSql = sql.trim().toLowerCase();
    if (cleanSql.startsWith('select')) {
      return [
        { id: 1, name: 'Alice Smith', email: 'alice@company.com', role: 'ADMIN' },
        { id: 2, name: 'Bob Jones', email: 'bob@company.com', role: 'DEVELOPER' },
      ];
    }
    if (cleanSql.startsWith('insert')) {
      return [{ id: Math.floor(Math.random() * 1000) + 10, ...((params[0] as object) || {}) }];
    }
    return [{ affectedRows: 1 }];
  }
}
