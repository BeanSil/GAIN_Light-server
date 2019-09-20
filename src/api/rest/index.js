import Router from 'koa-router';
import {checkPlace, byung, sleepoverApply, sleepoverApply_delete} from './rest.ctrl';

const rest = new Router();

rest.post('/checkPlace', checkPlace);
rest.post('/applyPlace', byung);
rest.post('/sleepoverApply', sleepoverApply);
rest.delete('/sleepoverApply_delete', sleepoverApply_delete);

export default rest;