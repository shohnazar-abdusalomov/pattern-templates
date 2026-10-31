import { Device } from '../base/device.interface.js';

export class Tv implements Device {
  turnOn(): void {
    console.log('TV is turned on');
  }

  setVolume(volume: number): void {
    console.log(`TV volume set to ${volume}`);
  }
}
