import Joi from 'joi';
import crypto from 'crypto';
import { account, student, teacher, guest } from '../../models';
import { generateToken }from '../../lib/token.js';

const moment = require('moment');

// .env 파일의 환경 변수 불러오기
import dotenv from 'dotenv';
dotenv.config();

export const CheckAuth = async (ctx) => {
    let auth;
    switch(ctx.request.body.authCode){
        case process.env.studentCode:
            auth = 1;
            break;
        case process.env.teacherCode:
            auth = 2;
            break;
        case process.env.guestCode:
            auth = 3;
            break;
        default:
            console.log(`CheckAuth - 지정되지 않은 권한코드입니다. / 입력된 권한코드 : ${ctx.request.body.authCode}`);
            ctx.status = 400;
            ctx.body = {
                "error" : "000"
            }
            return;
    }

    ctx.body = {
        "auth" : auth
    };
}

export const RegStudent = async (ctx) => {

    // Joi 라이브러리를 활용해서 형식을 검사하기 위해 객체를 하나 만들어 줌.
    // 왼쪽의 각 name에 해당하는 값의 요구조건임을 알 수 있다.
    // id를 예시로 들자면 '형식은 string이고, 입력 가능한 것은 alphanum( a-z, A-Z, 0-9 )이고, 최소 6글자 최대 30글자, 무조건 입력되야한다'라는 것을 알 수 있다.
    const Registeration = Joi.object().keys({
        id : Joi.string().alphanum().min(5).max(20).required(),
        password : Joi.string().min(8).max(50).required(),
        grade : Joi.number().integer().max(3).required(),
        class : Joi.number().integer().max(4).required(),
        number : Joi.number().integer().max(25).required(),
        name : Joi.string().min(2).max(20).required(),
        phone : Joi.string().length(11).required(),
        email : Joi.string().email().required()
    });

    const result = Joi.validate(ctx.request.body, Registeration);

    // 비교한 뒤 만약 에러가 발생한다면 400 에러코드를 전송하고, body에 001 이라는 내용(우리끼리의 오류 코드 약속)을 담아 joi 오류임을 알려줌
    if(result.error) {
        console.log("RegStudent - Joi 형식 에러")
        ctx.status = 400;
        ctx.body = {
            "error" : "001"
        }
        return;
    }

    // 아이디 중복체크
    // 사용자가 입력한 id와 동일한 id가 데이터베이스에 있는지 검사하고, 만약 있다면 exist에 저장함
    const exist = await account.findOne({
        where: {
            id : ctx.request.body.id
        }
    });

    // exist의 길이가 0이 아니라면, 중복된 아이디가 있다는 뜻
    // 따라서 만약 중복된 아이디가 있다면, 400 에러코드를 전송하고, body에 002라는 내용을 담아서 보냄
    if(exist != null){
        console.log(`RegStudent - 이미 존재하는 아이디입니다. / 입력된 아이디 : ${ctx.request.body.id}`);

        ctx.status = 400;
        ctx.body = {
            "error" : "002"
        }
        return;
    }
    
    const id = ctx.request.body.id;

    // 비밀번호를 crypto 모듈을 이용해서 암호화해줌.
    const password2 = crypto.createHmac('sha256', process.env.Password_KEY).update(ctx.request.body.password).digest('hex');


    // 학생 코드는 1이기 때문에 auth 를 1으로 지정해 줌.
    const auth = 1;
    
    // 데이터베이스에 값을 저장함.  
    const new_account = await account.create({
        "id" : id,
        "password" : password2,
        "auth" : auth,
        "email" : ctx.request.body.email
    });

    console.log(`RegStudent - 새로운 회원이 저장되었습니다. / 아이디 : ${id}`);

    await student.create({
        "user_id" : new_account.user_id,
        "name" : ctx.request.body.name,
        "grade" : ctx.request.body.grade,
        "class" : ctx.request.body.class,
        "number" : ctx.request.body.number,
        "phone" : ctx.request.body.phone,
    });

    console.log(`RegStudent - 학생 정보를 등록하였습니다. / 유저코드 : ${new_account.user_id}`);

    ctx.status = 200;
    ctx.body = {
        "user_id" : new_account.user_id
    };
}

export const RegTeacher = async (ctx) => {

    // Joi 라이브러리를 활용해서 형식을 검사하기 위해 객체를 하나 만들어 줌.
    // 왼쪽의 각 name에 해당하는 값의 요구조건임을 알 수 있다.
    // id를 예시로 들자면 '형식은 string이고, 입력 가능한 것은 alphanum( a-z, A-Z, 0-9 )이고, 최소 6글자 최대 30글자, 무조건 입력되야한다'라는 것을 알 수 있다.
    const Registeration = Joi.object().keys({
        id : Joi.string().alphanum().min(5).max(20).required(),
        password : Joi.string().min(8).max(50).required(),
        name : Joi.string().min(2).max(20).required(),
        phone : Joi.string().length(11).required(),
        email : Joi.string().email().required()
    });

    const result = Joi.validate(ctx.request.body, Registeration);

    // 비교한 뒤 만약 에러가 발생한다면 400 에러코드를 전송하고, body에 001 이라는 내용(우리끼리의 오류 코드 약속)을 담아 joi 오류임을 알려줌
    if(result.error) {
        console.log("RegTeacher - Joi 형식 에러")
        ctx.status = 400;
        ctx.body = {
            "error" : "001"
        }
        return;
    }

    // 아이디 중복체크
    // 사용자가 입력한 id와 동일한 id가 데이터베이스에 있는지 검사하고, 만약 있다면 exist에 저장함
    const exist = await account.findOne({
        where: {
            id : ctx.request.body.id
        }
    });

    // exist의 길이가 0이 아니라면, 중복된 아이디가 있다는 뜻
    // 따라서 만약 중복된 아이디가 있다면, 400 에러코드를 전송하고, body에 002라는 내용을 담아서 보냄
    if(exist != null){
        console.log(`RegTeacher - 이미 존재하는 아이디입니다. / 입력된 아이디 : ${ctx.request.body.id}`);

        ctx.status = 400;
        ctx.body = {
            "error" : "002"
        }
        return;
    }
    
    const id = ctx.request.body.id;

    // 비밀번호를 crypto 모듈을 이용해서 암호화해줌.
    const password2 = crypto.createHmac('sha256', process.env.Password_KEY).update(ctx.request.body.password).digest('hex');

    const auth = 2;
    
    // 데이터베이스에 값을 저장함.
    const new_account = await account.create({
        "id" : id,
        "password" : password2,
        "auth" : auth,
        "email" : ctx.request.body.email
    });

    console.log(`RegTeacher - 새로운 회원이 저장되었습니다. / 아이디 : ${id}`);

    await teacher.create({
        "user_id" : new_account.user_id,
        "name" : ctx.request.body.name,
        "phone" : ctx.request.body.phone
    });

    console.log(`RegTeacher - 선생 정보를 등록하였습니다. / 유저코드 : ${new_account.user_id}`);

    ctx.status = 200;
    ctx.body = {
        "user_id" : new_account.user_id
    };
}

export const RegGuest = async (ctx) => {

    // Joi 라이브러리를 활용해서 형식을 검사하기 위해 객체를 하나 만들어 줌.
    // 왼쪽의 각 name에 해당하는 값의 요구조건임을 알 수 있다.
    // id를 예시로 들자면 '형식은 string이고, 입력 가능한 것은 alphanum( a-z, A-Z, 0-9 )이고, 최소 6글자 최대 30글자, 무조건 입력되야한다'라는 것을 알 수 있다.
    const Registeration = Joi.object().keys({
        id : Joi.string().alphanum().min(5).max(20).required(),
        password : Joi.string().min(8).max(50).required(),
        name : Joi.string().min(2).max(20).required(),
        phone : Joi.string().length(11).required(),
        email : Joi.string().email().required()
    });

    const result = Joi.validate(ctx.request.body, Registeration);

    // 비교한 뒤 만약 에러가 발생한다면 400 에러코드를 전송하고, body에 001 이라는 내용(우리끼리의 오류 코드 약속)을 담아 joi 오류임을 알려줌
    if(result.error) {
        console.log("RegGuest - Joi 형식 에러")
        ctx.status = 400;
        ctx.body = {
            "error" : "001"
        }
        return;
    }

    // 아이디 중복체크
    // 사용자가 입력한 id와 동일한 id가 데이터베이스에 있는지 검사하고, 만약 있다면 exist에 저장함
    const exist = await account.findOne({
        where: {
            id : ctx.request.body.id
        }
    });

    // exist의 길이가 0이 아니라면, 중복된 아이디가 있다는 뜻
    // 따라서 만약 중복된 아이디가 있다면, 400 에러코드를 전송하고, body에 002라는 내용을 담아서 보냄
    if(exist != null){
        console.log(`RegGuest - 이미 존재하는 아이디입니다. / 입력된 아이디 : ${ctx.request.body.id}`);

        ctx.status = 400;
        ctx.body = {
            "error" : "002"
        }
        return;
    }
    
    const id = ctx.request.body.id;

    // 비밀번호를 crypto 모듈을 이용해서 암호화해줌.
    const password2 = crypto.createHmac('sha256', process.env.Password_KEY).update(ctx.request.body.password).digest('hex');

    const auth = 3;

    // 데이터베이스에 값을 저장함.
    const new_account = await account.create({
        "id" : id,
        "password" : password2,
        "auth" : auth,
        "email" : ctx.request.body.email
    });

    console.log(`RegGuest - 새로운 회원이 저장되었습니다. / 아이디 : ${id}`);

    const expiry_date = moment().tz("Asia/Seoul").add(1, 'M').format('YYYY-MM-DD HH:mm:ss');

    await guest.create({
        "user_id" : new_account.user_id,
        "name" : ctx.request.body.name,
        "phone" : ctx.request.body.phone,
        "expiry_date" : expiry_date
    });

    console.log(`RegGuest - 게스트 정보를 등록하였습니다. / 유저코드 : ${new_account.user_id}`);

    ctx.status = 200;
    ctx.body = {
        "user_id" : new_account.user_id
    };
}

export const Login = async (ctx) => {
    
    // Joi 라이브러리를 활용해서 형식을 검사하기 위해 객체를 하나 만들어 줌.
    const LoginInput = Joi.object().keys({
        id : Joi.string().alphanum().min(5).max(50).required(),
        password : Joi.string().min(5).max(50).required()
    });

    // 넘어온 body의 형식을 검사한다.
    const Result = Joi.validate(ctx.request.body, LoginInput);

    // 만약 형식이 불일치한다면, 그 이후 문장도 실행하지 않는다.
    if(Result.error) {
        console.log(`Login - Joi 형식 에러`);
        ctx.status = 400;
        ctx.body = {
            "error" : "001"
        }
        return;
    }

    // 데이터베이스에 해당하는 아이디가 있는지 검사합니다.
    const founded = await account.findOne({
        where: {
            id : ctx.request.body.id
        }
    });

    if(founded == null){
        console.log(`Login - 존재하지 않는 계정입니다. / 입력된 아이디 : ${ctx.request.body.id}`);
        ctx.status = 400;
        ctx.body = {
            "error" : "003"
        }
        return;
    }

    const input = crypto.createHmac('sha256', process.env.Password_KEY).update(ctx.request.body.password).digest('hex');

    if(founded.password != input){
        console.log(`Login - 비밀번호를 틀렸습니다.`);
        ctx.status = 400;
        ctx.body = {
            "error" : "004"
        }
        return;
    }

    const payload = {
        user_id : founded.user_id
    };

    let token = null;
    token = await generateToken(payload);

    console.log(token);

    ctx.body = {
        token : token
    };

    console.log(`로그인에 성공하였습니다.`)
}