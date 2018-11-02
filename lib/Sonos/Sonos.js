import {DeviceDiscovery} from 'sonos';

export const playUri = async uri => {
  try {
    await DeviceDiscovery(async device => {
      try {
        await device.play(uri);
      } catch (playError) {
        // BUGBUG we often get an error here, but it still plays... what's up with that?
        console.log(`error telling Sonos to play "${uri}"`, playError);
      }
    });
  } catch (discoveryError) {
    console.log('error during Sonos discovery', discoveryError);
  }
}
