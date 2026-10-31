import { CppDeveloper } from './cpp-developer.js';
import { GameFactory } from './game-factory.js';

export function runBridgeGameDemo(): void {
  console.log('=== Bridge Pattern (game) Demo ===');
  const racingGame = GameFactory.createGame('racing');
  const footballGame = GameFactory.createGame('football', new CppDeveloper());

  footballGame.developGame();
  racingGame.developGame();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runBridgeGameDemo();
}
