import {accounts} from '../../models';

exports.isLoggedIn=(ctx,next)=>{  //로그인 했는지 검사
    if(ctx.header.token){   //토큰이 있으면 통과! 
        next();
    }else{
        ctx.status(403);
        ctx.body="로그인 필요";
    }
};

exports.adminLoggedIn=async(ctx,next)=>{ //관리자(선생님) 인지 검사
    const token = ctx.header.token;
    const decoded = await decodeToken(token);
    const StudentId=decoded.user_id; //토큰에서 로그인한 회원의 user_id 가져오기

    const userAuth=await accounts.findAll({
        where:{
            user_id:StudentId
        },
        attributes:["auth"]
    });

    if(userAuth=="선생님"){
        next();
    }else{
        ctx.status(403);
        ctx.body="선생님이 아닙니다!";
    }
};

exports.studentLoggedIn=(ctx,next)=>{//학생인지 검사
    const token = ctx.header.token;
    const decoded = await decodeToken(token);
    const StudentId=decoded.user_id; //토큰에서 로그인한 회원의 user_id 가져오기

    const userAuth=await accounts.findAll({
        where:{
            user_id:StudentId
        },
        attributes:["auth"]
    });
    if(userAuth=="학생"){
        next();
    }else{
        ctx.status(403);
        ctx.body="학생이 아닙니다!";
    }
};