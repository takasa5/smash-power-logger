import { TwitterApi } from "twitter-api-v2";
import * as jwt from "jsonwebtoken";
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

export function signJwt(payload) {
    const secret = process.env.JWT_SECRET;
    const options = {
        expiresIn: "14d"
    };
    const token = jwt.sign(
        payload,
        secret,
        options
    );
    return token;
}

export function verifyJwt(token) {
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);
    return decoded;
}