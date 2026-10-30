import { Document } from './document.js';

export class DocumentFactory {
  private prototype: Document;

  constructor(prototype: Document) {
    this.prototype = prototype;
  }

  setDocument(prototype: Document): void {
    this.prototype = prototype;
  }

  cloneDocument(): Document {
    return this.prototype.clone();
  }
}
