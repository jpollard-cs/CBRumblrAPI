import request from 'request';
import debounce from 'debounce';
import Sonos from '../Sonos';

// for debugging so we don't take over the Sonos too often!
// const playUri = uri => {
//   console.log(`would play ${uri}`);
// };

const SONG_LOOKUP_HOST = 'https://ri-theme-song-service.herokuapp.com'; // TODO pull from ENV
const SONG_SWITCH_TIMEOUT = 1000 * 60 * 5; // 5 minutes (in ms)

// debounce our play invocation so we don't switch songs too frequently
// TODO: make this queue instead of dropping the song
const debouncedPlayUri = debounce(Sonos.playUri, SONG_SWITCH_TIMEOUT, true);

const getSpotifyUriForDevice = async device => {
  const {mac} = device;
  const encodedMac = encodeURI(mac);
  const requestUrl = `${SONG_LOOKUP_HOST}/themeSong/${encodedMac}`;

  const spotifyUri = await new Promise(resolve => request(requestUrl, function (error, response, body) {
    if (response && response.statusCode === 200) {
      const returnedUri = body;

      try {
        const bodyJson = JSON.parse(body);
        resolve(bodyJson.spotifyTrackId);
      } catch (error) {
        console.log('error parsing server response', error);
        resolve(null);
      }
    } else {
      resolve(null);
    }
  }));

  return spotifyUri;
};

const localGetSpotifyUriForDevice = async device => {
  const {mac} = device;

  if (mac === 'b0:19:c6:05:b6:cd') {
    // kevin's phone
    return 'spotify:track:2KH16WveTQWT6KOG9Rg6e2';
  } else {
    return null;
  }
};

export const playForDevice = async device => {
  const spotifyUri = await getSpotifyUriForDevice(device);

  if (spotifyUri) {
    debouncedPlayUri(spotifyUri);
  }
};
