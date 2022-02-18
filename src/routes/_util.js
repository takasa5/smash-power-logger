import AWS from "aws-sdk";
import dotenv from "dotenv";
dotenv.config();

AWS.config.update({
    credentials: new AWS.Credentials(
        process.env.MY_AWS_ACCESS_KEY,
        process.env.MY_AWS_SECRET
    ),
    region: "ap-northeast-1"
});

const DynamoDB = new AWS.DynamoDB.DocumentClient();

export { DynamoDB };