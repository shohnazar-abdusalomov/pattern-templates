/**
 * 3. Computer Builder Pattern Implementation
 * Extracted from computer-builder.ts
 */

export interface IComputer {
  readonly cpu: string;
  readonly ram: string;
  readonly os: string;
  readonly storage: string;
  readonly pointingDevice: 'MOUSE' | 'TOUCHPAD' | string;
  readonly keyboard: string;
  getInfo(): string;
}

export class Computer implements IComputer {
  readonly cpu: string;
  readonly ram: string;
  readonly os: string;
  readonly storage: string;
  readonly pointingDevice: string;
  readonly keyboard: string;

  constructor(builder: ComputerBuilder) {
    this.cpu = builder.cpu;
    this.ram = builder.ram;
    this.os = builder.os;
    this.storage = builder.storage;
    this.pointingDevice = builder.pointingDevice;
    this.keyboard = builder.keyboard;
  }

  public getInfo(): string {
    return [
      '╔════════════════════════════════════════════════════╗',
      '║            💻 KOMPYUTER KONFIGURATSIYASI           ║',
      '╠════════════════════════════════════════════════════╣',
      `║ • Protsessor (CPU)  : ${this.cpu.padEnd(28)} ║`,
      `║ • Tezkor xotira (RAM): ${this.ram.padEnd(27)} ║`,
      `║ • Doimiy xotira     : ${this.storage.padEnd(28)} ║`,
      `║ • Operatsion tizim  : ${this.os.padEnd(28)} ║`,
      `║ • Klaviatura        : ${this.keyboard.padEnd(28)} ║`,
      `║ • Boshqaruv (Mouse) : ${this.pointingDevice.padEnd(28)} ║`,
      '╚════════════════════════════════════════════════════╝',
    ].join('\n');
  }
}

export class ComputerBuilder {
  public cpu: string;
  public ram: string = '8GB DDR4';
  public os: string = 'FreeDOS';
  public storage: string = '256GB SSD';
  public pointingDevice: 'MOUSE' | 'TOUCHPAD' | string = 'TOUCHPAD';
  public keyboard: string = 'Standard Keyboard';

  constructor(cpu: string) {
    if (!cpu || cpu.trim().length === 0) {
      throw new Error("CPU nomi ko'rsatilishi shart!");
    }
    this.cpu = cpu;
  }

  public setRAM(ram: string): this {
    this.ram = ram;
    return this;
  }

  public setOS(os: string): this {
    this.os = os;
    return this;
  }

  public setStorage(storage: string): this {
    this.storage = storage;
    return this;
  }

  public setPointingDevice(device: 'MOUSE' | 'TOUCHPAD' | string): this {
    this.pointingDevice = device;
    return this;
  }

  public setKeyboard(keyboard: string): this {
    this.keyboard = keyboard;
    return this;
  }

  public build(): Computer {
    return new Computer(this);
  }
}

// Demonstartsiya
function runComputerDemo() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('             3. BUILDER PATTERN: COMPUTER DEMO             ');
  console.log('═══════════════════════════════════════════════════════════\n');

  // 1. Dasturchi uchun Noutbuk (Touchpad bilan)
  const devLaptop = new ComputerBuilder('Apple M3 Pro')
    .setRAM('36GB LPDDR5')
    .setStorage('1TB NVMe SSD')
    .setOS('macOS Sonoma')
    .setKeyboard('Magic Keyboard')
    .setPointingDevice('TOUCHPAD')
    .build();

  console.log(devLaptop.getInfo());
  console.log('\n');

  // 2. O'yin / Ish stoli kompyuteri (Sichqoncha va Mexanik klaviatura bilan)
  const gamingPC = new ComputerBuilder('Intel Core i7-14700K')
    .setRAM('32GB DDR5 6000MHz')
    .setStorage('2TB NVMe SSD + 2TB HDD')
    .setOS('Windows 11 Pro')
    .setKeyboard('Mechanical RGB Custom')
    .setPointingDevice('MOUSE')
    .build();

  console.log(gamingPC.getInfo());
  console.log('\n');

  // 3. Ofis / Server ish stoli
  const officePC = new ComputerBuilder('AMD Ryzen 5 7600')
    .setRAM('16GB DDR5')
    .setStorage('512GB SSD')
    .setOS('Ubuntu 24.04 LTS')
    .setKeyboard('Ergonomic Silent Keyboard')
    .setPointingDevice('MOUSE')
    .build();

  console.log(officePC.getInfo());
}

if (process.argv[1]?.includes('computer')) {
  runComputerDemo();
}
