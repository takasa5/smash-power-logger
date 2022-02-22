import { getAccessToken } from "$lib/auth";
import { TwitterApi } from "twitter-api-v2";
import dotenv from "dotenv";
dotenv.config();

export async function get({ locals }) {
    // Twitter再認証を行いツイートを取得
    const accessToken = getAccessToken(locals);
    let client;
    if (accessToken) {
        client = new TwitterApi(accessToken);
        const paginator = await client.v2.userTimeline(locals.user.info.id, {
            expansions: "attachments.media_keys",
            "media.fields": ["type", "url"],
            "tweet.fields": "created_at",
            exclude: "retweets"
        });
        // { mediaKey: createdAt } （日時と紐付け用）
        let mediaList = {};
        let mediaKeys = []; // 検索用
        for (const tweet of paginator.tweets) {
            if (!tweet.attachments || !tweet.attachments.media_keys) {
                continue;
            }
            if (!tweet.text.includes("#SmashBrosSP")) {
                continue;
            }
            for (const mediaKey of tweet.attachments.media_keys) {
                mediaList[mediaKey] = tweet.created_at;
                mediaKeys.push(mediaKey);
            }
        }
        const urlList = paginator.includes.media
                .filter(e => e.type == "photo")
                .filter(e => mediaKeys.includes(e.media_key))
                .map(e => {
                    e.createdAt = mediaList[e.media_key]
                    return e;
                });
        const data = await recognizeImages(urlList);
        console.log(JSON.parse(data));
        
        // キャラと数値と日付のリストを返す
        return {
            status: 200
        }
    }
    console.log("cannot access");
    return {
        status: 500
    }
}

async function recognizeImages(urlList) {
    const response = await fetch(process.env.API_GATEWAY_ENDPOINT + "/recognition", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            urlList
        })
    });
    const data = await response.json();
    
    return data;
}