import { Document } from './document.js';
import { DocumentFactory } from './document-factory.js';

export class DocumentRunner {
  public static main(): void {
    const original = new Document(
      1,
      'Design Patterns Overview',
      'Architectural templates for software engineering.',
      'Erich Gamma',
      ['gof', 'patterns', 'oop']
    );

    const factory = new DocumentFactory(original);

    const clone1 = factory.cloneDocument();
    const clone2 = factory.cloneDocument();

    clone1.id = 2;
    clone1.title = 'Prototype Pattern in Practice';
    clone1.content = 'Deep copying objects using copy constructors.';
    clone1.tags.push('creational');

    clone2.id = 3;
    clone2.title = 'Structural Adapter Guide';
    clone2.content = 'Adapting legacy interfaces without modifications.';
    clone2.tags.push('structural');

    console.log(original.toString());
    console.log(clone1.toString());
    console.log(clone2.toString());

    console.log(original == clone1);
    console.log(original === clone1);
    console.log(original == clone2);
    console.log(original === clone2);
    console.log(clone1 == clone2);
    console.log(clone1 === clone2);

    console.log(original.tags !== clone1.tags);
    console.log(original.tags !== clone2.tags);
    console.log(clone1.tags !== clone2.tags);

    console.log(
      original.id === 1 &&
      original.title === 'Design Patterns Overview' &&
      original.content === 'Architectural templates for software engineering.' &&
      original.author === 'Erich Gamma' &&
      original.tags.length === 3
    );
  }
}

if (process.argv[1]?.includes('document-runner')) {
  DocumentRunner.main();
}
