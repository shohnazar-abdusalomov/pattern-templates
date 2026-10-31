import { Developer } from './developer.interface.js';

export class Program {
  constructor(private readonly developer: Developer) {}

  develop(): void {
    console.log(`Starting development with ${this.developer.constructor.name}`);
    this.developer.runTests();
    console.log('---------------------');
    this.developer.writeCode();
  }
}
