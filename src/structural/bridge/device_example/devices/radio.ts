import { Device } from '../base/device.interface.js';

export class Radio implements Device {
  turnOn(): void {
    console.log('Radio is turned on');
  }

  setVolume(volume: number): void {
    console.log(`Radio volume set to ${volume}`);
  }
}
