import Router from 'koa-router';
import {} from './point.ctrl';
import {} from './request_song.ctrl';
import { SongList, SongRequest, SongModify, SongDelete } from './request_song.ctrl';
import {} from './room.ctrl';
import {} from './self_study.ctrl';

const dormitory = new Router();
dormitory.post("/song", SongRequest);
dormitory.get("/song", SongList);
dormitory.put("/song", SongModify);
dormitory.delete("/song", SongDelete);

export default dormitory;