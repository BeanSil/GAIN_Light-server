import Joi from 'joi';
import { board,account, board_comment, board_likability, board_com_likability} from '../../models';
import { decodeToken }from '../../lib/token.js';

//환경변수 설정
import dotenv from 'dotenv';
import { decode } from 'punycode';

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
            "error" : "002"
        }
        return;
    }

    if(ctx.request.body.parent_id != null){
        const a = await board_comment.findOne({
            where : {
                "comment_id" : ctx.request.body.parent_id
            }
        });
        console.log(a)
        if(a.parent_id != null){
            console.log("parent_id exist")
            ctx.status = 405;
            ctx.body = {
                "error" : "002"
            }
            return;
        }
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
    const board_id = ctx.query.board_id;

    const getboard = await board.findAll({
        where : {
            "kind" : kind
        }
    });

    ctx.body = getboard;

    const getcomment = await board_comment.findAll({
        where : {
            "board_id" : board_id
        }
    });

    ctx.body = getcomment;

    const parentcomment = await board_comment.findAll({
        where : {
            "parent_id" : null
        }
    });

    ctx.body = parentcomment;

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

    const token = ctx.header.token;

    const decoded = await decodeToken(token);

    let soncomment = [];
    for(var i in parentcomment){
        soncomment.push({
            "comment_id" : parentcomment[i].comment_id,
            "user_id" : decoded.user_id,
            "content" : parentcomment[i].content,
            "created_at" : parentcomment[i].created_at
        })
    }

    ctx.body = soncomment;
    // ctx.status = 200;
    // ctx.body = {
    //     "list" : needboard
    // }
}

export const board_res = async (ctx) => {

    const uploadboard_res = Joi.object().keys({
        board_id : Joi.number().required(),
        user_id : Joi.number().required(),
        likability : Joi.number()
    });

    const result = Joi.validate(ctx.request.body, uploadboard_res);

    if(result.error) {
        console.log("Register - Joi 형식 에러")
        ctx.status = 400;
        ctx.body = {
            "error" : "003"
        }
        return;
    }

    const token = ctx.header.token;

    const decoded = await decodeToken(token);

    await board_likability.create({
        "board_id" : ctx.request.body.board_id,
        "user_id" : decoded.user_id,
        "likability" : ctx.request.body.likability
    });

    ctx.status = 200;
    ctx.body = "success";
}

export const board_com_res = async (ctx) => {

    const uploadBoard_com_res = Joi.object().keys({
        comment_id : Joi.number().required(),
        user_id : Joi.number().required(),
        likability : Joi.number().required()
    });

    const result = Joi.validate(ctx.request.body, uploadBoard_com_res);

    if(result.error) {
        console.log("Register - Joi 형식 에러")
        ctx.status = 400;
        ctx.body = {
            "error" : "004"
        }
        return;
    }

    const token = ctx.header.token;

    const decoded = await decodeToken(token);

    await board_com_likability.create({
       "comment_id" : ctx.request.body.comment_id,
       "user_id" : decoded.user_id,
       "likability" : ctx.request.body.likability
    
    });

    ctx.status = 200;
    ctx.body = "success";
};

export const DeleteBoard = async (ctx) => {
};

export const DeleteComment = (ctx) => {
};