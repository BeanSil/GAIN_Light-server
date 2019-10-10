import Router from 'koa-router';
import {ApplyNextRoom, SetRoom, UpdateNextRoom, GetRooms, GetRoomByRoomId, GetRoomByUserId, GetApplication, GetApplicationByUserId, GetApplications, DeleteApplication, UserVerification} from './room.ctrl';

import apply from './apply'

import { jwtMiddleware } from '../../../lib/token.js';

const room = new Router();

room.use(jwtMiddleware);

room.use(UserVerification);

room.use('/apply', apply.routes());

room.put('/:room_id', SetRoom);
room.get('/', GetRooms);
room.get('/all', GetRooms);
room.get('/:room_no', GetRoomByRoomId);
room.get('/:room_no/room_no', GetRoomByRoomId);
room.get('/:user_id/user_id', GetRoomByUserId);

export default room;