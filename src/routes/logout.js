import cookie from "cookie";
import { DynamoDB as ddb } from "$lib/_util";

export async function get({ locals }) {
    try {
        await ddb.delete({
            TableName: "SmashPowerLoggerRefreshTokenTable",
            Key: {
                session_id: locals.session_id
            }
        }).promise();
    } catch (err) {
        // no-op
    }
    locals.logout = true;
    return {
        status: 200,
        headers: {
            "set-cookie": cookie.serialize("token", "", {
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 0
            }),
            "cache-control": "no-store"
        },
        body: {}
    };
}