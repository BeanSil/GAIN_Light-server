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

export const SongList = async (ctx) => {
    
    const user = await decodeToken(ctx.header.token);

    if(!user) {
        console.log(`SongList - 존재하지 않는 유저입니다.`);

        ctx.status = 400;
        ctx.body = {
            "error" : "some errorcode"
        }
        return;
    }

    //JSON 배열 만들기
    const userList = await req_song.findAll({
        where : {
            user_id : user.user_id
        }
    });

    let userSongArray = [];

    for(var i in userList) {
        const record = {
            song_id : userList[i].rs_id,
            song_name : userList[i].title,
            singer_name : userList[i].artist,
            youtube_url : userList[i].url,
            user_id : userList[i].user_id,
            status : userList[i].status,
            created_at : userList[i].created_at
        }
        userSongArray.push(record);
    }

    const list = await req_song.findAll();

    let songArray = [];

    for(var i in list) {
        const record = {
            song_name : list[i].title,
            singer_name : list[i].artist,
            youtube_url : list[i].url,
            user_id : list[i].user_id,
            status : list[i].status,
            created_at : list[i].created_at
        }
        songArray.push(record);
    }
    
    console.log(`SongList - 노래신청목록을 반환하였습니다.`)

    ctx.status = 200;
    ctx.body = {
        "user_song_list" : userSongArray,
        "song_list" : songArray
    }

}
