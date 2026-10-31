import { Database } from './database.interface.js';
import { JavaApplication } from './java-application.js';

export class DatabaseAdapter extends JavaApplication implements Database {
  insert(obj: unknown): boolean {
    console.log('Insert object...');
    super.insertObject(obj);
    return true;
  }

  update(obj: unknown): boolean {
    console.log('Update object...', obj);
    return true;
  }

  delete(obj: unknown): boolean {
    console.log('Delete object...', obj);
    return true;
  }

  get(obj: unknown): unknown {
    console.log('Get object...', obj);
    return obj;
  }
}
