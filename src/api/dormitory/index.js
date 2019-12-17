import Router from 'koa-router';

import room from './room';
import point from "./point";

import { SongList, SongRequest, SongModify, SongDelete } from './request_song.ctrl';
import {} from './self_study.ctrl';

const dormitory = new Router();

dormitory.use('/room', room.routes());
dormitory.use('/point', point.routes());

dormitory.post("/song", SongRequest);
dormitory.get("/song", SongList);
dormitory.put("/song", SongModify);
dormitory.delete("/song", SongDelete);



export default dormitory;