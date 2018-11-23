import {DeviceDiscovery, Sonos} from 'sonos';

const getDevice = async () => {
  const sonosIp = process.env.SONOS_IP || '192.168.1.10';
  const sonosPort = parseInt(process.env.SONOS_PORT) || 1400;
  if (sonosIp && sonosPort) {
    return new Sonos(sonosIp, sonosPort);
  }

  try {
    const deviceDiscoveryPromise = new Promise((resolve, fail) => {
      DeviceDiscovery().once('DeviceAvailable', async device => {
        console.log('found device ' + device)
        console.log('found device at ' + device.host)

        resolve(device);
        // // get all groups
        // const deviceGroups = await device.getAllGroups()
        // if (!deviceGroups) {
        //   console.log('no device groups found');
        //   return;
        // }

        // const firstGroup = deviceGroups[0];
        // if (!firstGroup) {
        //   console.log('unable to get first device group');
        //   return;
        // }

        // console.log(firstGroup);


        // firstGroup.play('spotify:artistTopTracks:72qVrKXRp9GeFQOesj0Pmv');
      })

    });

    const device = await Promise.race([
      deviceDiscoveryPromise,
      new Promise((resolve, fail) => {
        setTimeout(() => fail('timeout'), 5000)
      })
    ]);

    return device;
  } catch (discoveryError) {
    console.log('error during Sonos discovery', discoveryError);
  }
};

export const playUri = async uri => {
  const device = await getDevice();

  if (device) {
    console.log('found', device);
    try {
      const currentTrack = await device.currentTrack();
      console.log('currentTrack', currentTrack);
      // await device.play(uri);
    } catch (playError) {
      // BUGBUG we often get an error here, but it still plays... what's up with that?
      console.log(`error telling Sonos to play "${uri}"`, playError);
    }

  } else {
    console.log("couldn't find device");
  }

}
