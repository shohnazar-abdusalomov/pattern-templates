import { Director } from './director.js';
import { EnterpriseWebsiteBuilder } from './enterprise-website-builder.js';
import { SimpleWebsiteBuilder } from './simple-website-builder.js';

export function runBuilderDemo(): void {
  console.log('=== Website Builder Pattern Demo ===');
  const director = new Director();

  director.setWebsite(new SimpleWebsiteBuilder());
  const simpleWebsite = director.buildWebsite();
  console.log('Built Simple Website:', simpleWebsite?.toString());

  director.setWebsite(new EnterpriseWebsiteBuilder());
  const enterpriseWebsite = director.buildWebsite();
  console.log('Built Enterprise Website:', enterpriseWebsite?.toString());
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runBuilderDemo();
}
