import Router from 'koa-router';

import room from './room';

import { POINT,ALLPOINT,INDIVIDUALPOINT,PUT_POINT,DEL_POINT } from './point.ctrl';
import { SongList, SongRequest, SongModify, SongDelete } from './request_song.ctrl';
import {} from './self_study.ctrl';

const dormitory = new Router();

dormitory.use('/room', room.routes());

dormitory.post("/song", SongRequest);
dormitory.get("/song", SongList);
dormitory.put("/song", SongModify);
dormitory.delete("/song", SongDelete);

dormitory.post('/point',POINT); //상벌점 등록 + student테이블의 point에 값 누적 
dormitory.get('/allpoint',ALLPOINT); //상벌점 전체 조회-관리자
dormitory.get('/individualpoint',INDIVIDUALPOINT); //상벌점 본인 조회-로그인한 본인
dormitory.put('/point/:id',PUT_POINT); //상벌점 수정 + student테이블의 point에 값 누적
dormitory.delete('/point/:id',DEL_POINT); //상벌점 삭제 + student테이블의 point에 값 누적

export default dormitory;