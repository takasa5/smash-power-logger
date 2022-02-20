import { DynamoDB as ddb } from "$lib/_util";

/**
 * セッションIDをもとにDBにリフレッシュトークンを格納する
 * @param sessionId セッションID
 * @param refreshToken リフレッシュトークン
 */
export async function saveRefreshToken(sessionId, refreshToken) {
    await ddb.put({
        TableName:"SmashPowerLoggerRefreshTokenTable",
        Item: {
            session_id: sessionId,
            refresh_token: refreshToken
        }
    }).promise();
}

/**
 * セッションIDをもとにDynamoDBに格納したリフレッシュトークンを取得し、
 * ログイン情報を再取得する
 * @param sessionId セッションID
 * @return リフレッシュトークン
 */
export async function getRefreshToken(sessionId) {
    const { Item: result } = await ddb.get({
        TableName: "SmashPowerLoggerRefreshTokenTable",
        Key: {
            session_id: sessionId
        }
    }).promise();
    return result["refresh_token"];
}