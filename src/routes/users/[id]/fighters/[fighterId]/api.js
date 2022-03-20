import { getPowers } from "$lib/power";

export async function get({ params }) {
    if (isNaN(params.id)) {
        return {
            status: 404
        }
    }
    const splId = Number(params.id);
    const powers = await getPowers(
        splId,
        params.fighterId,
        10
    );

    return {
        status: 200,
        body: powers
    };
}