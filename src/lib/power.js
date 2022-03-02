import prisma from "$lib/prisma";
import notation from "$lib/fighter_notation.json";

/**
 * 戦闘力を登録する
 * @param splId SPL ID
 * @param itemList [{key, power, fighter, fighter_id, icon, time}, ...]
 */
export async function registPowers(splId, itemList) {
    const data = itemList.map(e => {
        const ret = {};
        ret["userId"] = splId;
        ret["fighterId"] = e["fighter_id"];
        ret["power"] = e["power"];
        ret["recordedAt"] = e["time"];
        return ret;
    });
    await prisma.power.createMany({
        data: data
    });
}

/**
 * 戦闘力をデータセットの形で返却
 * データセット：{label, backgroundColor, borderColor, data: [{x, y}]}
 * @param powers [{id, userId, fighterId, power, recordedAt}, ...]
 */
export function getPowersAsDataset(powers) {
    if (powers.length === 0) {
        return {};
    }
    const fighterId = powers[0].fighterId;
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
 * @param splId SPL ID
 * @param fighterId ファイターID
 * @returns [{id, userId, fighterId, power, recordedAt}, ...]
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