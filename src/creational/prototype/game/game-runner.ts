import { CharacterFactory } from './character-factory.js';
import { GameCharacter } from './game-character.js';

export function runGamePrototypeDemo(): void {
  console.log('=== Game Character Prototype Pattern Demo ===');
  const character = new GameCharacter('1', 'Player1', 1, 'AK-47', ['Health Potion', 'Grenade']);
  const characterFactory = new CharacterFactory(character);
  const character2 = characterFactory.cloneCharacter();

  console.log('Original inventory:', character.inventory);
  console.log('Cloned inventory:  ', character2.inventory);

  character.inventory.push('Sniper Rifle');
  console.log('\nAfter adding "Sniper Rifle" to original:');
  console.log('Original inventory:', character.inventory);
  console.log('Cloned inventory:  ', character2.inventory);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runGamePrototypeDemo();
}
