import { Developer } from './developer.interface.js';

export class FrontendDeveloper implements Developer {
  readonly role: string = 'FRONTEND';

  develop(): void {
    console.log('Frontend developer is writing code : .js');
  }

  test(): void {
    console.log('Frontend developer is running tests');
  }
}
