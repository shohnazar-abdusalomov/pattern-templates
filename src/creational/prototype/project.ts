import { Copiable } from './copiable.interface.js';

export class Project implements Copiable<Project> {
  constructor(
    public id: number,
    public name: string,
    public description: string
  ) {}

  clone(): Project {
    return new Project(this.id, this.name, this.description);
  }

  toString(): string {
    return `Project(id=${this.id}, name='${this.name}', description='${this.description}')`;
  }
}
