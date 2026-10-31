import { Cms } from './cms.enum.js';
import { WebsiteBuilder } from './website-builder.js';

export class SimpleWebsiteBuilder extends WebsiteBuilder {
  buildName(): this {
    this.website?.setName('Simple Website Builder');
    return this;
  }

  buildCms(): this {
    this.website?.setCms(Cms.TILDA);
    return this;
  }

  buildPrice(): this {
    this.website?.setPrice(500);
    return this;
  }
}
