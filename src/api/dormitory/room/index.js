import Router from 'koa-router';
import {ApplyNextRoom, SetRoom, UpdateNextRoom, GetRooms, GetRoomByRoomId, GetRoomByUserId, UserVerification} from './room.ctrl';

import { jwtMiddleware } from '../../../lib/token.js';

const room = new Router();

room.use(jwtMiddleware);

room.use(UserVerification);

room.post('/apply', ApplyNextRoom);
room.post('/apply/:apply_id', UpdateNextRoom);
room.put('/:room_id', SetRoom);
room.get('/all', GetRooms);
room.get('/:room_no', GetRoomByRoomId);
room.get('/:room_no/room_no', GetRoomByRoomId);
room.get('/:user_id/user_id', GetRoomByUserId);

export default room;