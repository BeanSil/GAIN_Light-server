import Router from 'koa-router';

import {
    uploadBoard,
    uploadComment,
    GetPost,
    UpdatePost,
    board_res,
    board_com_res,
    DeletePost,
    DeleteComment,
    BoardData,
    GetAllComment
} from './post.ctrl';
import auth from '../auth';

const post = new Router();

// post.get('/board/:kind',GetBoardList); // TODO: Make
post.post('/board/:kind',uploadBoard);
post.get('/board/:kind/:board_id', GetPost);
post.put('/board/:kind/:board_id', UpdatePost); // TODO: Make
post.delete('/board/:kind/:board_id', DeletePost);
post.post('/board/:kind/:board_id/like', board_res);
post.post('/board/:kind/:board_id/link',BoardData); // 설명 필요

post.get('/comment/:board_id',GetAllComment); // TODO: Make
post.post('/comment/:board_id',uploadComment); // new
// post.get('/comment/:board_id/:comment_id', GetComment); // TODO: Make
// post.put('/comment/:board_id/:comment_id', UpdateComment); // TODO: Make
post.post('/comment/:board_id/:comment_id/like', board_com_res);
post.delete('/comment/:board_id/:comment_id', DeleteComment); // TODO: 게시판 id 댓글 id 검증




export default post;
