import Router from 'koa-router';
import {ApplyNextRoom, SetRoom, UpdateNextRoom, GetRooms, GetRoomByRoomId, GetRoomByUserId} from './room.ctrl';

const room = new Router();

room.post('/apply', ApplyNextRoom);
room.post('/apply/:apply_id', UpdateNextRoom);
room.put('/:room_id', SetRoom);
room.get('/all', GetRooms);
room.get('/:room_no', GetRoomByRoomId);
room.get('/:room_no/room_no', GetRoomByRoomId);
room.get('/:user_id/user_id', GetRoomByUserId);

export default room;