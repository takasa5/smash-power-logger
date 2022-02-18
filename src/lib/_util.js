import AWS from "aws-sdk";
import dotenv from "dotenv";
import { TwitterApi } from "twitter-api-v2";
dotenv.config();

// AWS DynamoDB
AWS.config.update({
    credentials: new AWS.Credentials(
        process.env.MY_AWS_ACCESS_KEY,
        process.env.MY_AWS_SECRET
    ),
    region: "ap-northeast-1"
});

const DynamoDB = new AWS.DynamoDB.DocumentClient();

// Twitter API v2
const TwitterAppClient = new TwitterApi({
    clientId: process.env.TWITTER_CLIENT_ID,
    clientSecret: process.env.TWITTER_CLIENT_SECRET
});

export { DynamoDB, TwitterAppClient };