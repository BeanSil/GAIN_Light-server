import { account } from '../../models';
import { sleepover_allows, sleepover_applies, sleepover_goouts, sleepover_sleepouts } from '../../models';
import { generateToken, decodeToken } from '../../lib/token';
import { Sequelize } from 'sequelize';
import Joi from 'joi';

import dotenv from 'dotenv';
dotenv.config();

export const checkPlace = async (ctx) => {
  const token = ctx.header.token;
  const decoded = await decodeToken(token);
  const decodedUserId = decoded.user_id;

  let check = await sleepover_allows.findOne({
    where : {user_id : decodedUserId}
  });
  console.log(check.place);
}

export const byung = async (ctx) => {
  const Registeration = Joi.object().keys({
    "place": Joi.string().required()
  });
  const result = Joi.validate(ctx.request.body, Registeration);

  // 비교한 뒤 만약 에러가 발생한다면 400 에러코드를 전송하고, body에 001 이라는 내용(우리끼리의 오류 코드 약속)을 담아 joi 오류임을 알려줌
  if (result.error) {
    console.log("RegGuest - Joi 형식 에러")
    ctx.status = 400;
    ctx.body = {
      "error": "001"
    }
    return;
  }

  console.log('applyPlace 입장');
  const region = ctx.request.body.place;
  console.log(region);
  ctx.body = ctx.request.body.place;

  const token = ctx.header.token;
  const decoded = await decodeToken(token);
  const decodedUserId = decoded.user_id;
  console.log(decodedUserId);

  await sleepover_allows.create({
    "user_id" : decodedUserId,
    "place" : region
  });
  ctx.body = "거주 지역 등록완료";
}

export const sleepoverApplies = async (ctx, next) => {
  const token = ctx.header.token;
  const decoded = await decodeToken(token);
  const decodedUserId = decoded.user_id;
  // console.log(decodedUserId);

  let apply = await sleepover_allows.findOne({
    where: { user_id: decodedUserId },
    attributes:['place']
  });
  console.log("플레이스::",apply.place);

  let acnt = await account.findOne({
    where: {user_id : decodedUserId}
  });
  console.log("어스::", acnt.auth);

  if (acnt.auth != "학생"){
    ctx.status = 400;
    ctx.body = {
      "error" : "학생만 잔류를 신청할 수 있습니다."
    };
    return;
  }else if (apply.place == "광주"){
    ctx.status = 400;
    ctx.body = {
      "error" : "타시도 학생만 잔류를 신청할 수 있습니다."
    };
    return;
  }
  
  try {
    await sleepover_applies.create({
      "user_id": decodedUserId
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
  ctx.body = "잔류 신청 완료";
  return;
  
}

export const sleepoverApplies_delete = async (ctx, next) => {
  const token = ctx.header.token;
  const decoded = await decodeToken(token);
  const decodedUserId = decoded.user_id;
  console.log(decodedUserId);
  try {
    await sleepover_applies.destroy({
      where: { user_id: decodedUserId }
    });
    ctx.body = "잔류 신청 취소 완료";
  } catch (error) {
    console.log(error);
    return next(error);
  }
}

export const sleepoverApplies_check = async (ctx, next) => {
  const token = ctx.header.token;
  const decoded = await decodeToken(token);
  const decodedUserId = decoded.user_id; 

  try{
    let applies = await sleepover_applies.findOne({
      where : { user_id : decodedUserId }
    });
  }catch (error) {
    console.log(error);
    return next(error);
  }
  console.log(applies.apply_id, applies.created_at);
}








