import Router from 'koa-router';
import {} from './point.ctrl';
import {} from './request_song.ctrl';
import {} from './room.ctrl';
import { LrnReserve, LrnCancel, LrnList } from './self_study.ctrl';

const dormitory = new Router();

dormitory.post('/selfstudy', LrnReserve);

dormitory.get('/selfstudy', LrnList)

dormitory.delete('/selfstudy', LrnCancel);

export default dormitory;