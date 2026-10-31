import { Copyable } from './copyable.interface.js';

export class Document implements Copyable<Document> {
  constructor(
    public id: string,
    public title: string,
    public content: string,
    public author: string,
    public tags: string[] = []
  ) {}

  clone(): Document {
    const clonedTags = [...this.tags];
    return new Document(this.id, this.title, this.content, this.author, clonedTags);
  }

  toString(): string {
    return `Document(id='${this.id}', title='${this.title}', content='${this.content}', author='${this.author}', tags=[${this.tags.join(', ')}])`;
  }
}
