import Router from 'koa-router';
import {checkPlace, byung, sleepoverApplies, sleepoverApplies_delete, sleepoverApplies_check } from './rest.ctrl';

const rest = new Router();

rest.get('/checkPlace', checkPlace);
rest.post('/applyPlace', byung);
rest.post('/sleepoverApplies', sleepoverApplies);
rest.delete('/sleepoverApplies_delete', sleepoverApplies_delete);
rest.get('/sleepoverApplies_check', sleepoverApplies_check);

export default rest;