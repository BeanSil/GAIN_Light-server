import Joi from 'joi';
import {col, fn, Op} from 'sequelize'

import {student, roomApply} from '../../../../models';

// .env 파일의 환경 변수 불러오기
import dotenv from 'dotenv';
dotenv.config();

export const ApplyNextRoom = async (ctx) => {
    if (ctx.request.user.authority !== 2) {
        console.log("ApplyNextRoom - 권한 오류");
        ctx.status = 400;
        ctx.body = {
            "error" : "001"
        };
        return;
    }
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
    
    const StudentList = await student.findAll({
        user_id: ctx.request.body.students
    });
    
    if (StudentList.length !== ctx.request.body.students.length) {
        console.log("ApplyNextRoom - 입력 데이터 에러 - 학생이 아닌 유저 존재");
        ctx.status = 400;
        ctx.body = {
            "error" : "003"
        };
        return;
    }
    
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
    if (ctx.request.user.authority !== 2) {
        console.log("UpdateNextRoom - 권한 오류");
        ctx.status = 400;
        ctx.body = {
            "error" : "001"
        };
        return;
    }
    const Params = Joi.object().keys({
        apply_id: Joi.string().regex(/^\d+$/).required()
    });
    
    const Application = Joi.object().keys({
        students: Joi.array().items(Joi.number().integer()).min(2).max(5).required()
    });
    
    const validation = Joi.validate(ctx.request.body, Application).error || Joi.validate(ctx.params, Params).error;
    
    if (validation) {
        console.log("UpdateNextRoom - Joi 형식 에러");
        ctx.status = 400;
        ctx.body = {
            "error" : "002"
        };
        return;
    }
    
    const StudentList = await student.findAll({
        user_id: ctx.request.body.students
    });
    
    if (StudentList.length !== ctx.request.body.students.length) {
        console.log("UpdateNextRoom - 입력 데이터 에러 - 학생이 아닌 유저 존재");
        ctx.status = 400;
        ctx.body = {
            "error" : "003"
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
        console.log("UpdateNextRoom - 입력 데이터 에러 - 유저가 이미 존재");
        ctx.status = 400;
        ctx.body = {
            "error" : "003"
        };
        return;
    }
    
    if (!AppliedExist.length) {
        console.log("UpdateNextRoom - 입력 데이터 에러 - 대상이 존재하지 않음");
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

export const GetApplications = async (ctx) => {
    if (ctx.request.user.authority !== 3) {
        console.log("SetRoom - 권한 오류");
        ctx.status = 400;
        ctx.body = {
            "error" : "001"
        };
        return;
    }
    
    let applies = await roomApply.findAll();
    
    ctx.body = {
        is_succeed: true,
        data: applies
    };
};

export const GetApplication = async (ctx) => {
    if (ctx.request.user.authority < 2) {
        console.log("GetApplication - 권한 오류");
        ctx.status = 400;
        ctx.body = {
            "error" : "001"
        };
        return;
    }
    
    const Params = Joi.object().keys({
        apply_id: Joi.string().regex(/^\d+$/).required()
    });
    
    const validation = Joi.validate(ctx.params, Params);
    
    if (validation.error) {
        console.log("GetApplication - Joi 형식 에러");
        ctx.status = 400;
        ctx.body = {
            "error" : "002"
        };
        return;
    }
    
    let apply = await roomApply.findOne({where: {apply_id: ctx.params.apply_id}});
    
    ctx.body = {
        is_succeed: true,
        data: apply
    };
};

export const GetApplicationByUserId = async (ctx) => {
    if (ctx.request.user.authority < 2) {
        console.log("GetApplicationByUserId - 권한 오류");
        ctx.status = 400;
        ctx.body = {
            "error" : "001"
        };
        return;
    }
    
    const Params = Joi.object().keys({
        user_id: Joi.string().regex(/^\d+$/).required()
    });
    
    const validation = Joi.validate(ctx.params, Params);
    
    if (validation.error) {
        console.log("GetApplicationByUserId - Joi 형식 에러");
        ctx.status = 400;
        ctx.body = {
            "error" : "002"
        };
        return;
    }
    
    const apply = await roomApply.findOne({
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
    
    ctx.body = {
        is_succeed: true,
        data: apply
    };
};

export const DeleteApplication = async (ctx) => {
    if (ctx.request.user.authority < 2) {
        console.log("DeleteApplication - 권한 오류");
        ctx.status = 400;
        ctx.body = {
            "error" : "001"
        };
        return;
    }
    
    const Params = Joi.object().keys({
        apply_id: Joi.string().regex(/^\d+$/).required()
    });
    
    const validation = Joi.validate(ctx.params, Params);
    
    if (validation.error) {
        console.log("DeleteApplication - Joi 형식 에러");
        ctx.status = 400;
        ctx.body = {
            "error" : "002"
        };
        return;
    }
    
    let apply = await roomApply.destroy({where: {apply_id: ctx.params.apply_id}});
    
    if (!apply) {
        console.log("DeleteApplication - 신청 내역 없음");
        ctx.status = 400;
        ctx.body = {
            "error" : "003"
        };
        return;
    }
    
    ctx.body = {
        is_succeed: true
    };
    
};
