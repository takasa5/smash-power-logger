import { DynamoDB as ddb } from "$lib/_util";

export async function get({ params }) {
    if (isNaN(params.id)) {
        return {
            status: 404
        }
    }
    const splId = Number(params.id);
    try {
        // DBからユーザ情報を取得
        const result = await ddb.get({
            TableName: "SmashPowerLoggerUser",
            Key: {
                id: splId
            }
        }).promise();
        if (Object.keys(result).length === 0) {
            return {
                status: 404
            }
        }
        return {
            status: 200,
            body: {
                id: splId,
                twitter_name: result.Item.twitter_name,
                twitter_username: result.Item.twitter_username,
                twitter_image: result.Item.twitter_image
            }
        }
    } catch (err) {
        console.log(err);
        return {
            status: 500
        }
    }
}