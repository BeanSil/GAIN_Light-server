import Router from 'koa-router';
import { DEL_POINT } from './point.ctrl';
import {} from './request_song.ctrl';
import {} from './room.ctrl';
import {} from './self_study.ctrl';
import {isLoggedIn,adminLoggedIn,studentLoggedIn} from './loginCheck';

const dormitory = new Router();

dormitory.post('/point',isLoggedIn,adminLoggedIn,POINT);
dormitory.get('/dormitory/allpoint',isLoggedIn,adminLoggedIn,ALLPOINT);
dormitory.get('/dormitory/individualpoint',isLoggedIn,studentLoggedIn.INDIVIDUALPOINT);
dormitory.put('/dormitory/point/:id',isLoggedIn,adminLoggedIn,PUT_POINT);
dormitory.delete('/dormitory/point/:id',isLoggedIn,adminLoggedIn,DEL_POINT);


export default dormitory;