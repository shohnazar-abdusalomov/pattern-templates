import { DatabaseAdapter } from './database-adapter.js';
import { Database } from './database.interface.js';

export function runDatabaseAdapterDemo(): void {
  console.log('=== Database Adapter Pattern Demo ===');
  const db: Database = new DatabaseAdapter();
  db.insert({ id: 1, name: 'Record Alpha' });
  db.update({ id: 1, name: 'Record Alpha Updated' });
  db.get({ id: 1 });
  db.delete({ id: 1 });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runDatabaseAdapterDemo();
}
