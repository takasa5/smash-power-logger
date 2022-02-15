import cookie from 'cookie';
import { v4 as uuid } from 'uuid';

// リクエストが呼ばれるたびに実行されるメソッド
export const handle = async({ event, resolve }) => {
    // 初回アクセス時にUUIDを設定する
    const cookies = cookie.parse(event.request.headers.get('cookie') || '');
    const user = cookies.user ? JSON.parse(cookies.user) : {};
    event.locals.userid = user.userid || uuid();

    const response = await resolve(event);
    const setter = {};
    if (event.locals.userid) {
        setter["userid"] = event.locals.userid;
    }
    if (event.locals.auth) {
        setter["codeVerifier"] = event.locals.auth.codeVerifier;
        setter["state"] = event.locals.auth.state;
    }
    response.headers.set(
        "set-cookie",
        cookie.serialize("user", JSON.stringify(setter), {
            path: '/',
            httpOnly: true
        })
    );
    return response;
}

export function getSession(event) {
    const cookies = cookie.parse(event.request.headers.get('cookie') || '');
    console.log(cookies);
    return cookies.user ? JSON.parse(cookies.user) : {};
}