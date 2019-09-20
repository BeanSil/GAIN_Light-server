import Router from 'koa-router';

import {uploadBoard} from './post.ctrl';
import {uploadcomment} from './post.ctrl';
import {getBoard} from './post.ctrl';
import {board_res} from './post.ctrl';
import auth from '../auth';

const post = new Router();

post.post('/board',uploadBoard);
post.post('/comment',uploadcomment);
post.post('/board_likability',board_res);

post.get('/getboard',getBoard);


export default post;
