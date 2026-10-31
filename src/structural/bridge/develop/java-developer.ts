import { Developer } from './developer.interface.js';

export class JavaDeveloper implements Developer {
  runTests(): void {
    console.log('Java developer is running tests');
  }

  writeCode(): void {
    console.log('Java developer is writing code : .java');
  }
}
