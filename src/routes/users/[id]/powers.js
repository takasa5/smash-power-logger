import { getAccessToken } from "$lib/auth";
import { TwitterApi } from "twitter-api-v2";
import { registPowers } from "$lib/power";
import dotenv from "dotenv";
dotenv.config();

export async function get({ params, locals }) {
    if (isNaN(params.id)) {
        return {
            status: 404,
            body: []
        }
    }
    const splId = Number(params.id);
    // セッションのユーザーと記録ボタンを押したユーザーの同一チェック
    if (locals.user.info.splId != splId) {
        return {
            status: 403
        }
    }
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
        let count = 0;
        // TODO: ループの終了条件を整理
        for (const tweet of paginator.tweets) {
            count += 1;
            if (count == paginator.tweets.length && mediaKeys.length === 0) {
                await paginator.fetchNext();
            }
            // TODO: 日付切り捨て
            if (!tweet.attachments || !tweet.attachments.media_keys) {
                continue;
            }
            if (!tweet.text.includes("#SmashBrosSP")) {
                continue;
            }
            for (const mediaKey of tweet.attachments.media_keys) {
                mediaList[mediaKey] = tweet.created_at;
                mediaKeys.push(mediaKey);
                // TODO: 数切り捨て
            }
            
        }
        // TODO: 画像を（古い方から）3枚にするための処理はここでやる必要があるかも
        const urlList = paginator.includes.media
                .filter(e => e.type == "photo")
                .filter(e => mediaKeys.includes(e.media_key))
                .map(e => {
                    e.createdAt = mediaList[e.media_key]
                    return e;
                });
        const data = await recognizeImages(splId, urlList);
        console.log(data);
        
        // キャラと数値と日付のリストを返す
        return {
            status: 200,
            body: data
        }
    }
    return {
        status: 403
    }
}

export async function post({ request, params }) {
    if (isNaN(params.id)) {
        return {
            status: 404,
            body: []
        }
    }
    const splId = Number(params.id);
    const data = await request.json();
    await registPowers(splId, data);
}

async function recognizeImages(splId, urlList) {
    const body = JSON.stringify({
        splId,
        urlList
    });
    const response = await fetch(process.env.API_GATEWAY_ENDPOINT + "/recognition", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: body
    });
    const res = await response.json();
    
    return JSON.parse(res.body);
}