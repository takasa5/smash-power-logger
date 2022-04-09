import { getUser, updatePublish } from "$lib/user";
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
    const user = await getUser(splId);

    const fighters = await getFighters(splId);

    return {
        status: 200,
        body: {
            fighters,
            publish_flag: user.publish_flag,
            twitter_publish_flag: user.twitter_publish_flag
        }
    }
}


export async function post({ params, locals, request }) {
    if (isNaN(params.id)) {
        return {
            status: 404
        }
    }
    const splId = Number(params.id);
    const data = await request.json();
    if (locals.user.info.splId != params.id) {
        return {
            status: 403
        }
    }

    try {
        await updatePublish(
            splId,
            data.publish_flag,
            data.twitter_publish_flag
        );

        return {
            status: 200
        }
    } catch (e) {
        console.log(e);
        return {
            status: 500
        }
    }
}