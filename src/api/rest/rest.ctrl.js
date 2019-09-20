import { sleepover_allows, sleepover_applys, sleepover_goouts, sleepover_sleepouts } from '../../models';
import { generateToken, decodeToken } from '../../lib/token';
import { Sequelize } from 'sequelize';
import Joi from 'joi';

import dotenv from 'dotenv';
dotenv.config();

export const test = async (ctx) => {
  const token = ctx.header.token;
  const decoded = await decodeToken(token);
  console.log(decoded);
}

export const applyPlace = async (ctx, next) => {
  const token = ctx.header.token;
  const decoded = await decodeToken(token);
  const decodedUserId = decoded.user_id;
  console.log(decodedUserId);
  console.log(ctx.request.body);

  // await sleepover_allows.create({
  //   user_id : decodedUserId,
  //   place : ctx.request.body.place
  // });
  ctx.body = "거주 지역 등록완료";
}

export const sleepoverApply = async (ctx, next) => {
  const token = ctx.header.token;
  const decoded = await decodeToken(token);
  const decodedUserId = decoded.user_id;
  console.log(decodedUserId);
  console.log(ctx.request.body);

  const region = await sleepover_allows.findOne({
    where : {user_id : decodedUserId}
  });
  console.log(region);
  
  // 타시도 학생의 경우에만 밑의 문장을 실행
  // try{
  //   await sleepover_applys.create({
  //     user_id : decoded
  //   });
  // }catch(error){
  //   console.log(error);
  //   return next(error);
  // }
  // ctx.body = "잔류 신청 완료";
  // return 
}

export const sleepoverApply_ = async (ctx, next) => {
  const token = ctx.header.token;
  const decoded = await decodeToken(token);

}

