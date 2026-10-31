import { Document } from './document.js';

export class DocumentFactory {
  constructor(private document: Document) {}

  setDocument(document: Document): void {
    this.document = document;
  }

  cloneDocument(): Document {
    return this.document.clone();
  }
}
