import { Developer } from './developer.interface.js';

export class KotlinDeveloper implements Developer {
  runTests(): void {
    console.log('Kotlin developer is running tests');
  }

  writeCode(): void {
    console.log('Kotlin developer is writing code : .kotlin');
  }
}
