import Router from 'koa-router';
import {ApplyNextRoom, SetRoom, UpdateNextRoom} from './room.ctrl';

const room = new Router();

room.post('/apply', ApplyNextRoom);
room.post('/apply/:apply_id', UpdateNextRoom);
room.put('/:room_id', SetRoom);

export default room;