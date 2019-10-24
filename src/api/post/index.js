import Router from 'koa-router';

import {uploadBoard, uploadComment, GetPost, board_res, board_com_res, DeletePost, DeleteComment, BoardData} from './post.ctrl';
import auth from '../auth';

const post = new Router();

// post.get('/board',GetBoardList); // TODO: Make
post.post('/board',uploadBoard);
post.get('/board/:board_id', GetPost);
// post.put('/board/:board_id', UpdatePost); // TODO: Make
post.delete('/board/:board_id', DeletePost);

// post.get('/comment/:board_id',getAllComment); // TODO: Make
post.post('/comment/:board_id',uploadComment); // new
// post.get('/comment/:board_id/:comment_id', GetComment); // TODO: Make
// post.put('/comment/:board_id/:comment_id', UpdateComment); // TODO: Make
post.post('/comment/:board_id/:comment_id/like', board_com_res);
post.delete('/comment/:board_id/:comment_id', DeleteComment); // TODO: 게시판 id 댓글 id 검증

post.post('/board_likability',board_res); // 설명 필요
post.post('/board_data',BoardData); // 설명 필요



export default post;
