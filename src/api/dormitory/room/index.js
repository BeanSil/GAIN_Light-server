import Router from 'koa-router';
import {ApplyNextRoom, SetRoom, UpdateNextRoom, GetRooms, GetRoomByRoomId, GetRoomByUserId, GetApplication, GetApplicationByUserId, GetApplications, DeleteApplication, UserVerification} from './room.ctrl';

import { jwtMiddleware } from '../../../lib/token.js';

const room = new Router();

room.use(jwtMiddleware);

room.use(UserVerification);

room.get('/apply', GetApplications);
room.post('/apply', ApplyNextRoom);
room.get('/apply/all', GetApplications);
room.get('/apply/:apply_id', GetApplication);
room.get('/apply/:apply_id/apply_id', GetApplication);
room.get('/apply/:user_id/user_id', GetApplicationByUserId);
room.post('/apply/:apply_id', UpdateNextRoom);
room.delete('/apply/:apply_id', DeleteApplication);
room.put('/:room_id', SetRoom);
room.get('/', GetRooms);
room.get('/all', GetRooms);
room.get('/:room_no', GetRoomByRoomId);
room.get('/:room_no/room_no', GetRoomByRoomId);
room.get('/:user_id/user_id', GetRoomByUserId);

export default room;