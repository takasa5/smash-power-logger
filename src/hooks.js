import cookie from 'cookie';
import { TwitterApi } from "twitter-api-v2";
import { v4 as uuid } from 'uuid';

async function getUserInformation(token) {
    const client = new TwitterApi(token);
    const { data: userObj } = await client.v2.me(
        {
            "user.fields": 'profile_image_url'
        }
    );
    return userObj;
}

// リクエストが呼ばれるたびに実行されるメソッド
export const handle = async({ event, resolve }) => {
    // cookieから値を復元し、event.localsに代入することでサーバーへ送信
    const cookies = cookie.parse(event.request.headers.get('cookie') || '');
    if (cookies.sessionId) {
        event.locals.sessionId = cookies.sessionId;
    }
    if (cookies.auth) {
        event.locals.auth = JSON.parse(cookies.auth);
    }
    if (cookies.token) {
        event.locals.token = cookies.token;
        event.locals.user = await getUserInformation(cookies.token);
    }
    // *******************************************
    // resolve内部でJSファイルの各メソッドが呼ばれる
    // *******************************************
    const response = await resolve(event);
    const cookieOptions = {
        path: '/',
        httpOnly: true
    };
    // セッションIDはなければ必ずcookieにセット
    if (!cookies.sessionId) {
        event.locals.sessionId = uuid();
        response.headers.set(
            "set-cookie",
            cookie.serialize("sessionId", event.locals.sessionId, cookieOptions)
        );
        return response;
    }
    // OAuthのための認証情報はcookieがなく変数が存在した場合のみセット
    if (!cookies.auth && event.locals.auth) {
        response.headers.set(
            "set-cookie",
            cookie.serialize("auth", JSON.stringify(event.locals.auth), cookieOptions)
        );
        return response;
    }
    if (!cookies.token && event.locals.token) {
        response.headers.set(
            "set-cookie",
            cookie.serialize("token", event.locals.token, cookieOptions)
        );
    }
    return response;
}

export function getSession(event) {
    return event.locals.user || {};
}