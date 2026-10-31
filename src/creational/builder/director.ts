import { Website } from './website.js';
import { WebsiteBuilder } from './website-builder.js';

export class Director {
  private builder: WebsiteBuilder | null = null;

  setWebsite(builder: WebsiteBuilder): void {
    this.builder = builder;
  }

  buildWebsite(): Website | null {
    if (!this.builder) {
      console.log('Please set the Website builder first.');
      return null;
    }
    return this.builder
      .createWebsite()
      .buildName()
      .buildPrice()
      .buildCms()
      .website;
  }
}
