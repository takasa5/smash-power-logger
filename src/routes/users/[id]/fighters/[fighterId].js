import { getFighters, getPowers, convertPowersToDataset, deletePowers } from "$lib/power";
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
    try {
        const powers = await getPowers(splId, fighterId);
        if (powers.length === 0) {
            return {
                status: 404
            };
        }
        const borderFrom = powers[0].recordedAt.toISOString();
        const borderTo = powers[powers.length - 1].recordedAt.toISOString();

        const datasets = convertPowersToDataset(powers);
        // ファイター情報を取得
        const fighters = await getFighters(splId);

        return {
            status: 200,
            body: {
                fighter_name: datasets[0].label,
                powers: datasets,
                fighters: fighters,
                borderFrom,
                borderTo,
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
