import {get, set} from '../redis';
import Scanner from './Scanner';

const SCAN_FREQUENCY = 5 * 1000; // in ms
const DEVICE_INACTIVE_TIME = 30; // in seconds

const getDeviceKey = device => {
  return `personalThemeSong-${device.mac}`;
};

export default class DeviceDetector {
  start() {
    this.scan();
  }

  stop() {
    if (this.scanTimeout) {
      clearTimeout(this.scanTimeout);
    }
  }

  async scan() {
    const scanResults = await Scanner.scan();

    const newDevices = await this.findNewDevices(scanResults);
    await this.recordDevices(scanResults);

    // kick off another scan now that this one is done
    this.scanTimeout = setTimeout(() => this.scan(), SCAN_FREQUENCY);
  }

  async findNewDevices(scanResults) {
    const newDeviceResults = await Promise.all(scanResults.map(async device => {
      const deviceKey = getDeviceKey(device);
      const result = await get(deviceKey);

      if (!result) {
        // no key in redis - must be a new device
        return device;
      } else {
        // has a key in redis - must be a known device
        // return null; we'll filter this out later
        return null;
      }
    }));

    return newDeviceResults.filter(device => !!device); // get rid of the nulls
  }

  recordDevices(scanResults) {
    return Promise.all(scanResults.map(device => {
      const deviceKey = getDeviceKey(device);
      return set(deviceKey, true, 'EX', DEVICE_INACTIVE_TIME);
    }));
  }
}
