import redis from 'redis';
import {promisify} from 'util';

const client = redis.createClient();

export const get = promisify(client.get).bind(client);
export const set = promisify(client.set).bind(client);
