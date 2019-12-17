import Router from "koa-router";
import {
    ApplyNextRoom,
    DeleteApplication,
    GetApplication,
    GetApplicationByUserId,
    GetApplications,
    UpdateNextRoom
} from "./apply.ctrl";

const apply = new Router();


apply.get('/', GetApplications);
apply.post('/', ApplyNextRoom);
apply.get('/all', GetApplications);
apply.get('/:apply_id', GetApplication);
apply.get('/:apply_id/apply_id', GetApplication);
apply.get('/:user_id/user_id', GetApplicationByUserId);
apply.post('/:apply_id', UpdateNextRoom);
apply.delete('/:apply_id', DeleteApplication);

export default apply;