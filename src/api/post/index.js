import Router from 'koa-router';

import {uploadBoard, uploadcomment, getBoard, board_res, board_com_res, DeleteBoard, DeleteComment, BoardData} from './post.ctrl';
import auth from '../auth';

const post = new Router();

post.post('/board',uploadBoard);
post.delete('/board/:board_id', DeleteBoard);
post.post('/comment',uploadcomment);
post.delete('/comment/:comment_id', DeleteComment);
post.post('/board_likability',board_res);
post.post('/board_com_likability',board_com_res);
post.post('/board_data',BoardData);

post.get('/getboard',getBoard);


export default post;
