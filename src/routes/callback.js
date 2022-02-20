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

    const { data: userObj } = await userClient.v2.me({
        "user.fields": 'profile_image_url'
    });
    // 必要であればユーザーを新規作成する
    const splId = createUserIfNotExist(userObj);
    userObj.splId = splId;
    // アクセストークンとユーザ情報をCookieに保存する
    // TODO: 暗号化
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

async function createUserIfNotExist(userObj) {
    try {
        const { Items: result } = await ddb.query({
            TableName: "SmashPowerLoggerUser",
            IndexName: "twitter_id-index",
            KeyConditionExpression: "twitter_id = :twitterId",
            ExpressionAttributeValues: {
                ":twitterId": userObj.id
            }
        }).promise();
        if (result.length === 0) {
            // 新規登録ユーザー
            const { Attributes: seq } = await ddb.update({
                TableName: "Sequences",
                Key: {
                    table_name: "SmashPowerLoggerUser"
                },
                UpdateExpression: "set current_number = current_number + :value",
                ExpressionAttributeValues: {
                    ":value": 1
                },
                ReturnValues: "UPDATED_NEW"
            }).promise();
            await ddb.put({
                TableName: "SmashPowerLoggerUser",
                Item: {
                    id: seq.current_number,
                    twitter_id: userObj.id,
                    twitter_username: userObj.username,
                    twitter_name: userObj.name,
                    twitter_image: userObj.profile_image_url
                }
            }).promise();
            return seq.current_number;
        }
        return result[0].id;
    } catch (err) {
        console.log(err);
    }
}