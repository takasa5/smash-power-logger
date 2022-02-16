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

    const { client: userClient, accessToken, refreshToken, expiresIn } = await client.loginWithOAuth2(
        { code, codeVerifier, redirectUri: "https://smash-power-logger.vercel.app/callback/"}
    );
    delete locals.auth;
    // アクセストークンやらをセッションIDと紐づけてストアする
    const { data: userObject } = await userClient.v2.me();
    // ためしにcookie保存でやってみる
    locals.token = accessToken;
    return {
        status: 200,
        body: {
            message: JSON.stringify(userObject)
        }
    }
}