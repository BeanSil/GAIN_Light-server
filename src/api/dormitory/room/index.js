import Router from 'koa-router';
import { ApplyNextRoom, UpdateNextRoom } from './room.ctrl';

const room = new Router();

room.post('/apply', ApplyNextRoom);
room.post('/apply/:apply_id', UpdateNextRoom);

export default room;