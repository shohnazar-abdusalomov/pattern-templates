import { Copyable } from './copyable.interface.js';

export class GameCharacter implements Copyable<GameCharacter> {
  constructor(
    public id: string,
    public name: string,
    public level: number,
    public weapon: string,
    public readonly inventory: string[]
  ) {}

  clone(): GameCharacter {
    return new GameCharacter(this.id, this.name, this.level, this.weapon, [...this.inventory]);
  }

  toString(): string {
    return `GameCharacter(id='${this.id}', name='${this.name}', level=${this.level}, weapon='${this.weapon}', inventory=[${this.inventory.join(', ')}])`;
  }
}
