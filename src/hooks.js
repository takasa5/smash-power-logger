import cookie from 'cookie';
import { TwitterAppClient as twClient } from "$lib/_util";
import { getRefreshToken, updateRefreshToken } from "$lib/auth";
import { searchUserByTwitterId } from "$lib/user";
import { v4 as uuid } from 'uuid';

/**
 * セッションIDをもとにDBに格納したリフレッシュトークンを取得し、
 * ログイン情報を再取得する
 * @param sessionId セッションID
 * @return { user: ユーザー情報, token: アクセストークン}
 */
async function getUserInfo(sessionId) {
    const meConfig = {
        "user.fields": 'profile_image_url'
    };
    let refreshToken;
    try {
        refreshToken = await getRefreshToken(sessionId);
        if (!refreshToken) {
            // セッションIDに紐づくリフレッシュトークンが存在しない（未登録またはログアウト済み）
            return {
                token: null,
                user: null
            };
        }
    } catch (err) {
        return {
            token: null,
            user: null
        };
    }
    // リフレッシュトークンでクライアント生成を試みる
    const { client: refreshedClient, accessToken, refreshToken: newRefreshToken} = await twClient.refreshOAuth2Token(refreshToken);
    // リフレッシュトークン更新
    await updateRefreshToken(sessionId, newRefreshToken);
    const { data: userObj } = await refreshedClient.v2.me(meConfig)
    const splId = await searchUserByTwitterId(userObj.id);
    if (!splId) {
        // ログインしているのにSPL IDが存在しないことはありえない
        throw new Error("Invalid request");
    }
    userObj.splId = splId;
    return {
        user: userObj,
        token: accessToken // アクセストークン更新
    };
}

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
        event.locals.user = JSON.parse(cookies.user);
    } else {
        // cookieにauthが生き残っている30秒間はリフレッシュチャレンジをしない
        if (!cookies.auth) {
            // トークン期限切れまたはログアウト済み
            // アクセストークンが失効していた場合、DBからリフレッシュトークンを取得する
            const { user, token } = await getUserInfo(cookies.sessionId);
            if (user && token) {
                event.locals.user = { info: user, token };
            }
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
            cookie.serialize("user", JSON.stringify(event.locals.user), {
                ...cookieOptions,
                maxAge: 7000
            })
        );
    }
    return response;
}

export function getSession(event) {
    return event.locals.user ? event.locals.user.info : {};
}