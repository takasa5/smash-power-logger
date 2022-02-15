import { TwitterApi } from "twitter-api-v2";
import dotenv from "dotenv";
dotenv.config();

// Twitter認証用URLへリダイレクト
export async function get({ locals }){
    const client = new TwitterApi({
        clientId: process.env.TWITTER_CLIENT_ID,
        clientSecret: process.env.TWITTER_CLIENT_SECRET
    });
    
    const { url, codeVerifier, state } = client.generateOAuth2AuthLink(
        "https://smash-power-logger.vercel.app/callback/",
        {
            scope: [
                'tweet.read',
                'users.read',
                'offline.access'
                ]
        }
    );
    // セッション（クッキー）に保存
    locals.auth = {
        codeVerifier,
        state
    }
    return {
        status: 303,
        headers: {
            location: url
        }
    };
}