import { TwitterApi } from "twitter-api-v2";
import prisma from "$lib/prisma";
import dotenv from "dotenv";
dotenv.config();

/**
 * Twitterクライアントの取得
 */
export function getTwitterClient(accessToken, accessSecret) {
    return new TwitterApi({
        appKey: process.env.TWITTER_CONSUMER_KEY,
        appSecret: process.env.TWITTER_CONSUMER_SECRET,
        accessToken: accessToken,
        accessSecret: accessSecret
    });
}

export async function getOauth(sessionId) {
    const oauthData = await prisma.oauth.findUnique({
        where: {
            session_id: sessionId
        }
    });
    return oauthData ? oauthData : {};
}