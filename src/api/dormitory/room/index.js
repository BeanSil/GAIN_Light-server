import Router from 'koa-router';
import {ApplyNextRoom, SetRoom, UpdateNextRoom, GetRooms, GetRoom} from './room.ctrl';

const room = new Router();

room.post('/apply', ApplyNextRoom);
room.post('/apply/:apply_id', UpdateNextRoom);
room.put('/:room_id', SetRoom);
room.get('/all', GetRooms);
room.get('/:room_id', GetRoom);

export default room;