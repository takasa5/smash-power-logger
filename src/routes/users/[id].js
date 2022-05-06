import { convertPowersToDataset, getFighters, getRecentPowersBy } from "$lib/power";
import { getUser } from "$lib/user";

export async function get({ params, locals }) {
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
        // 鍵アカウント判定
        if (!user.publish_flag) {
            if (!locals.user || locals.user.info.splId != params.id) {
                return {
                    status: 403
                }
            }
        }
        // 戦闘力を取得
        const powers = await getRecentPowersBy(splId);
        const datasets = convertPowersToDataset(powers);
        // ファイター情報を取得
        const fighters = await getFighters(splId);
        return {
            status: 200,
            body: {
                id: splId,
                powers: datasets,
                fighters: fighters,
                ...user
            }
        }
    } catch (err) {
        console.log(err);
        return {
            status: 500
        }
    }
}
