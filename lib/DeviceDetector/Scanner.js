import LocalNetworkScanner from '../local-network-scanner';

const ethernetInterface = 'en0';

export const scan = async () => {
  try {
    const scanResults = await new Promise(resolve => {
      LocalNetworkScanner.scan({arguments: ['-I', ethernetInterface]}, devices => {
        resolve(devices);
      })
    })
    return scanResults;
  } catch (error) {
    console.log('error scanning', error);
    return [];
  }
}

export default {
  scan,
};
