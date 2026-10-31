import { CppDeveloper } from './cpp-developer.js';
import { Developer } from './developer.interface.js';
import { FootballGame } from './football-game.js';
import { Game } from './game.interface.js';
import { JavaDeveloper } from './java-developer.js';
import { RacingGame } from './racing-game.js';

export class GameFactory {
  static createGame(type: string, developer: Developer = new JavaDeveloper()): Game {
    switch (type.toLowerCase()) {
      case 'racing':
        return new RacingGame(developer);
      case 'football':
        return new FootballGame(developer);
      default:
        throw new Error(`Unknown game type: ${type}`);
    }
  }
}
