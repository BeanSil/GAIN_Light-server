import Router from 'koa-router';
import {} from './point.ctrl';
import {} from './request_song.ctrl';
import {} from './room.ctrl';
import {BorrowLaptop} from './self_study.ctrl';

const dormitory = new Router();

dormitory.post('/borrow', BorrowLaptop);

export default dormitory;