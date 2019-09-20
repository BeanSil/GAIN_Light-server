import { sleepover_allows, sleepover_applys, sleepover_goouts, sleepover_sleepouts } from '../../models';
import { generateToken, decodeToken } from '../../lib/token';
import { Sequelize } from 'sequelize';
import Joi from 'joi';

import dotenv from 'dotenv';
dotenv.config();

export const test = async (ctx) => {
  await sleepover_allows.create({
    place : "순천"
  });
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
    user_id : decodedUserId,
    place : region
  });
  ctx.body = "거주 지역 등록완료";
}

export const sleepoverApply = async (ctx, next) => {
  const token = ctx.header.token;
  const decoded = await decodeToken(token);
  const decodedUserId = decoded.user_id;
  console.log(decodedUserId);

  let place = await sleepover_allows.findOne({
    where: { user_id: decodedUserId }
  });
  console.log(place);

  // 타시도 학생의 경우에만 밑의 문장을 실행
  try {
    await sleepover_applys.create({
      user_id: decodedUserId
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
  ctx.body = "잔류 신청 완료";
  return
}

export const sleepoverApply_delete = async (ctx, next) => {
  const token = ctx.header.token;
  const decoded = await decodeToken(token);
  const decodedUserId = decoded.user_id;

  try {
    await sleepover_applys.destroy({
      where: { user_id: decodedUserId }
    });
    ctx.body = "잔류 신청 취소 완료";
  } catch (error) {
    console.log(error);
    return next(error);
  }
}





