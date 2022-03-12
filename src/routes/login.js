import { TwitterApi } from "twitter-api-v2";
import dotenv from "dotenv";
dotenv.config();

// Twitter認証用URLへリダイレクト
export async function get({ url, locals }){
    const client = new TwitterApi({
        appKey: process.env.TWITTER_CONSUMER_KEY,
        appSecret: process.env.TWITTER_CONSUMER_SECRET
    });
    
    const { url: authUrl, oauth_token, oauth_token_secret } = await client.generateAuthLink(
        url.origin + "/callback/",
        { linkMode: "authorize" }
    );

    // セッション（クッキー）に保存
    locals.auth = {
        oauth_token,
        oauth_token_secret
    }
    return {
        status: 302,
        headers: {
            location: authUrl
        }
    };
}