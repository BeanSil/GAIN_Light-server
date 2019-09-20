import { lrnrooms, lrnseats, lrnseat_recommend, Sequelize, sequelize } from "../../models"
import { decodeToken } from "../../lib/token";
import Joi from "joi"
import { account } from "../../models";


export const LrnReserve = async (ctx) =>{

    //Joi 형식 검사
    const Request = Joi.object().keys({
        seat_id: Joi.number().required(),
        laptop: Joi.boolean().required()
    });

    const Result = Joi.validate(ctx.request.body, Request);

    if(Result.error){
        console.log(`LrnReserve - Joi 형식 에러`);
        ctx.status = 400;
        ctx.body = {
            "error" : "some errorcode"
        }
        return;
    }
    
    //학생이 신청하는 것인가?
    try {
        const user = await decodeToken(ctx.header.token);
    } catch (error) {
        console.log(`LrnReserve - 존재하지 않는 유저입니다.`);

        ctx.status = 400;
        ctx.body = {
            "error" : "some errorcode"
        }
        return;
    }
    
    const student = await account.findOne({
        where:{
            user_id: user.user_id
        }
    });

    if(student.auth != '학생'){
        console.log(`LrnReserve - 학생이 아닙니다.`);
        ctx.request = 400;
        ctx.body = {
            "error" : "some errorcode"
        }
        return;
    }

    //이미 신청한 사람인가?
    const reserved = await lrnseat_recommend.findOne({
        where: {
            user_id: user.user_id
        }
    });

    if (reserved) {
        console.log(`LrnReserve - 이미 대여한 유저입니다. 대여 요청한 유저: ${user.user_id}`);

        ctx.status = 400;
        ctx.body = {
            "error": "some errorcode"
        }
        return;
    }

    //신청된 좌석인가?
    const reservedSeat = await lrnseat_recommend.findOne({
        where:{
            lrnseat_id: ctx.request.body.seat_id
        }
    });

    if(reservedSeat){
        console.log(`LrnReserve - 이미 대여된 좌석입니다. 대여 요청한 좌석: ${ctx.request.body.seat_id}`);

        ctx.status = 400;
        ctx.body = {
            "error" : "some errorcode"
        }
        return;
    }
    
    
    //신청 불가능한 실은 아닌가?
    // const possibleSeat = await lrnseats.findOne({
    //     where: {
    //         lrnseat_id: ctx.request.body.seat_id
    //     }
    // });

    // if(possibleSeat == null){
    //     console.log(`LrnReserve - 존재하지 않는 자리입니다.`)

    //     ctx.status = 400;
    //     ctx.body = {
    //         "error" : "some errorcode"
    //     }
    //     return;
    // }

    // const possibleRoom = await lrnrooms.findOne({
    //     where: {
    //         lrnroom_id : possibleSeat.lrnroom_id
    //     }
    // })

    // if(possibleRoom.object == "none"){
    //     console.log(`LrnReserve - 예약 불가능한 학습실 입니다.`);

    //     ctx.status = 400;
    //     ctx.body = {
    //         "error" : "some errorcode"
    //     }
    // }
    
    //현재 신청 가능한 시간인가?
    const currentTime = new Date();
    const currentDay = currentTime.getDay();
    const currnetHour = currentTime.getHours();
    // if(currentDay >= 5){
    //     console.log(`LrnReserve - 예약 불가능한 요일입니다.`)

    //     ctx.status = 400;
    //     ctx.body = {
    //         "error" : "some errorcode"
    //     }
    //     return;
    // }

    if (currnetHour < 9 || currnetHour > 21){
        console.log(`LrnReserve - 예약 불가능한 시간입니다.`)
        
        ctx.status = 400;
        ctx.body = {
            "error": "some errorcode"
        }
        return;
    }    

    //신청
    await lrnseat_recommend.create({
        "lrnseat_id" : ctx.request.body.seat_id,
        "user_id" : user.user_id,
    });

    console.log(`LrnReserve - 예약이 완료되었습니다. 자리 번호: ${ctx.request.body.seat_id}`)

    ctx.status = 200;
    ctx.body = {
        "user_id" : user.user_id
    }
}

export const LrnList = async (ctx) => {
    //로그인 한 유저는 누구인가?
    const user = await decodeToken(ctx.header.token);

    if (!user) {
        console.log(`LrnList - 존재하지 않는 유저입니다.`);
        ctx.status = 400;
        ctx.body = {
            "error": "some errorcode"
        }
        return;
    }

    //대여된 좌석 불러오기

    const time = new Date();
    const today = `${time.getFullYear()}-${"0" + (time.getMonth() + 1)}-${time.getDate()} 00:00:00`;

    const list = await lrnseat_recommend.findAll({
        where : {
            rental_time : today
        }
    });
    
    var record = new Object();
    var seatArray = Array();

    for(var i in list){
        record.seat_id = list[i].lrnseat_id;
        record.user_id = list[i].user_id;
        seatArray.push(record);
    }

    //로그인 한 유저가 대여 하였는가?
    const reserved = await lrnseat_recommend.findOne({
        where: {
            user_id: user.user_id
        }
    });
    
    var seat_id = 0;
    
    if (reserved != null) {
        seat_id = reserved.lrnseat_id;
    }


    //성공 시 반환
    ctx.status = 200;
    ctx.body = {
        "user_seat_id" : seat_id,
        "seat" : seatArray
    }
    console.log(`LrnList - 대여 목록을 반환하였습니다.`)
}

export const LrnCancel = async (ctx) =>{
    //취소하는 사람과 대여한 사람이 일치하는가?
    const reqUser = await decodeToken(ctx.header.token);
    const seat_id = Number(ctx.request.query.seat_id);

    const time = new Date();
    const today = `${time.getFullYear()}-${"0"+(time.getMonth()+1)}-${time.getDate()} 00:00:00`;

    const reserved = await lrnseat_recommend.findOne({
        where :{
            lrnseat_id : seat_id,
            rental_time : today
        }
    });

    if(reserved == null){
        console.log(`LrnCancel - 해당 자리는 예약되지 않았습니다. 자리 번호: ${ctx.query.seat_id}`);
        
        ctx.status = 400;
        ctx.body = {
            "error" : "some errorcode"
        }
        return;
    }

    if (reqUser.user_id != reserved.user_id){
        console.log(`LrnCancel - 요청한 유저와 취소할 유저가 일치하지 않습니다.`);

        ctx.status = 400;
        ctx.body = {
            "error" : "some errorcode"
        }
        return;
    }

    //취소 가능한 시간인가?
    const currentTime = new Date();
    const currentDay = currentTime.getDay();
    const currnetHour = currentTime.getHours();
    // if (currentDay >= 5) {
    //     console.log(`LrnCancel - 취소 불가능한 요일입니다.`)

    //     ctx.status = 400;
    //     ctx.body = {
    //         "error": "some errorcode"
    //     }
    //     return;
    // }

    if (currnetHour < 9 || currnetHour > 21) {
        console.log(`LrnCancel - 취소 불가능한 시간입니다.`)

        ctx.status = 400;
        ctx.body = {
            "error": "some errorcode"
        }
        return;
    }

    //seat_user 테이블에서 정보 지우기
    await lrnseat_recommend.destroy({
        where : {
            lrnseat_id: seat_id,
            rental_time: today
        }
    });

    console.log(`LrnCancel - 자리 예약이 취소되었습니다. 취소된 자리: ${ ctx.query.seat_id }`);
    
    ctx.status = 200;
    ctx.body = {
        "user_id" : reqUser.user_id
    }

}
