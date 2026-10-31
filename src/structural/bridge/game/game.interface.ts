import { Developer } from './developer.interface.js';

export interface Game {
  readonly developer: Developer;
  developGame(): void;
}
