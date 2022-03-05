import { getFighters, getPowers, convertPowersToDataset } from "$lib/power";
import { getUser } from "$lib/user";

export async function get({ params }) {
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
    // TODO: ファイターIDバリデーション
    const powers = await getPowers(splId, fighterId);
    if (powers.length === 0) {
        return {
            status: 404
        };
    }
    const dataset = convertPowersToDataset(powers);
    // ファイター情報を取得
    const fighters = await getFighters(splId);

    return {
        status: 200,
        body: {
            fighter_name: dataset.label,
            powers: [dataset],
            fighters: fighters,
            ...user
        }
    }
}