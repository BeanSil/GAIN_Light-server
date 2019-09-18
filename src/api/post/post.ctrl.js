import Joi from 'joi';
import crypto from 'crypto';
import { user, board } from '../../models';
import { generateToken, decodeToken }from '../../lib/token.js';

//환경변수 설정
import dotenv from 'dotenv';
dotenv.config();

export const uploadBoard = async (ctx) => {

    const UploadPost = Joi.object().keys({
        title : Joi.string().max(255).required(),
        content : Joi.string().max(65535).required(),
        is_anonymous : Joi.boolean(),
        kind : Joi.number().required()
    });

    const result = Joi.validate(ctx.request.body, UploadPost);

     // 비교한 뒤 만약 에러가 발생한다면 400 에러코드를 전송하고, body에 001 이라는 내용(우리끼리의 오류 코드 약속)을 담아 joi 오류임을 알려줌

     if(result.error) {
        console.log("Register - Joi 형식 에러")
        ctx.status = 400;
        ctx.body = {
            "error" : "001"
        }
        return;
    }

    
    const token = ctx.header.token;

    const decoded = await decodeToken(token);

    if(ctx.request.body.kind == 1 || ctx.request.body.kind == "공지사항"){
        const founded = await account.findOne({
            where : {
                "user_id" : decoded.user_id
            }
        });
    
        if(founded == null){
            console.log("관리자 게시판 작성 에러")
            ctx.status = 400;
            ctx.body = {
                "error" : "001"
            }
            return;
        }
        return;
    }
    
    await board.create({
        "title" : ctx.request.body.title,
        "content" : ctx.request.body.content,
        "is_anonymous" : ctx.request.body.is_anonymous,
        "kind" : ctx.request.body.kind
    });

    ctx.body = "success";
}