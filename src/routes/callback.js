import { createUserIfNotExist } from "$lib/user";
import { upsertRefreshToken } from "$lib/auth";
import { TwitterApi } from "twitter-api-v2";
import dotenv from "dotenv";
dotenv.config();

export async function get({ url, locals }) {
    const client = new TwitterApi({
        clientId: process.env.TWITTER_CLIENT_ID,
        clientSecret: process.env.TWITTER_CLIENT_SECRET
    });

    const query = url.searchParams;
    const state = query.get("state");
    const code = query.get("code");
    // localsから情報を取得
    const sessionState = locals.auth.state;
    const codeVerifier = locals.auth.codeVerifier;

    if (!state || !code || !sessionState || !codeVerifier) {
        return {
            status: 403
        }
    }
    if (state !== sessionState) {
        return {
            status: 403
        }
    }
    const { client: userClient, accessToken, refreshToken } = await client.loginWithOAuth2(
        { code, codeVerifier, redirectUri: url.origin + "/callback/"}
    );
    delete locals.auth;
    // リフレッシュトークンをDBに保存する
    try {
        await upsertRefreshToken(locals.sessionId, refreshToken);
    } catch (err) {
        console.log(err);
        return {
            status: 500
        }
    }

    const { data: userObj } = await userClient.v2.me({
        "user.fields": 'profile_image_url'
    });
    // 必要であればユーザーを新規作成する
    const splId = await createUserIfNotExist(userObj);
    userObj.splId = splId;
    // アクセストークンとユーザ情報をCookieに保存する
    // TODO: 暗号化
    locals.user = {
        token: accessToken,
        info: userObj
    };
    return {
        status: 200,
        body: {
            splId
        }
    };
}