import prisma from "$lib/prisma";

/**
 * セッションIDをもとにDBにリフレッシュトークンを格納する
 * @param sessionId セッションID
 * @param refreshToken リフレッシュトークン
 */
export async function saveRefreshToken(sessionId, refreshToken) {
    await prisma.refreshToken.create({
        data: {
            session_id: sessionId,
            refresh_token: refreshToken
        }
    });
}

export async function updateRefreshToken(sessionId, refreshToken) {
    await prisma.refreshToken.update({
        where: {
            session_id: sessionId
        },
        data: {
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
 * セッションIDをもとにDBに格納したリフレッシュトークンを取得し、
 * ログイン情報を再取得する
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