import Router from 'koa-router';
import Joi from 'joi';
import {decodeToken} from '../../lib/token';
import {points,Student} from '../../models';

const api= new Router();

api.post('/dormitory/point',async(ctx,next)=>{  //상벌점 등록 + student테이블의 point에 값 누적 , 관리자용!

    const Request = Joi.object().keys({
        giver_id:Joi.integer().required(),
        receiver_id:Joi.integer().required(),
        kind:Joi.required(),
        amount:Joi.number().integer().required(),
        reason_id:Joi.integer().required(),
        detail:Joi.string().min(2).max(200).required(),
    });

    // 넘어온 body의 형식을 검사한다.
    const Result = Joi.validate(ctx.request.body, Request);

    // 만약 형식이 불일치한다면, 그 이후 문장도 실행하지 않는다.
    if(Result.error) {
        console.log(`/dormitory/point - Joi 형식 에러`);
        ctx.status = 400;
        ctx.body = {
            "error" : "001"
        }
        return;
    }
    const {giver_id,receiver_id,kind,amount,reason_id,detail}=ctx.request.body;

    try{
        await points.create({  //db에 추가
            giver_id,receiver_id,kind,amount,reason_id,detail
        });

        let pastPoint=await Student.findAll({ //상벌점을 받은 학생의 총 합계 조회
            where:{
                user_id:receiver_id
            },
            attributes:["point"]
        });
        let currentPoint=pastPoint+amount;  //지금까지 받은 상벌점 총 합계와 지금 받은 상벌점을 더한다.

        await Student.update({    //해당 학생에게 상벌점 총 합계 갱신
            where:{
                user_id:receiver_id
            },
            point:currentPoint
        });
        ctx.status(200);

    }catch(error){
        console.error(error);
        return next(error);
    } 
});

api.get('/dormitory/allpoint',async(ctx,next)=>{ //상벌점 전체 조회-관리자 , 관리자용!
    try{
        const allStudentPoint=await points.findAll();
        ctx.status(200);
        ctx.body=allStudentPoint;
    }catch(error){
        console.error(error);
        return next(error);
    }
});

api.get('/dormitory/individualpoint',async(ctx,next)=>{  //상벌점 본인 조회-로그인한 본인
    const token = ctx.header.token;
    const decoded = await decodeToken(token);
    const StudentId=decoded.user_id; //토큰에서 로그인한 학생의 user_id 가져오기
    try{
        const Studentallstatus=await points.findAll({  //해당 user_id의 학생이 받은 상벌점 현황 싹다 뽑기
            where:{
                receiver_id:StudentId
            }
        });
        
        ctx.status(200);
        ctx.body=Studentallstatus;
    }catch(error){
        console.error(error);
        return next(error);
    }
});

api.put('/dormitory/point/:id',async(ctx,next)=>{  // 상벌점 수정 + student테이블의 point에 값 누적, 관리자용!
    const Request = Joi.object().keys({
        giver_id:Joi.integer().required(),
        receiver_id:Joi.integer().required(),
        kind:Joi.required(),
        amount:Joi.number().integer().required(),
        reason_id:Joi.integer().required(),
        detail:Joi.string().min(2).max(200).required(),
    });

    // 넘어온 body의 형식을 검사한다.
    const Result = Joi.validate(ctx.request.body, Request);

    // 만약 형식이 불일치한다면, 그 이후 문장도 실행하지 않는다.
    if(Result.error) {
        console.log(`/dormitory/point/:id - Joi 형식 에러`);
        ctx.status = 400;
        ctx.body = {
            "error" : "001"
        }
        return;
    }

    const {id}=ctx.params;
    const {giver_id,receiver_id,kind,amount,reason_id,detail}=ctx.request.body;
    try{
        const pastPoint=await points.findAll({ //잘못 저장된 상벌점 점수: pastPoint
            where:{
                point_id:id
            },
            attributes:['amount']
        });

        await points.update({  //수정
            where:{
                point_id:id
            },giver_id,receiver_id,kind,amount,reason_id,detail
        });

        const StudentpastPoint=await Student.findAll({ //student테이블 에서 지금까지 누적된 상벌점 점수: StudentpastPoint
            where:{
                user_id:receiver_id
            },
            attributes:["point"]
        });
        
        await Student.update({ //수정
            where:{
                user_id:receiver_id
            },
            point:StudentpastPoint-pastPoint+amount //지금까지 누적된 점수 - 잘못 저장됬던 점수 + 바른점수
        });
        ctx.status(200);
    }catch(error){
        console.error(error);
        next(error);
    }

});

api.delete('/dormitory/point/:id',async(ctx,next)=>{ //상벌점 삭제 + student테이블의 point에 값 누적, 관리자용!
    const {id}=ctx.params;

    try{
        const columeInformation=await points.findAll({ //삭제할 칼럼에서 상벌점 점수랑 유저 id 받아온다.
            where:{
                point_id:id
            },
            attributes:["amount","receiver_id"]
        });

        await points.delete({  //삭제한다.
            where:{
                point_id:id
            }
        });

        const StudentpastPoint=await Student.findAll({ //student테이블 에서 지금까지 누적된 상벌점 점수
            where:{
                user_id:columeInformation.receiver_id
            },
            attributes:["point"]
        });

        await Student.update({ //삭제된 점수를 빼고 갱신한다.
            where:{
                user_id:columeInformation.receiver_id
            },
            point:StudentpastPoint-columeInformation.amount //누적 점수-삭제할 점수
        });
        ctx.status(200);
        
    }catch(error){
        console.error(error);
        next(error);
    }
});

module.exports=api;