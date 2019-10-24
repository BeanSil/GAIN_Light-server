import Router from 'koa-router';

import {uploadBoard, uploadcomment, getBoard, board_res, board_com_res, DeletePost, DeleteComment, BoardData} from './post.ctrl';
import auth from '../auth';

const post = new Router();

post.post('/board',uploadBoard);
post.post('/comment',uploadcomment);
// post.get('/board/:board_id', GetPost); // TODO: Make
// post.put('/board/:board_id', UpdatePost); // TODO: Make
post.delete('/board/:board_id', DeletePost);
post.post('/comment/:board_id',uploadcomment); // new
// post.get('/comment/:board_id/:comment_id', DeleteComment); // TODO: Make
// post.put('/comment/:board_id/:comment_id', DeleteComment); // TODO: Make
// post.delete('/comment/:board_id/:comment_id', DeleteComment);  // new
post.delete('/comment/:comment_id', DeleteComment);

post.post('/board_likability',board_res); // 설명 필요
post.post('/board_com_likability',board_com_res); // 설명 필요
post.post('/board_data',BoardData); // 설명 필요

post.get('/getboard',getBoard);

post.get('/board',getBoard); // new


export default post;
