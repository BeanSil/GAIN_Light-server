import Joi from 'joi';
import { Op } from 'sequelize'

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
    
    await roomApply.sync();
    
    const AppliedExist = await roomApply.findAll({
        where: {
            [Op.or]: [{
                user_id1: ctx.request.body.students
            }, {
                user_id2: ctx.request.body.students
            }, {
                user_id3: ctx.request.body.students
            }, {
                user_id4: ctx.request.body.students
            }, {
                user_id5: ctx.request.body.students
            }]
        }
    });
    
    if (AppliedExist.length) {
        console.log("ApplyNextRoom - 입력 데이터 에러 - 유저가 이미 존재");
        ctx.status = 400;
        ctx.body = {
            "error" : "003"
        };
        return;
    }
    
    let query = {
        length: ctx.request.body.students.length
    };
    let i = 1;
    for (let index in ctx.request.body.students) {
        query[`user_id${i}`] = ctx.request.body.students[index];
        i++;
    }
    
    let result = await roomApply.create(query);
    
    ctx.body = {
        is_succeed: true,
        apply_id: result.apply_id
    }
};

export const UpdateNextRoom = async (ctx) => {
    const Params = Joi.object().keys({
       apply_id: Joi.string().alphanum().required() // TODO: 숫자만 걸러내는 방법 찾아야 함
    });
    
    const Application = Joi.object().keys({
        students: Joi.array().items(Joi.number().integer()).min(2).max(5).required()
    });
    
    const validation = Joi.validate(ctx.request.body, Application) && Joi.validate(ctx.params, Params);
    
    if (validation.error) {
        console.log("ApplyNextRoom - Joi 형식 에러");
        ctx.status = 400;
        ctx.body = {
            "error" : "002"
        };
        return;
    }
    
    const AppliedExist = await roomApply.findAll({
        where: {
            [Op.and]: [
                {
                    apply_id: ctx.params.apply_id
                },
                {
                    [Op.or]: [{
                        user_id1: ctx.request.body.students
                    }, {
                        user_id2: ctx.request.body.students
                    }, {
                        user_id3: ctx.request.body.students
                    }, {
                        user_id4: ctx.request.body.students
                    }, {
                        user_id5: ctx.request.body.students
                    }]
                }
            ]
        }
    });
    
    if (AppliedExist.length > 1) {
        console.log("ApplyNextRoom - 입력 데이터 에러 - 유저가 이미 존재");
        ctx.status = 400;
        ctx.body = {
            "error" : "003"
        };
        return;
    }
    
    if (!AppliedExist.length) {
        console.log("ApplyNextRoom - 입력 데이터 에러 - 대상이 존재하지 않음");
        ctx.status = 400;
        ctx.body = {
            "error" : "004"
        };
        return;
    }
    
    let query = {
        length: ctx.request.body.students.length
    };
    let i = 1;
    for (let index in ctx.request.body.students) {
        query[`user_id${i}`] = ctx.request.body.students[index];
        i++;
    }
    
    await roomApply.update(query, { where: { apply_id: ctx.params.apply_id } });
    
    ctx.body = {
        is_succeed: true,
        apply_id: AppliedExist[0].apply_id
    }
};
