import { Document } from './document.js';
import { DocumentFactory } from './document-factory.js';

export function runDocumentPrototypeDemo(): void {
  console.log('=== Document Prototype Pattern Demo ===');
  const document = new Document(
    'My Document',
    'This is the content of my document.',
    'Something else',
    'Azamov',
    ['#doc', '#lifestyle']
  );

  const documentFactory = new DocumentFactory(document);
  const document2 = documentFactory.cloneDocument();

  document2.tags.push('#newTag');

  console.log('Cloned Document (modified tag):', document2.toString());
  console.log('Original Document (tag isolated):', document.toString());
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runDocumentPrototypeDemo();
}
