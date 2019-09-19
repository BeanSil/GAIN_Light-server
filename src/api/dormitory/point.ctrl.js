import Router from 'koa-router';
import Joi from 'joi';
import {points,pointReasons,Student} from '../../models';

const api= new Router();

api.post('/dormitory/point',async(ctx,next)=>{  //상벌점 등록 + student테이블의 point에 값 누적  
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

    }catch(error){
        console.error(error);
        return next(error);
    } 
});

api.get('/dormitory/allpoint',async(ctx,next)=>{ //상벌점 전체 조회-관리자
    try{
        const allStudentPoint=await points.findAll();
        ctx.body=allStudentPoint;
    }catch(error){
        console.error(error);
        return next(error);
    }
});

api.get('/dormitory/individualpoint/:id',async(ctx,next)=>{  //상벌점 본인 조회-로그인한 본인
    const StudentId=ctx.params;  //프론트에서 user_id를 보내야 한다!
    try{
        const Studentallstatus=await points.findAll({  //해당 user_id의 학생이 받은 상벌점 현황 싹다 뽑기
            where:{
                receiver_id:StudentId
            }
        });
        ctx.body=Studentallstatus;
    }catch(error){
        console.error(error);
        return next(error);
    }
});

api.put('/dormitory/point',async(ctx,next)=>{  // 상벌점 수정 

});

module.exports=api;