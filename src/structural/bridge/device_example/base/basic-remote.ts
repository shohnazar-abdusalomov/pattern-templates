import { Device } from './device.interface.js';

export class BasicRemote {
  constructor(public readonly device: Device) {}

  turnOn(): void {
    this.device.turnOn();
  }

  setVolume(volume: number): void {
    this.device.setVolume(volume);
  }
}
