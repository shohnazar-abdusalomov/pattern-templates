import { runCompositeProjectDemo } from './project.js';

export function runMain(): void {
  runCompositeProjectDemo();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runMain();
}
