import { getFighters } from "$lib/power";
import { getUser } from "$lib/user";

export async function get({ params }) {
    if (isNaN(params.id)) {
        return {
            status: 404
        }
    }
    const splId = Number(params.id);
    try {
        // DBからユーザ情報を取得
        const user = await getUser(splId);
        if (!user) {
            return {
                status: 404
            }
        }
        // ファイター情報を取得
        const fighters = await getFighters(splId);
        return {
            status: 200,
            body: {
                id: splId,
                twitter_name: user.twitter_name,
                twitter_username: user.twitter_username,
                twitter_image: user.twitter_image,
                // powers: [dataset],
                fighters: fighters
            }
        }
    } catch (err) {
        console.log(err);
        return {
            status: 500
        }
    }
}