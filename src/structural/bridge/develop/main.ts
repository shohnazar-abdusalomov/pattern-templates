import { JavaDeveloper } from './java-developer.js';
import { KotlinDeveloper } from './kotlin-developer.js';
import { Program } from './program.js';

export function runBridgeDevelopDemo(): void {
  console.log('=== Bridge Pattern (develop) Demo ===');
  const javaDeveloper = new JavaDeveloper();
  const kotlinDeveloper = new KotlinDeveloper();

  const javaProgram = new Program(javaDeveloper);
  const kotlinProgram = new Program(kotlinDeveloper);

  javaProgram.develop();
  console.log('=====================');
  kotlinProgram.develop();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runBridgeDevelopDemo();
}
