import { createUserIfNotExist } from "$lib/user";
import { TwitterApi } from "twitter-api-v2";
import dotenv from "dotenv";
dotenv.config();

export async function get({ url, locals }) {
    const query = url.searchParams;
    const oauth_token = query.get("oauth_token");
    const oauth_verifier = query.get("oauth_verifier");
    // localsから情報を取得
    const { oauth_token_secret } = locals.auth;

    if (!oauth_token || !oauth_verifier || !oauth_token_secret) {
        return {
            status: 403
        }
    }

    const client = new TwitterApi({
        appKey: process.env.TWITTER_CONSUMER_KEY,
        appSecret: process.env.TWITTER_CONSUMER_SECRET,
        accessToken: oauth_token,
        accessSecret: oauth_token_secret
    });

    const { client: userClient, accessToken, accessSecret } = await client.login(oauth_verifier);
    delete locals.auth;

    const { data: userObj } = await userClient.v2.me({
        "user.fields": 'profile_image_url'
    });
    // 必要であればユーザーを新規作成する
    const splId = await createUserIfNotExist(userObj);
    userObj.splId = splId;
    // アクセス情報とユーザ情報をCookieに保存する
    // TODO: 暗号化
    locals.user = {
        oauth: {
            accessToken,
            accessSecret
        },
        info: userObj
    };
    return {
        status: 200,
        body: {
            splId
        }
    };
}