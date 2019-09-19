import { sleepover_allows, sleepover_applays, sleepover_goouts, sleepover_sleepouts } from '../../models';
import { Sequelize } from 'sequelize';
import Joi from 'joi';

export const test = async (ctx) => {
  console.log("test");
  const School = require('node-school-kr');
  const school = new School();
  school.init(School.Type.HIGH, School.Region.GWANGJU, 'F100000120');

  console.log('학사 일정');
  ctx.body = await school.getCalendar();
}

export const sleepoverApply = async (ctx, next) => {
  region = await sleepover_allows.findOne({
    where : {user_id : ctx.request.body.user_id}
  });
  
  // 타시도 학생의 경우에만 밑의 문장을 실행
  try{
    await sleepover_applays.create({
      apply_id : pk,
      user_id : ctx.request.body.user_id,
      created_at : new Date()
    });
  }catch{
    console.log(error);
    return next(error);
  }
  
  
}
