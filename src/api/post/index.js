import Router from 'koa-router';

import {uploadBoard} from './post.ctrl';
import {uploadcomment} from './post.ctrl';
import auth from '../auth';

const post = new Router();

post.post('/board',uploadBoard);
post.post('/comment',uploadcomment);

export default post;