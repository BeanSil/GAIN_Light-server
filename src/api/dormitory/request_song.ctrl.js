import Joi from 'joi';
import { decodeToken } from '../../lib/token.js'
import { account, req_song } from '../../models';

export const SongRequest = async (ctx) => {
    const Request = Joi.object().keys({
        song_name : Joi.string().required(),
        singer_name : Joi.string().required(),
        youtube_url : Joi.string().required()
    });

    const Result = Joi.validate(ctx.request.body, Request);

    //비교 후 에러발생시 400에러코드 전송, body에 001로 오류임을 알린다.
    
    if(Result.error) {
        console.log("SongRequest - Joi 형식 에러")
        ctx.status = 400;
        ctx.body = {
            "error" : "001"
        }
        return;
    }

    //학생이 신청하는 것인가?
    const user = await decodeToken(ctx.header.token);
    
    console.log(user.user_id);

    const founded = await account.findOne({
        where : {
            user_id : user.user_id
        }
    });

    if(founded.auth != '학생') {
        console.log(`SongRequest - 학생이 아닙니다.`);
        ctx.status = 400;
        ctx.body = {
            "error" : "some errorcode"
        }
        return;
    }

    //노래 신청
    await req_song.create({
        "title" : ctx.request.body.song_name,
        "artist" : ctx.request.body.singer_name,
        "url" : ctx.request.body.youtube_url,
        "user_id" : user.user_id
    });

    console.log(`SongRequest - 노래 신청이 완료되었습니다. 노래이름 : ${ctx.request.body.song_name}`)

    ctx.status = 200;
    ctx.body = {
        "user_id" : user.user_id
    }
}

