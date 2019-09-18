import Router from 'koa-router';
import { ApplyNextRoom } from './room.ctrl';

const room = new Router();

room.post('/', ApplyNextRoom);

export default room;