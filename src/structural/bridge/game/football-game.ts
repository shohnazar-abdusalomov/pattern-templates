import { Developer } from './developer.interface.js';
import { Game } from './game.interface.js';

export class FootballGame implements Game {
  constructor(public readonly developer: Developer) {}

  developGame(): void {
    console.log('-----------');
    console.log(`Developing Football Game... using ${this.developer.constructor.name}`);
    this.developer.writeCode();
    this.developer.runTests();
  }
}
