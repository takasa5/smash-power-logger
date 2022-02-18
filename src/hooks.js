import cookie from 'cookie';
import { DynamoDB as ddb, TwitterAppClient as twClient } from "$lib/_util";
import { TwitterApi } from "twitter-api-v2";
import { v4 as uuid } from 'uuid';

/**
 * Twitter APIを利用したユーザー情報取得メソッド
 * @param token アクセストークン
 * @param sessionId セッションID
 * @return { user: ユーザー情報, token: （更新される場合）アクセストークン}
 */
async function getUserInformation(token, sessionId) {
    const meConfig = {
        "user.fields": 'profile_image_url'
    };
    if (!sessionId) {
        return {
            user: {},
            token: null
        };
    }
    if (!token) {
        try {
            // アクセストークンが失効していた場合、DBからリフレッシュトークンを取得する
            const result = await ddb.get({
                TableName: "SmashPowerLoggerRefreshTokenTable",
                Key: {
                    session_id: sessionId
                }
            }).promise();
            const refreshToken = result.Item["refresh_token"];
            // リフレッシュトークンでクライアント生成を試みる
            const { client: refreshedClient, accessToken, refreshToken: newRefreshToken} = await twClient.refreshOAuth2Token(refreshToken);
            // リフレッシュトークン更新
            await ddb.put({
                TableName: "SmashPowerLoggerRefreshTokenTable",
                Item: {
                    session_id: sessionId,
                    refresh_token: newRefreshToken
                }
            }).promise();
            const { data: userObj } = await refreshedClient.v2.me(meConfig)
            return {
                user: userObj,
                token: accessToken // アクセストークン更新
            };
        } catch (err) {
            return {
                user: {},
                token: null
            };
        }
    }
    const client = new TwitterApi(token);
    const { data: userObj } = await client.v2.me(meConfig);
    // まだ利用可能なときはアクセストークンは更新（Cookieにセット）しない
    return {
        user: userObj,
        token: null
    };
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
    const { userObj, token } = await getUserInformation(cookies.token, cookies.sessionId);
    event.locals.user = userObj;
    if (token) {
        event.locals.token = token;
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
            cookie.serialize("token", event.locals.token, {
                ...cookieOptions,
                maxAge: 7000
            })
        );
    }
    return response;
}

export function getSession(event) {
    return event.locals.user || {};
}