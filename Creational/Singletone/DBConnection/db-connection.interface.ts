/**
 * Database Connection Singleton Pattern - Interfaces & Types
 * Creational Design Patterns Showcase
 */

export type DatabaseDriver = 'postgres' | 'mysql' | 'mongodb' | 'sqlite';

export type ConnectionState = 
  | 'DISCONNECTED' 
  | 'CONNECTING' 
  | 'CONNECTED' 
  | 'DISCONNECTING' 
  | 'ERROR';

export interface IDatabaseConfig {
  readonly host: string;
  readonly port: number;
  readonly database: string;
  readonly user: string;
  readonly password?: string;
  readonly ssl?: boolean;
  readonly maxPoolSize?: number;
  readonly idleTimeoutMs?: number;
  readonly connectionTimeoutMs?: number;
  readonly driver?: DatabaseDriver;
}

export interface IQueryResult<T = Record<string, any>> {
  readonly command: string;
  readonly rowCount: number;
  readonly rows: T[];
  readonly durationMs: number;
  readonly queryId: string;
  readonly timestamp: string;
}

export interface IDatabaseMetrics {
  readonly connectionId: string;
  readonly state: ConnectionState;
  readonly totalQueriesExecuted: number;
  readonly failedQueries: number;
  readonly activePoolConnections: number;
  readonly idlePoolConnections: number;
  readonly uptimeSeconds: number;
  readonly lastQueryTimestamp?: string;
}

export interface IDatabaseConnection {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  query<T = Record<string, any>>(sql: string, params?: unknown[]): Promise<IQueryResult<T>>;
  transaction<T>(callback: (trx: IDatabaseConnection) => Promise<T>): Promise<T>;
  getState(): ConnectionState;
  getConfig(): Readonly<IDatabaseConfig>;
  getConnectionId(): string;
  getMetrics(): IDatabaseMetrics;
}
