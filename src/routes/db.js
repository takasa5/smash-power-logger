import { DynamoDB } from "./_util";

export async function get() {
    try {
        const result = await DynamoDB.put({
            TableName: "SmashPowerLoggerRefreshTokenTable",
            Item: {
                    session_id: "SESS",
                    refresh_token: "ref"
                }
        }).promise();
        console.log(result);
    } catch (err) {
        console.log(err);
        return {
            status: 500
        }
    }
    return {
        status: 200
    }
}