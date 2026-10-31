import { BackendDeveloper } from './backend-developer.js';
import { FrontendDeveloper } from './frontend-developer.js';
import { Team } from './team.js';

export function runCompositeProjectDemo(): void {
  console.log('=== Composite Pattern (with_project) Demo ===');
  const team = new Team();
  const backendDeveloper = new BackendDeveloper();
  const frontendDeveloper = new FrontendDeveloper();

  team.addDeveloper(backendDeveloper);
  team.addDeveloper(frontendDeveloper);

  team.createProject();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runCompositeProjectDemo();
}
