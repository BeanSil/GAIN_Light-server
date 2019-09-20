import Joi from 'joi';
import {col, fn, Op} from 'sequelize'

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
       apply_id: Joi.string().regex(/^\d+$/).required()
    });
    
    const Application = Joi.object().keys({
        students: Joi.array().items(Joi.number().integer()).min(2).max(5).required()
    });
    
    const validation = Joi.validate(ctx.request.body, Application).error || Joi.validate(ctx.params, Params).error;
    
    if (validation) {
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

export const SetRoom = async (ctx) => {
    try {
        ctx.params.room_id = Number.parseInt(ctx.params.room_id);
    } catch (e) {
        console.log("SetRoom - 기타 형식 에러");
        ctx.status = 400;
        ctx.body = {
            "error" : "002-1"
        };
        return;
    }
    
    const Params = Joi.object().keys({
        room_id: Joi.alternatives().try(Joi.number().integer().min(301).max(320).required(), Joi.number().integer().min(401).max(421).required(), Joi.number().integer().min(501).max(521).required())
    });
    
    const Setter = Joi.object().keys({
        reference: Joi.array().items(Joi.number().integer()).max(2).required(),
        students: Joi.array().items(Joi.number().integer()).max(5).required()
    });
    
    const validation = Joi.validate(ctx.params, Params).error || Joi.validate(ctx.request.body, Setter).error;
    
    if (validation) {
        console.log("SetRoom - Joi 형식 에러");
        ctx.status = 400;
        ctx.body = {
            "error" : "002"
        };
        return;
    }
    
    let students = ctx.request.body.students;
    let referenceStudents = await roomApply.findAll({
        where: {
            apply_id: ctx.request.body.reference
        }
    });
    
    referenceStudents.forEach(student => {
        for (let i = 1; i <= student.length; i++) {
            if (students.indexOf(student['user_id' + (i)]) === -1) students.push(student['user_id' + i])
        }
    });
    
    if (students.length >= 4 && students.length <= 5) {
        console.log("SetRoom - 신청자 너무 많음");
        ctx.status = 400;
        ctx.body = {
            "error" : "003"
        };
        return;
    }
    
    let targetQuarter = new Date();
    targetQuarter.setMonth(targetQuarter.getMonth() - 3);
    let userExistData = await room.findAll({
        attributes: ['room_no', [fn('count', col('*')), 'count']],
        group: 'room_no',
        where: {
            user_id: students,
            year: targetQuarter.getFullYear(),
            quarter: (targetQuarter.getMonth() + 1) / 3
        }
    });
    
    for (let i in userExistData) {
        if (userExistData[0].dataValues.count > 2) {
            console.log("SetRoom - 규정 위반 에러");
            ctx.status = 400;
            ctx.body = {
                "error" : "004"
            };
            return;
        }
    }
    
    let is_exist = await room.findAll({
        where: {
            user_id: students,
            year: new Date().getFullYear(),
            quarter: (new Date().getMonth() + 1) / 3
        }
    });
    
    if (is_exist.length) {
        console.log("SetRoom - 유저 이미 등록됨");
        ctx.status = 400;
        ctx.body = {
            "error" : "005"
        };
        return;
    }
    
    let promises = [];
    students.forEach(student => {
       promises.push(room.create({
           room_no: ctx.params.room_id,
           user_id: student,
           year: new Date().getFullYear(),
           quarter: (new Date().getMonth() + 1) / 3
       }));
    });
    
    let result = await Promise.all(promises);
    let output = [];
    result.forEach(res => {
        output.push(res.allocation_id)
    });
    
    ctx.body = {
        is_succeed: true,
        allocation_ids: output
    }
};
