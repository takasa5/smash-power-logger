import { DynamoDB as ddb } from "$lib/_util";

/**
 * Twitter ID に基づいてユーザーを検索する。
 * @param twitterId Twitter ID
 * @return SPL ID / 存在しない場合は null
 */
export async function searchUserByTwitterId(twitterId) {
    try {
        const { Items: result } = await ddb.query({
            TableName: "SmashPowerLoggerUser",
            IndexName: "twitter_id-index",
            KeyConditionExpression: "twitter_id = :twitterId",
            ExpressionAttributeValues: {
                ":twitterId": twitterId
            }
        }).promise();

        if (result.length === 0) {
            return null;
        }
        return result[0].id;
    } catch (err) {
        console.error(err);
    }
}

/**
 * （ログイン時）ユーザーが存在しない場合はユーザーの初回登録を行う。
 * @param userObj keys: id, username, name, profile_image_url
 * @return SPL ID
 */
export async function createUserIfNotExist(userObj) {
    const splId = await searchUserByTwitterId(userObj.id);
    if (!splId) {
        try {
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
        } catch (err) {
            console.error(err);
        }
    }
    return splId;
}