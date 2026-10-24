import { Copyable } from './copyable.interface.js';

export class GameCharacter implements Copyable<GameCharacter> {
  private _id: number;
  private _name: string;
  private _level: number;
  private _weapon: string;

  constructor(id: number, name: string, level: number, weapon: string) {
    this._id = id;
    this._name = name;
    this._level = level;
    this._weapon = weapon;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get level(): number {
    return this._level;
  }

  set level(value: number) {
    this._level = value;
  }

  get weapon(): string {
    return this._weapon;
  }

  set weapon(value: string) {
    this._weapon = value;
  }

  clone(): GameCharacter {
    const data = structuredClone({
      id: this._id,
      name: this._name,
      level: this._level,
      weapon: this._weapon,
    });
    return new GameCharacter(data.id, data.name, data.level, data.weapon);
  }

  toString(): string {
    return `GameCharacter { id: ${this._id}, name: '${this._name}', level: ${this._level}, weapon: '${this._weapon}' }`;
  }
}
