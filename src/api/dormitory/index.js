import Router from 'koa-router';
import { POINT,ALLPOINT,INDIVIDUALPOINT,PUT_POINT,DEL_POINT } from './point.ctrl';
import {} from './request_song.ctrl';
import {} from './room.ctrl';
import {} from './self_study.ctrl';
import {isLoggedIn,adminLoggedIn,studentLoggedIn} from './loginCheck';

const dormitory = new Router();

dormitory.post('/point',isLoggedIn,adminLoggedIn,POINT); //상벌점 등록 + student테이블의 point에 값 누적 
dormitory.get('/dormitory/allpoint',isLoggedIn,adminLoggedIn,ALLPOINT); //상벌점 전체 조회-관리자
dormitory.get('/dormitory/individualpoint',isLoggedIn,studentLoggedIn,INDIVIDUALPOINT); //상벌점 본인 조회-로그인한 본인
dormitory.put('/dormitory/point/:id',isLoggedIn,adminLoggedIn,PUT_POINT); //상벌점 수정 + student테이블의 point에 값 누적
dormitory.delete('/dormitory/point/:id',isLoggedIn,adminLoggedIn,DEL_POINT); //상벌점 삭제 + student테이블의 point에 값 누적

export default dormitory;