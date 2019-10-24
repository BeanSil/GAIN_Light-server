import Joi from 'joi';
import { board,account, board_comment, board_likability, board_com_likability, board_data} from '../../models';
import { decodeToken }from '../../lib/token.js';

//환경변수 설정
import dotenv from 'dotenv';

dotenv.config();

// 게시판 업로드
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
        console.log("Register - Joi 형식 에러");
        ctx.status = 400;
        ctx.body = {
            "error" : "001"
        };
        return;
    }
    
    const token = ctx.header.token;

    const decoded = await decodeToken(token);

    if(ctx.request.body.kind === 1){ // 만약 작성하려는 게시판이 공지사항 게시판이라면
        const founded = await account.findOne({  // user_id를 불러와 
            where : {
                "user_id" : decoded.user_id
            }
        });
        
        if(founded.auth === "학생" || founded.auth === "게스트"){  // 선생님인지 확인
            console.log("관리자 게시판 작성 에러");
            ctx.status = 400;
            ctx.body = {
                "error" : "101"
            };
            return; 
        }
    }
    // 공지사항 게시판 작성이 아니거나, user_id가 선생님이 공지사항을 작성한다면 게시판 create
        await board.create({
            "user_id" : decoded.user_id,
            "title" : ctx.request.body.title,
            "content" : ctx.request.body.content,
            "is_anonymous" : ctx.request.body.is_anonymous,
            "kind" : ctx.request.body.kind
        });

        ctx.status = 200;
        ctx.body = decoded.user_id;
};

// 댓글 업로드
export const uploadComment = async (ctx) => {

        const Uploadboard_Comment = Joi.object().keys({
        user_id : Joi.number().required(),
        parent_id : Joi.number(),
        content : Joi.string().max(65535).required()
    });

    const result = Joi.validate(ctx.request.body, Uploadboard_Comment);

    if(result.error) {
        console.log("Register - Joi 형식 에러");
        ctx.status = 400;
        ctx.body = {
            "error" : "002"
        };
        return;
    }


    if(ctx.request.body.parent_id != null){
        const a = await board_comment.findOne({
            where : {
                "comment_id" : ctx.request.body.parent_id
            }
        });
        console.log(a);
        if(a.parent_id != null){
            console.log("parent_id exist");
            ctx.status = 405;
            ctx.body = {
                "error" : "002"
            };
            return;
        }
    }
    
    const token = ctx.header.token;

    const decoded = await decodeToken(token);

    await board_comment.create({
        "board_id" : ctx.params.board_id,
        "user_id" : decoded.user_id,
        "parent_id" : ctx.request.body.parent_id,
        "content" : ctx.request.body.content
    });
    
    ctx.status = 200;
    ctx.body = decoded.user_id;
};

// 게시판 가져오기
export const GetPost = async (ctx) => {

    const kind = ctx.query.kind;
    const board_id = ctx.params.board_id;

    //게시판 종류 가져오기 (ex: 공지사항, 자료실, 일반게시판)
    const getboard = await board.findAll({
        where : {
            "kind" : kind
        }
    });

    // 게시판에 해당하는 내용 불러오기
    const getcomment = await board_comment.findAll({
        where : {
            "board_id" : board_id
        }
    });

    // 부모 댓글 불러오기
    const parentcomment = await board_comment.findAll({
        where : {
            "parent_id" : null
        }
    });

    let needboard = [];
    for(let i in getboard){
        if(getboard[i].is_anonymous === true){ // 로그아웃된 상태라면 작성자 즉, user_id가 공백
            // 게시판에 push로 내용 추가
            needboard.push({
                "board_id" : getboard[i].board_id,
                "user_id" : " ",
                "title" : getboard[i].title,
                "content" : getboard[i].content,
                "createdAt" : getboard[i].createdAt
            });
        } else {
            needboard.push({
                "board_id" : getboard[i].board_id,
                "user_id" : getboard[i].user_id,
                "title" : getboard[i].title,
                "content" : getboard[i].content,
                "createdAt" : getboard[i].createdAt
            });
        }
    }
   
    for(let i in parentcomment){
        parentcomment[i].dataValues.sons = [];
        const soncomment = await board_comment.findAll({
            where : {// 댓글의 id(comment_id)가 부모댓글(parent_id)인 것을 찾아서 soncomment에 넣음
                "parent_id" : parentcomment[i].comment_id
            }
        });

        for (let j in soncomment) {//자식댓글 push로 추가
            parentcomment[i].dataValues.sons.push(soncomment[j]);
        }
    }

    console.log(parentcomment);
    ctx.body = parentcomment;

};

// 게시판 좋아요
export const board_res = async (ctx) => {

    const uploadboard_res = Joi.object().keys({
        user_id : Joi.number().required(),
        likability : Joi.number()
    });

    const result = Joi.validate(ctx.request.body, uploadboard_res);

    if(result.error) {
        console.log("Register - Joi 형식 에러");
        ctx.status = 400;
        ctx.body = {
            "error" : "003"
        };
        return;
    }

    const token = ctx.header.token;

    const decoded = await decodeToken(token);

    await board_likability.create({
        "board_id" : ctx.params.board_id,
        "user_id" : decoded.user_id,
        "likability" : ctx.request.body.likability
    });

    ctx.status = 200;
};

// 댓글 좋아요
export const board_com_res = async (ctx) => {

    const uploadBoard_com_res = Joi.object().keys({
        comment_id : Joi.number().required(),
        user_id : Joi.number().required(),
        likability : Joi.number().required()
    });

    const result = Joi.validate(ctx.request.body, uploadBoard_com_res);

    if(result.error) {
        console.log("Register - Joi 형식 에러");
        ctx.status = 400;
        ctx.body = {
            "error" : "004"
        };
        return;
    }

    const token = ctx.header.token;

    const decoded = await decodeToken(token);

    // 좋아요를 누르면 좋아요를 누른 내용 id와 좋아요를 누른 사용자와, '좋아요' 문자 db create
    await board_com_likability.create({
       "comment_id" : ctx.params.comment_id,
       "user_id" : decoded.user_id,
       "likability" : ctx.request.body.likability
    });

    ctx.status = 200;
};

//게시판 삭제
export const DeletePost = async (ctx) => {
    // TODO: 유저 권한 확인
    
    const boardIdVerify = Joi.object().keys({
        board_id: Joi.string().regex(/^\d+$/).required()
    });
    
    const verification = Joi.validate(ctx.params, boardIdVerify);
    
    if (verification.error) {
        console.log("DeleteBoard - Joi 형식 에러");
        ctx.status = 400;
        ctx.body = {
            "error" : "002"
        };
        return;
    }
    
    const result = await board.destroy({where: {board_id: ctx.params.board_id}});
    
    if (!result) {
        console.log("DeleteBoard - 대상이 존재하지 않음");
        ctx.status = 400;
        ctx.body = {
            "error" : "003"
        };
        return;
    }
    
    ctx.body = {
        is_succeed: true
    }
};

// 댓글 삭제
export const DeleteComment = async (ctx) => {
    // TODO: 유저 권한 확인
    
    const commentIdVerify = Joi.object().keys({
        comment_id: Joi.string().regex(/^\d+$/).required()
    });
    
    const verification = Joi.validate(ctx.params, commentIdVerify);
    
    if (verification.error) {
        console.log("DeleteComment - Joi 형식 에러");
        ctx.status = 400;
        ctx.body = {
            "error" : "002"
        };
        return;
    }
    
    const result = await board_comment.destroy({where: {comment_id: ctx.params.comment_id}});
    
    if (!result) {
        console.log("DeleteComment - 대상이 존재하지 않음");
        ctx.status = 400;
        ctx.body = {
            "error" : "003"
        };
        return;
    }
    
    ctx.body = {
        is_succeed: true
    }
};

// 게시판 정보
export const BoardData = async (ctx) => {

    const Uploadboard_data = Joi.object().keys({
        board_id : Joi.number().required(),
        upload_url : Joi.string().max(62525)
    });

    const result = Joi.validate(ctx.request.body, Uploadboard_data);

     // 비교한 뒤 만약 에러가 발생한다면 400 에러코드를 전송하고, body에 001 이라는 내용(우리끼리의 오류 코드 약속)을 담아 joi 오류임을 알려줌

     if(result.error) {
        console.log("Register - Joi 형식 에러");
        ctx.status = 400;
        ctx.body = {
            "error" : "001"
        };
        return;
    }

        await board_data.create({
            "board_id" : ctx.request.body.board_id,
            "upload_url" : ctx.request.body.upload_url
        });

        ctx.status = 200;
        ctx.body = ctx.request.body.board_id;
}