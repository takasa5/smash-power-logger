import { getAccessToken } from "$lib/auth";
import { TwitterApi } from "twitter-api-v2";


export async function post({ request, params, locals }) {
    if (isNaN(params.id)) {
        return {
            status: 404
        };
    }
    const splId = Number(params.id);
    console.log(splId, locals.user.info.splId);
    if (!locals.user || locals.user.info.splId != splId) {
        return {
            status: 403
        };
    }
    const data = await request.arrayBuffer();
    console.log(Buffer.from(data));

    const accessToken = getAccessToken(locals);
    if (accessToken) {
        let client;
        try {
            client = new TwitterApi(accessToken);
        } catch (err) {
            console.log(err);
            return {
                status: 403
            };
        }
        try {
            const mediaId = await client.v1.uploadMedia(Buffer.from(data), {
                type: "png"
            });
            await client.v2.tweet("test", {
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
    return {
        status: 403
    };
}