import Router from 'koa-router';
import { POINT,ALLPOINT,INDIVIDUALPOINT,PUT_POINT,DEL_POINT } from './point.ctrl';
import {} from './request_song.ctrl';
import {} from './room.ctrl';
import {} from './self_study.ctrl';
import {isLoggedIn} from './loginCheck';

const dormitory = new Router();

dormitory.post('/point',isLoggedIn,POINT); //상벌점 등록 + student테이블의 point에 값 누적 
dormitory.get('/allpoint',isLoggedIn,ALLPOINT); //상벌점 전체 조회-관리자
dormitory.get('/individualpoint',isLoggedIn,INDIVIDUALPOINT); //상벌점 본인 조회-로그인한 본인
dormitory.put('/point/:id',isLoggedIn,PUT_POINT); //상벌점 수정 + student테이블의 point에 값 누적
dormitory.delete('/point/:id',isLoggedIn,DEL_POINT); //상벌점 삭제 + student테이블의 point에 값 누적

export default dormitory;