import Router from 'koa-router';

import { room } from './room';

import {} from './point.ctrl';
import {} from './request_song.ctrl';
import {} from './self_study.ctrl';

const dormitory = new Router();

dormitory.use('/room', room.routes());

export default dormitory;