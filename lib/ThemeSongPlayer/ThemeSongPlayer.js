import request from 'request';
import debounce from 'debounce';
import { sonosPlayURI } from '../api/sonos';

// for debugging so we don't take over the Sonos too often!
// const sonosPlayURI = uri => {
//   console.log(`would play ${uri}`);
// };

const SONG_SWITCH_TIMEOUT = 1000 * 60 * 5; // 5 minutes (in ms)

// debounce our play invocation so we don't switch songs too frequently
// TODO: make this queue instead of dropping the song
const debouncedPlayUri = debounce(sonosPlayURI, SONG_SWITCH_TIMEOUT, true);

const getSpotifyUriForDevice = async device => {
  const {mac} = device;
  const encodedMac = encodeURI(mac);
  const requestUrl = `https://ri-theme-song-service.herokuapp.com/themeSong/${encodedMac}`;

  // request(requestUrl, function (error, response, body) {
  //   console.log('error:', error); // Print the error if one occurred
  //   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  //   console.log('body:', body); // Print the HTML for the Google homepage.
  // });

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
