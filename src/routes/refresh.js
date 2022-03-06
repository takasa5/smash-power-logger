import { getRefreshToken, upsertRefreshToken } from "$lib/auth";
import { searchUserByTwitterId } from "$lib/user";
import { TwitterAppClient as twClient } from "$lib/_util";

export async function get({ locals }) {
    // セッションIDがない場合は生成を優先
    const sessionId = locals.sessionId;
    if (!sessionId) {
        return {
            status: 200
        };
    }
    // ユーザー情報がある場合は何もしない
    if (locals.user) {
        return {
            status: 200,
            body: {
                user: locals.user.info
            }
        };
    }
    const refreshToken = await getRefreshToken(sessionId);
    if (!refreshToken) {
        // セッションIDに紐づくリフレッシュトークンが存在しない（未登録またはログアウト済み）
        return {
            status: 200
        };
    }
    try {
        const { client: refreshedClient, accessToken, refreshToken: newRefreshToken} = await twClient.refreshOAuth2Token(refreshToken);
        const meConfig = {
            "user.fields": 'profile_image_url'
        };
        const { data: userObj } = await refreshedClient.v2.me(meConfig)
        const splId = await searchUserByTwitterId(userObj.id);
        await upsertRefreshToken(sessionId, newRefreshToken);
        userObj.splId = splId;
        // callback.js （ログイン時）と共通する処理
        // TODO: 暗号化
        locals.user = {
            token: accessToken,
            info: userObj
        }
        return {
            status: 200,
            body: {
                user: userObj
            }
        }
    } catch (err) {
        console.log(err);
        return {
            status: 403
        };
    }
}