import Router from 'koa-router';

import auth from './auth';
import school from './school';
import post from './post';
import dormitory from './dormitory';
import rest from './rest';

const api = new Router();

api.use('/auth', auth.routes());
api.use('/school', school.routes());
api.use('/post', post.routes());
api.use('/dormitory', dormitory.routes());
api.use('/rest', rest.routes());


export default api;