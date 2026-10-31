import { DatabaseHelper } from './database-helper.js';
import { ProgrammingLogg } from './programming-logg.js';
import { TestObject } from './test-object.js';

export function runSingletonDemo(): void {
  console.log('=== Singleton Pattern Demo ===');
  const logg1 = ProgrammingLogg.getInstance();
  const logg2 = ProgrammingLogg.getInstance();

  logg1.showError('GG is wrong');
  logg2.log(`Same instance check: logg1 === logg2 is ${logg1 === logg2}`);

  const databaseHelper = DatabaseHelper.getInstance();
  databaseHelper.getData();
  databaseHelper.executeQuery('select * from instances limit 1');

  console.log('TestObject constant singleton:', TestObject);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runSingletonDemo();
}
