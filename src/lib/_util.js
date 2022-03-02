import dotenv from "dotenv";
import { TwitterApi } from "twitter-api-v2";
dotenv.config();

// Twitter API v2
const TwitterAppClient = new TwitterApi({
    clientId: process.env.TWITTER_CLIENT_ID,
    clientSecret: process.env.TWITTER_CLIENT_SECRET
});

export { TwitterAppClient };