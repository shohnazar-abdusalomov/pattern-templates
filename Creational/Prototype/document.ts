import { Copyable } from './copyable.interface.js';

export class Document implements Copyable<Document> {
  private _id: number;
  private _title: string;
  private _content: string;
  private _author: string;
  private _tags: string[];

  constructor(source: Document);
  constructor(id: number, title: string, content: string, author: string, tags: string[]);
  constructor(
    idOrSource: number | Document,
    title?: string,
    content?: string,
    author?: string,
    tags?: string[]
  ) {
    if (typeof idOrSource === 'object') {
      this._id = idOrSource._id;
      this._title = idOrSource._title;
      this._content = idOrSource._content;
      this._author = idOrSource._author;
      this._tags = [...idOrSource._tags];
    } else {
      this._id = idOrSource;
      this._title = title!;
      this._content = content!;
      this._author = author!;
      this._tags = tags ? [...tags] : [];
    }
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  get content(): string {
    return this._content;
  }

  set content(value: string) {
    this._content = value;
  }

  get author(): string {
    return this._author;
  }

  set author(value: string) {
    this._author = value;
  }

  get tags(): string[] {
    return this._tags;
  }

  set tags(value: string[]) {
    this._tags = [...value];
  }

  clone(): Document {
    return new Document(this);
  }

  toString(): string {
    return `Document { id: ${this._id}, title: '${this._title}', content: '${this._content}', author: '${this._author}', tags: [${this._tags.map((t) => `'${t}'`).join(', ')}] }`;
  }
}
