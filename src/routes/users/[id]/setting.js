import { getFighters } from "$lib/power"


export async function get({ params, locals }) {
    if (isNaN(params.id)) {
        return {
            status: 404
        }
    }
    const splId = Number(params.id);
    if (locals.user.info.splId != params.id) {
        return {
            status: 403
        }
    }

    const fighters = await getFighters(splId);

    return {
        status: 200,
        body: {
            fighters
        }
    }
}