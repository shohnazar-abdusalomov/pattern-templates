import { Cms } from './cms.enum.js';
import { WebsiteBuilder } from './website-builder.js';

export class EnterpriseWebsiteBuilder extends WebsiteBuilder {
  buildName(): this {
    this.website?.setName('Enterprise Website');
    return this;
  }

  buildCms(): this {
    this.website?.setCms(Cms.WORDPRESS);
    return this;
  }

  buildPrice(): this {
    this.website?.setPrice(1000);
    return this;
  }
}
