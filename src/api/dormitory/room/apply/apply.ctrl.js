import Joi from 'joi';
import {col, fn, Op} from 'sequelize'

import {account, student, room, roomApply} from '../../../../models';

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

export const SetRoom = async (ctx) => {
    if (ctx.request.user.authority !== 3) {
        console.log("SetRoom - 권한 오류");
        ctx.status = 400;
        ctx.body = {
            "error" : "001"
        };
        return;
    }
    
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
    
    if (!(students.length >= 4 && students.length <= 5)) {
        console.log("SetRoom - 신청자 수 오류");
        ctx.status = 400;
        ctx.body = {
            "error" : "003"
        };
        return;
    }
    
    const StudentList = await student.findAll({
        user_id: ctx.request.body.students
    });
    
    if (StudentList.length !== ctx.request.body.students.length) {
        console.log("SetRoom - 입력 데이터 에러 - 학생이 아닌 유저 존재");
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

export const GetRooms = async (ctx) => {
    let rooms = await room.findAll({
        attributes: ['room_no', [fn('GROUP_CONCAT', col('allocation_id')), 'allocation_ids'], [fn('GROUP_CONCAT', col('user_id')), 'user_ids'], [fn('GROUP_CONCAT', col('is_banned')), 'is_banneds']],
        group: "room_no",
        where: {
            year: new Date().getFullYear(),
            quarter: (new Date().getMonth() + 1) / 3
        }
    });
    
    ctx.body = {
        is_succeed: true,
        data: rooms
    };
};

export const GetRoomByRoomId = async (ctx) => {
    try {
        ctx.params.room_no = Number.parseInt(ctx.params.room_no);
    } catch (e) {
        console.log("SetRoom - 기타 형식 에러");
        ctx.status = 400;
        ctx.body = {
            "error" : "002-1"
        };
        return;
    }
    
    const Params = Joi.object().keys({
        room_no: Joi.alternatives().try(Joi.number().integer().min(301).max(320).required(), Joi.number().integer().min(401).max(421).required(), Joi.number().integer().min(501).max(521).required())
    });
    
    let validation = Joi.validate(ctx.params, Params);
    
    if (validation.error) {
        console.log("GetRoomByRoomId - Joi 형식 에러");
        ctx.status = 400;
        ctx.body = {
            "error" : "002"
        };
        return;
    }
    
    let roomSearched = await room.findOne({
        attributes: ['room_no', [fn('GROUP_CONCAT', col('allocation_id')), 'allocation_ids'], [fn('GROUP_CONCAT', col('user_id')), 'user_ids'], [fn('GROUP_CONCAT', col('is_banned')), 'is_banneds']],
        group: "room_no",
        where: {
            room_no: ctx.params.room_no,
            year: new Date().getFullYear(),
            quarter: (new Date().getMonth() + 1) / 3
        }
    });
    
    ctx.body = {
        is_succeed: true,
        data: roomSearched
    };
};

export const GetRoomByUserId = async (ctx) => {
    const Params = Joi.object().keys({
        user_id: Joi.string().regex(/^\d+$/).required()
    });
    
    const validation = Joi.validate(ctx.params, Params);
    
    if (validation.error) {
        console.log("GetRoomByUserId - Joi 형식 에러");
        ctx.status = 400;
        ctx.body = {
            "error" : "002"
        };
        return;
    }
    let roomSearched = await room.findOne({
        attributes: ['room_no', 'allocation_id', 'user_id', 'is_banned'],
        group: "room_no",
        where: {
            user_id: ctx.params.user_id,
            year: new Date().getFullYear(),
            quarter: (new Date().getMonth() + 1) / 3
        }
    });
    
    if (!roomSearched) {
        console.log("GetRoomByUserId - 유저를 찾을 수 없음");
        ctx.status = 400;
        ctx.body = {
            "error" : "003"
        };
        return;
    }
    
    ctx.body = {
        is_succeed: true,
        data: roomSearched
    };
};
