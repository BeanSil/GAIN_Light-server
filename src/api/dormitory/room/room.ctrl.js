import Joi from 'joi';

import { account, room, roomApply } from '../../../models';

import { decodeToken } from '../../../lib/token.js';

// .env 파일의 환경 변수 불러오기
import dotenv from 'dotenv';
dotenv.config();

export const ApplyNextRoom = async (ctx) => {
    const Application = Joi.object().keys({
        students: Joi.array().items(Joi.number().integer()).min(2).max(5).required()
    });
    
    const validation = Joi.validate(ctx.request.body, Application);
    
    if (validation.error) {
        console.log("ApplyNextRoom - Joi 형식 에러");
        ctx.status = 400;
        ctx.body = {
            "error" : "002"
        };
        return;
    }
    
    const AppliedExist = await roomApply.findAll()
};