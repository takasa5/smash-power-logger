import { getTwitterClient } from "$lib/auth";

export async function post({ request, params, locals }) {
    if (isNaN(params.id)) {
        return {
            status: 404
        };
    }
    const splId = Number(params.id);
    if (!locals.user || locals.user.info.splId != splId) {
        return {
            status: 403
        };
    }
    const { text, img } = await request.json();

    let client;
    try {
        client = getTwitterClient(
            locals.user.oauth.accessToken,
            locals.user.oauth.accessSecret
        );
    } catch (err) {
        console.log(err);
        return {
            status: 403
        };
    }
    try {
        const mediaId = await client.v1.uploadMedia(Buffer.from(img.replace(/^data:\w+\/\w+;base64,/, ''), "base64"), {
            type: "png"
        });
        await client.v2.tweet(text, {
            media: {
                media_ids: [mediaId]
            }
        });
        return {
            status: 200
        }
    } catch (err) {
        console.log(err);
        return {
            status: 500
        }
    }
}