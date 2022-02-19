import { DynamoDB as ddb } from "$lib/_util";
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
        await ddb.put({
            TableName:"SmashPowerLoggerRefreshTokenTable",
            Item: {
                session_id: locals.sessionId,
                refresh_token: refreshToken
            }
        }).promise();
    } catch (err) {
        console.log(err);
        return {
            status: 500
        }
    }

    // アクセストークンをCookieに保存する
    // TODO: 暗号化
    const userObj = await userClient.v2.me();
    locals.user = {
        token: accessToken,
        info: userObj
    };
    return {
        status: 302,
        headers: {
            location: "/"
        }
    }
}