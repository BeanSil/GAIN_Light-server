import {account} from '../../models';
import { decodeToken } from '../../lib/token';


export const isLoggedIn = async (ctx,next) =>{  //로그인 했는지 검사
    console.log('로그인 체크 진입');
    const token = ctx.header.token;
    const decoded = await decodeToken(token);

    if(decoded.user_id){   //토큰이 있으면 통과! 
        console.log('로그인 확인됨!');
        next();
    }else{
        console.log("로그인이 필요합니다!");
        ctx.body="로그인 필요";
    }
};

export const adminLoggedIn = async (ctx,next) => { //관리자(선생님) 인지 검사
    console.log('어드민체크 진입');
    const token = ctx.header.token;
    const decoded = await decodeToken(token);
    const StudentId = decoded.user_id; //토큰에서 로그인한 회원의 user_id 가져오기
    console.log(StudentId);
    try{
        console.log(StudentId);
        const userAuth = await account.findOne({
            where:{
                user_id:StudentId
            }
        });
        console.log(userAuth.auth);

    
        if(userAuth.auth=="선생님"){
            console.log('선생님 확인됨!');
            next();
        }else{
            console.log("선생님이 아닙니다!");
            ctx.body = "error";
            console.log("ㅁㅇㄻㄴㅇㄹ");
        }
    }catch(error){
        console.error(error);
    }
};

export const studentLoggedIn = async (ctx,next) =>{//학생인지 검사
    const token = ctx.header.token;
    const decoded = await decodeToken(token);
    const StudentId=decoded.user_id; //토큰에서 로그인한 회원의 user_id 가져오기

    try{
        const userAuth=await account.findAll({
            where:{
                user_id:StudentId
            },
            attributes:["auth"]
        });
        if(userAuth.auth==="학생"){
            console.log("학생 확인됨!");
            next();
        }else{
            console.log("학생이 아닙니다!");
                ctx.body = {
                    error : '학생이 아닙니다!'
                };
        }
    }catch(error){
        console.error(error);
    }
    
};