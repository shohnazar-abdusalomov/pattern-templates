import { Developer } from './developer.interface.js';

export class BackendDeveloper implements Developer {
  readonly role: string = 'BACKEND';

  develop(): void {
    console.log('Backend developer is writing code : .java');
  }

  test(): void {
    console.log('Backend developer is running tests');
  }
}
