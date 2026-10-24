import { GameCharacter } from './game-character.js';

export class CharacterFactory {
  private prototype: GameCharacter;

  constructor(prototype: GameCharacter) {
    this.prototype = prototype;
  }

  setCharacter(prototype: GameCharacter): void {
    this.prototype = prototype;
  }

  cloneCharacter(): GameCharacter {
    return this.prototype.clone();
  }
}
