import prisma from "$lib/prisma";

/**
 * セッションIDをもとにDBにリフレッシュトークンを更新する
 * 存在しなければ作成する
 * 
 * @param sessionId セッションID
 * @param refreshToken リフレッシュトークン
 */
export async function upsertRefreshToken(sessionId, refreshToken) {
    await prisma.refreshToken.upsert({
        where: {
            session_id: sessionId
        },
        update: {
            refresh_token: refreshToken
        },
        create: {
            session_id: sessionId,
            refresh_token: refreshToken
        }
    });
}

export async function deleteRefreshToken(sessionId) {
    await prisma.refreshToken.delete({
        where: {
            session_id: sessionId
        }
    });
}

/**
 * セッションIDをもとにDBに格納したリフレッシュトークンを取得
 * 
 * @param sessionId セッションID
 * @return リフレッシュトークン
 */
export async function getRefreshToken(sessionId) {
    const refreshToken = await prisma.refreshToken.findUnique({
        where: {
            session_id: sessionId
        }
    });
    if (!refreshToken) {
        return null;
    }
    return refreshToken.refresh_token;
}

export function getAccessToken(locals) {
    return locals.user ? locals.user.token : null;
}