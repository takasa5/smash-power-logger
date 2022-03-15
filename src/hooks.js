import { signJwt, verifyJwt } from '$lib/auth';
import cookie from 'cookie';
import { v4 as uuid } from 'uuid';

// リクエストが呼ばれるたびに実行されるメソッド
export const handle = async({ event, resolve }) => {
    // console.log(event.url.href);
    // cookieから値を復元し、event.localsに代入することでサーバーへ送信
    const cookies = cookie.parse(event.request.headers.get('cookie') || '');
    if (cookies.sessionId) {
        event.locals.sessionId = cookies.sessionId;
    }
    if (cookies.auth) {
        event.locals.auth = JSON.parse(cookies.auth);
    }
    if (cookies.user) {
        try {
            event.locals.user = verifyJwt(cookies.user);
        } catch (err) {
            // 認証失敗でクッキー消去
            const response = await resolve(event);
            response.headers.set(
                "set-cookie",
                cookie.serialize("user", "", {
                    path: '/',
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 0
                })
            );
            return response;
        }
    }
    // *******************************************
    // resolve内部でJSファイルの各メソッドが呼ばれる
    // *******************************************
    const response = await resolve(event);
    const cookieOptions = {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    };
    // セッションIDはなければ必ずcookieにセット
    if (!cookies.sessionId) {
        event.locals.sessionId = uuid();
        response.headers.set(
            "set-cookie",
            cookie.serialize("sessionId", event.locals.sessionId, {
                ...cookieOptions,
                sameSite: "lax"
            })
        );
        return response;
    }
    // OAuthのための認証情報はcookieがなく変数が存在した場合のみセット
    if (("auth" in event.locals && cookies.auth != event.locals.auth)) {
        response.headers.set(
            "set-cookie",
            cookie.serialize("auth", JSON.stringify(event.locals.auth), {
                ...cookieOptions,
                sameSite: "Lax", // authはリダイレクトで利用する
                maxAge: 60
            })
        );
        return response;
    }
    if (!cookies.user && "user" in event.locals) {
        response.headers.set(
            "set-cookie",
            cookie.serialize("user", signJwt(event.locals.user), {
                ...cookieOptions,
                maxAge: 60 * 60 * 24 * 14
            })
        );
    }
    return response;
}

export function getSession(event) {
    return event.locals.user ? event.locals.user.info : null;
}