import { getFighters } from "$lib/power";
import { getUser } from "$lib/user";

// __layoutからdynamic routeが叩けないので準備
export async function get({ url }) {
    const query = url.searchParams;
    if (isNaN(query.get("id"))) {
        return {
            status: 404
        }
    }
    const splId = Number(query.get("id"));
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