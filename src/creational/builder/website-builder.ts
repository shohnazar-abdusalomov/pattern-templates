import { Website } from './website.js';

export abstract class WebsiteBuilder {
  website: Website | null = null;

  createWebsite(): this {
    this.website = new Website();
    return this;
  }

  abstract buildName(): this;
  abstract buildCms(): this;
  abstract buildPrice(): this;
}
