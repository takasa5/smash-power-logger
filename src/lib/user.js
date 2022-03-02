import prisma from "$lib/prisma";

/**
 * Twitter ID に基づいてユーザーを検索する。
 * @param twitterId Twitter ID
 * @return SPL ID / 存在しない場合は null
 */
export async function searchUserByTwitterId(twitterId) {
    const user = await prisma.user.findUnique({
        where: {
            twitter_id: twitterId
        }
    });
    if (!user) {
        return null;
    }
    return user.id;
}

/**
 * （ログイン時）ユーザーが存在しない場合はユーザーの初回登録を行う。
 * @param userObj keys: id, username, name, profile_image_url
 * @return SPL ID
 */
export async function createUserIfNotExist(userObj) {
    const splId = await searchUserByTwitterId(userObj.id);
    if (!splId) {
        const user = await prisma.user.create({
            data: {
                twitter_username: userObj.username,
                twitter_image: userObj.profile_image_url,
                twitter_id: userObj.id,
                twitter_name: userObj.name
            }
        });
        return user.id;
    }
    // 2回目以降のログインではユーザ情報を更新する
    await prisma.user.update({
        where: {
            id: splId
        },
        data: {
            twitter_username: userObj.username,
            twitter_image: userObj.profile_image_url,
            twitter_name: userObj.name
        }
    });
    return splId;
}

/**
 * ユーザーデータを取得する
 * @param splId SPL ID
 * @return User
 */
export async function getUser(splId) {
    const user = await prisma.user.findUnique({
        where: {
            id: splId
        }
    });
    return user;
}