import { getTwitterClient } from "$lib/auth";
import { registPowers, getLastRecorded } from "$lib/power";
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
    let client;
    try {
        client = getTwitterClient(
            locals.user.oauth.accessToken,
            locals.user.oauth.accessSecret
        );
    } catch (err) {
        return {
            status: 403
        };
    }
    const options = {
        expansions: "attachments.media_keys",
        "media.fields": ["type", "url"],
        "tweet.fields": "created_at",
        exclude: "retweets"
    }
    let lastRecordedAt = await getLastRecorded(splId);
    if (lastRecordedAt) {
        lastRecordedAt.setSeconds(lastRecordedAt.getSeconds() + 1);
        options["start_time"] = lastRecordedAt.toISOString();
    }
    const paginator = await client.v2.userTimeline(locals.user.info.id, options);
    // { mediaKey: tweet } （日時と紐付け用）
    let mediaList = {};
    let mediaKeys = []; // 検索用
    let count = 0;
    // TODO: ループの終了条件を整理
    for (const tweet of paginator.tweets) {
        count += 1;
        // 対象ツイートが1つも見つかっていない場合はさらにツイートを読み込む
        // NOTE: doneは1度終わるとtrueになるため、追加読み込みは1回だけ（最新20件）
        if (!paginator.done && count == paginator.tweets.length && mediaKeys.length === 0) {
            await paginator.fetchNext();
        }
        // メディアツイートでないツイートは処理中断
        if (!tweet.attachments || !tweet.attachments.media_keys) {
            continue;
        }
        // ハッシュタグのないツイートは処理中断
        if (!tweet.text.includes("#SmashBros") || !tweet.text.includes("#NintendoSwitch")) {
            continue;
        }
        // SmashBrosSPなどのハッシュタグ付きのメディアツイートの画像キーを探してリストに保持
        for (const mediaKey of tweet.attachments.media_keys) {
            mediaList[mediaKey] = tweet;
            mediaKeys.push(mediaKey);
        }
        // 画像認識APIの時間制限により大量の画像は処理できないため、打ち切る
        if (mediaKeys.length > 3) {
            break;
        }
    }
    // メディアツイートのうち画像ツイートにフィルタリング
    if (mediaKeys.length !== 0) {
        const urlList = paginator.includes.media
                .filter(e => e.type == "photo")
                .filter(e => mediaKeys.includes(e.media_key))
                .map(e => {
                    e.tweetId = mediaList[e.media_key].id;
                    e.createdAt = mediaList[e.media_key].created_at;
                    // URLを整形してオリジナルサイズを取得する
                    const ext = e.url.split(".").pop();
                    e.url = e.url.replace("." + ext, "") + `?format=${ext}&name=large`;
                    return e;
                });
        const data = await recognizeImages(splId, urlList);
        // キャラと数値と日付のリストを返す
        return {
            status: 200,
            body: data
        }
    }
    return {
        status: 404,
        body: []
    }
}

export async function post({ request, params, locals }) {
    if (isNaN(params.id)) {
        return {
            status: 404,
            body: []
        }
    }
    const splId = Number(params.id);
    const data = await request.json();
    try {
        await registPowers(splId, data);
    } catch (err) {
        console.log(err);
        return {
            status: 500
        };
    }
    if (data[0].deleteFlag) {
        let client;
        try {
            client = getTwitterClient(
                locals.user.oauth.accessToken,
                locals.user.oauth.accessSecret
            );
        } catch (err) {
            return {
                status: 403
            }
        }
        try {
            const tweetIdSet = new Set(data.map(e => e.tweetId));
            for (const id of tweetIdSet) {
                await client.v1.deleteTweet(id);
            }
        } catch (err) {
            return {
                status: 403
            }
        }
    }
    return {
        status: 200
    };
}

async function recognizeImages(splId, urlList) {
    if (urlList.length === 0) {
        return [];
    }
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