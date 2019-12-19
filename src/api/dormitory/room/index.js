import Router from 'koa-router';
import {SetRoom, GetRooms, GetRoomByRoomId, GetRoomByUserId, UserVerification} from './room.ctrl';

import apply from './apply'

const room = new Router();

room.use(UserVerification);

room.use('/apply', apply.routes());

room.put('/:room_id', SetRoom);
room.get('/', GetRooms);
room.get('/all', GetRooms);
room.get('/:room_no', GetRoomByRoomId);
room.get('/:room_no/room_no', GetRoomByRoomId);
room.get('/:user_id/user_id', GetRoomByUserId);

export default room;