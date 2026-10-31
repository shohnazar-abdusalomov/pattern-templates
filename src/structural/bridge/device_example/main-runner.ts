import { XiaomiDeviceAdaptor } from './adaptor/xiaomi-device-adaptor.js';
import { BasicRemote } from './base/basic-remote.js';
import { Radio } from './devices/radio.js';
import { Tv } from './devices/tv.js';
import { XiaomiDevice } from './devices/xiaomi-device.js';

export function runDeviceExampleDemo(): void {
  console.log('=== Bridge Pattern (device_example) Demo ===');
  const radio = new Radio();
  const tv = new Tv();
  const xiaomiDevice = new XiaomiDevice();

  const xiaomiDeviceAdapter = new XiaomiDeviceAdaptor(xiaomiDevice);

  console.log('--- Direct Device Calls ---');
  radio.turnOn();
  radio.setVolume(5);

  xiaomiDeviceAdapter.turnOn();
  xiaomiDeviceAdapter.setVolume(10);

  console.log('--- Controlled via BasicRemote Bridge Abstraction ---');
  const tvRemote = new BasicRemote(tv);
  tvRemote.turnOn();
  tvRemote.setVolume(25);

  const xiaomiRemote = new BasicRemote(xiaomiDeviceAdapter);
  xiaomiRemote.turnOn();
  xiaomiRemote.setVolume(60);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runDeviceExampleDemo();
}
