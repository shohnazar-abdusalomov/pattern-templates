import { GameCharacter } from './game-character.js';
import { CharacterFactory } from './character-factory.js';

export class GameRunner {
  public static main(): void {
    const original = new GameCharacter(1, 'Warrior', 10, 'Sword');
    const factory = new CharacterFactory(original);

    const clone1 = factory.cloneCharacter();
    const clone2 = factory.cloneCharacter();

    clone1.id = 2;
    clone1.name = 'Archer';
    clone1.level = 15;
    clone1.weapon = 'Bow';

    clone2.id = 3;
    clone2.name = 'Mage';
    clone2.level = 20;
    clone2.weapon = 'Staff';

    console.log(original.toString());
    console.log(clone1.toString());
    console.log(clone2.toString());

    console.log(original == clone1);
    console.log(original === clone1);
    console.log(original == clone2);
    console.log(original === clone2);
    console.log(clone1 == clone2);
    console.log(clone1 === clone2);
    console.log(
      original.id === 1 &&
      original.name === 'Warrior' &&
      original.level === 10 &&
      original.weapon === 'Sword'
    );
  }
}

if (process.argv[1]?.includes('game-runner') || process.argv[1]?.includes('Prototype')) {
  GameRunner.main();
}
