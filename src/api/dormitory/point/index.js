import Router from 'koa-router';
import {ALLPOINT, DEL_POINT, INDIVIDUALPOINT, POINT, PUT_POINT} from "./point.ctrl";
import {UserVerification} from "../room/room.ctrl";

const point = new Router();

point.use(UserVerification);

point.post('/',POINT); //상벌점 등록 + student테이블의 point에 값 누적
point.get('/',ALLPOINT); //상벌점 전체 조회-관리자
point.get('/all',ALLPOINT); //상벌점 전체 조회-관리자
point.get('/me',INDIVIDUALPOINT); //상벌점 본인 조회-로그인한 본인
point.put('/:id',PUT_POINT); //상벌점 수정 + student테이블의 point에 값 누적
point.delete('/:id',DEL_POINT); //상벌점 삭제 + student테이블의 point에 값 누적

export default point;