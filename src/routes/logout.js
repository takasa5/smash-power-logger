import cookie from "cookie";
import { DynamoDB as ddb } from "$lib/_util";

export async function get({ locals }) {
    try {
        // DBからリフレッシュトークンを削除
        await ddb.delete({
            TableName: "SmashPowerLoggerRefreshTokenTable",
            Key: {
                session_id: locals.sessionId
            }
        }).promise();
    } catch (err) {
        // no-op
        console.log(err);
    }
    delete locals.auth;
    delete locals.user;
    return {
        status: 200,
        headers: {
            "set-cookie": cookie.serialize("user", "", {
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 0
            }),
            "cache-control": "no-store"
        },
        body: {
            user: {}
        }
    };
}