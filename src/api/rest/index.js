import Router from 'koa-router';
import {test, byung, sleepoverApply} from './rest.ctrl';

const rest = new Router();

rest.post('/test', test);
rest.post('/applyPlace', byung);
rest.post('/sleepoverApply', sleepoverApply);

export default rest;