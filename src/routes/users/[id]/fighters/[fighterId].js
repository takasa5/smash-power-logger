import { getFighters, getPowers, convertPowersToDataset } from "$lib/power";
import { getUser } from "$lib/user";

export async function get({ params, locals }) {
    if (isNaN(params.id)) {
        return {
            status: 404
        };
    }
    const splId = Number(params.id);
    const fighterId = params.fighterId;
    const user = await getUser(splId);
    if (!user) {
        return {
            status: 404
        };
    }
    // 鍵アカウント判定
    if (!user.publish_flag) {
        if (!locals.user || locals.user.info.splId != params.id) {
            return {
                status: 403
            }
        }
    }
    // TODO: ファイターIDバリデーション
    try {
        const powers = await getPowers(splId, fighterId);
        if (powers.length === 0) {
            return {
                status: 404
            };
        }

        const datasets = convertPowersToDataset(powers);
        // ファイター情報を取得
        const fighters = await getFighters(splId);

        return {
            status: 200,
            body: {
                fighter_name: datasets[0].label,
                powers: datasets,
                fighters: fighters,
                fighterId,
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
