import { Device } from '../base/device.interface.js';
import { XiaomiDevice } from '../devices/xiaomi-device.js';

export class XiaomiDeviceAdaptor implements Device {
  constructor(private readonly xiaomiDevice: XiaomiDevice) {}

  turnOn(): void {
    this.xiaomiDevice.startEngine();
  }

  setVolume(volume: number): void {
    const level = volume / 100.0;
    this.xiaomiDevice.adjustVolume(level);
  }
}
