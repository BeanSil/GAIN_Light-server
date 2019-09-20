import Joi from 'joi';
import { user, board,account, board_comment } from '../../models';
import { generateToken, decodeToken }from '../../lib/token.js';

//환경변수 설정
import dotenv from 'dotenv';

dotenv.config();

export const uploadBoard = async (ctx) => {

    const UploadPost = Joi.object().keys({
        user_id : Joi.number().required(),
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

    if(ctx.request.body.kind == 1){
        const founded = await account.findOne({
            where : {
                "user_id" : decoded.user_id
            }
        });
        
        if(founded.auth == "학생" || founded.auth == "게스트"){
            console.log("관리자 게시판 작성 에러")
            ctx.status = 400;
            ctx.body = {
                "error" : "101"
            }
            return; 
        }
    }
        await board.create({
            "user_id" : decoded.user_id,
            "title" : ctx.request.body.title,
            "content" : ctx.request.body.content,
            "is_anonymous" : ctx.request.body.is_anonymous,
            "kind" : ctx.request.body.kind
        });

        ctx.status = 200;
        ctx.body = decoded.user_id;
}

export const uploadcomment = async (ctx) => {

        const Uploadboard_Comment = Joi.object().keys({
        board_id : Joi.number().required(),
        user_id : Joi.number().required(),
        parent_id : Joi.number(),
        content : Joi.string().max(65535).required()
    });

    const result = Joi.validate(ctx.request.body, Uploadboard_Comment);

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

    await board_comment.create({
        "board_id" : ctx.request.body.board_id,
        "user_id" : decoded.user_id,
        "parent_id" : ctx.request.body.parent_id,
        "content" : ctx.request.body.content
    });
    ctx.status = 200;
    ctx.body = decoded.user_id;
}

export const getBoard = async (ctx) => {

    const kind = ctx.query.kind;

    const getboard = await board.findAll({
        where : {
            "kind" : kind
        }
    });

    ctx.body = getboard;

    let needboard = [];
    for(var i in getboard){
        if(getboard[i].is_anonymous == true){
            needboard.push({
                "board_id" : getboard[i].board_id,
                "user_id" : " ",
                "title" : getboard[i].title,
                "content" : getboard[i].content,
                "createdAt" : getboard[i].createdAt
            });
        }else{
            needboard.push({
                "board_id" : getboard[i].board_id,
                "user_id" : getboard[i].user_id,
                "title" : getboard[i].title,
                "content" : getboard[i].content,
                "createdAt" : getboard[i].createdAt
            });
        }
        
    }

    ctx.status = 200;
    ctx.body = {
        "list" : needboard
    }

}
