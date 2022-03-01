import prisma from "$lib/prisma";
import { DynamoDB as ddb } from "$lib/_util";
import { updateLastRegistered } from "$lib/user";
import notation from "$lib/fighter_notation.json";

export async function registPowers(splId, itemList) {
    // itemListをfighter_id: [{power, time}]の形に変換する
    const fighterIdSet = Array.from(new Set(itemList.map(e => e.fighter_id)));
    const itemMap = new Map(fighterIdSet.map(id => [id, itemList.filter(e => e.fighter_id == id)]))
    for (const [fighterId, items] of itemMap) {
        const filteredItems = items.map((e) => {
            delete e.key;
            delete e.fighter_id;
            delete e.fighter;
            delete e.icon;
            return e;
        });
        await ddb.update({
            TableName: "SmashPower",
            Key: {
                spl_id: splId,
                fighter_id: fighterId
            },
            UpdateExpression: "SET #c = list_append(if_not_exists(#c, :emp), :vals)",
            ExpressionAttributeNames: {
                "#c": "items"
            },
            ExpressionAttributeValues: {
                ":emp": [],
                ":vals": filteredItems
            }
        }).promise();
    }
    // 最後に記録した日時をDBに保存しておく
    const timeSet = Array.from(new Set(itemList.map(e => e.time))).sort((a, b) => new Date(a) - new Date(b));
    const lastRegistered = timeSet.pop();
    await updateLastRegistered(splId, lastRegistered);

}

/**
 * 戦闘力をデータセットの形で返却
 * データセット：{label, backgroundColor, borderColor, data: [{x, y}]}
 */
export async function getPowersAsDataset(splId, fighterId) {
    const powers = await getPowers(splId, fighterId);
    if (powers.length === 0) {
        return {};
    }
    const nt = notation[fighterId];
    const dataset = {};
    dataset["src"] = nt["icon"];
    dataset["label"] = nt["label"];
    dataset["backgroundColor"] = nt["color"];
    dataset["borderColor"] = nt["color"];
    dataset["data"] = powers.map(e => {
        return {
            x: e["recordedAt"],
            y: e["power"]
        }
    });
    return dataset;
}

/**
 * 戦闘力を取得しDBの行のまま返却
 * [{id, userId, fighterId, power, recordedAt}, ...]
 */
export async function getPowers(splId, fighterId) {
    let powers = await prisma.power.findMany({
        where: {
            userId: splId,
            fighterId: fighterId
        }
    });
    return powers;
}