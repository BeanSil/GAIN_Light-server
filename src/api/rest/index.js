import Router from 'koa-router';
import {test} from './rest.ctrl';

const rest = new Router();

rest.get('/test', test);

export default rest;