import { Cms } from './cms.enum.js';

export class Website {
  private name: string | null = null;
  private cms: Cms | null = null;
  private price = 0;

  setName(name: string | null): void {
    this.name = name;
  }

  setCms(cms: Cms | null): void {
    this.cms = cms;
  }

  setPrice(price: number): void {
    this.price = price;
  }

  getName(): string | null {
    return this.name;
  }

  getCms(): Cms | null {
    return this.cms;
  }

  getPrice(): number {
    return this.price;
  }

  toString(): string {
    return `Website{name='${this.name}', cms=${this.cms}, price=${this.price}}`;
  }
}
