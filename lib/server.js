import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import http from 'http';
import DeviceDetector from './DeviceDetector';
import ThemeSongPlayer from './ThemeSongPlayer';

// Routes

import RoutesSpotify from './routes/spotify';

const app = express();
const server = http.Server(app);
const deviceDetector = new DeviceDetector(ThemeSongPlayer.playForDevice);
deviceDetector.start();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve('public')));

// Routing

app.use('/spotify', RoutesSpotify);

// Server start

server.listen(process.env.PORT || 3000);

export default app;
