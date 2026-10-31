import { Developer } from './developer.interface.js';

export class Team {
  private readonly developers: Developer[] = [];

  addDeveloper(developer: Developer): void {
    this.developers.push(developer);
  }

  removeDeveloper(developer: Developer): void {
    const index = this.developers.indexOf(developer);
    if (index !== -1) {
      this.developers.splice(index, 1);
    }
  }

  getDeveloperCount(): number {
    return this.developers.length;
  }

  createProject(): void {
    console.log(`Creating project with ${this.developers.length} developers`);
    for (const developer of this.developers) {
      console.log('----------------------');
      developer.develop();
      developer.test();
      console.log('----------------------');
    }
  }
}
