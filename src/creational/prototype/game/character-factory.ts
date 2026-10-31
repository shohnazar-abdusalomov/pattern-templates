import { GameCharacter } from './game-character.js';

export class CharacterFactory {
  constructor(private character: GameCharacter) {}

  setCharacter(character: GameCharacter): void {
    this.character = character;
  }

  cloneCharacter(): GameCharacter {
    return this.character.clone();
  }
}
