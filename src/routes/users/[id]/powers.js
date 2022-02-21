import { getAccessToken } from "$lib/auth";
import { TwitterApi } from "twitter-api-v2";

export async function get({ locals }) {
    // Twitter再認証を行いツイートを取得
    const accessToken = getAccessToken(locals);
    let client;
    if (accessToken) {
        client = new TwitterApi(accessToken);
        const paginator = await client.v2.userTimeline(locals.user.info.id, {
            expansions: "attachments.media_keys",
            "media.fields": "url",
            "tweet.fields": "created_at",
            exclude: "retweets"
        });
        // { mediaKey, createdAt, url }
        let mediaList = [];
        for (const tweet of paginator.tweets) {
            if (!tweet.attachments || !tweet.attachments.media_keys) {
                continue;
            }
            if (!tweet.text.includes("#SmashBrosSP")) {
                continue;
            }
            // 該当のメディアキーを配列にpushすればよいが、createdAtとの関連をどう保持するかは考える必要あり
            for (const mediaKey of tweet.attachments.media_keys) {
                mediaList.push({
                    mediaKey: mediaKey,
                    createdAt: tweet.created_at
                });
            }
        }
        for (const obj of mediaList) {
            const { type, url } = paginator.includes.media.find(e => e.media_key == obj.mediaKey);
            if (type == "photo") {
                obj.url = url;
                // TODO: 画像処理する
                console.log(obj.createdAt);
                console.log(obj.url);
            }
        }
        
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