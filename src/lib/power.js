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
 * 
 * @param powers [{id, userId, fighterId, power, recordedAt}, ...]
 * @returns データセット：[{label, src, backgroundColor, borderColor, data: [{x, y}]}]
 */
export function convertPowersToDataset(powers) {
    if (powers.length === 0) {
        return [];
    }
    const fighterMap = {};
    for (const power of powers) {
        if (Object.keys(fighterMap).includes(power.fighterId)) {
            fighterMap[power.fighterId].push({
                x: power["recordedAt"],
                y: power["power"]
            });
        } else {
            fighterMap[power.fighterId] = [{
                x: power["recordedAt"],
                y: power["power"]
            }];
        }
    }
    const datasets = [];
    for (const [fighterId, data] of Object.entries(fighterMap)) {
        const nt = notation[fighterId];
        const dataset = {};
        dataset["src"] = nt["icon"];
        dataset["label"] = nt["label"];
        dataset["backgroundColor"] = nt["color"];
        dataset["borderColor"] = nt["color"];
        dataset["data"] = data;
        datasets.push(dataset);
    }
    
    return datasets;
}

/**
 * 戦闘力を取得しDBの行のまま返却
 * @param splId SPL ID
 * @param fighterId ファイターID
 * @returns [{id, userId, fighterId, power, recordedAt}, ...]
 */
export async function getPowers(splId, fighterId) {
    // TODO: 期間の制御
    const powers = await prisma.power.findMany({
        where: {
            userId: splId,
            fighterId: fighterId
        },
        take: 10
    });
    return powers;
}

/**
 * SPL IDを指定し、そのユーザーの最新の戦闘力を取得
 * @param splId SPL ID
 * @returns [{id, userId, fighterId, power, recordedAt}, ...]
 */
export async function getRecentPowers(splId) {
    const powers = await prisma.power.findMany({
        where: {
            userId: splId
        },
        orderBy: {
            recordedAt: "desc"
        },
        take: 10
    });
    return powers;
}

/**
 * 最後に記録した日時（ツイートの投稿日時）を取得
 * @param splId SPL ID
 * @returns lastRecordedAt
 */
export async function getLastRecorded(splId) {
    const power = await prisma.power.aggregate({
        where: {
            userId: splId
        },
        _max: {
            recordedAt: true
        }
    })
    return power._max.recordedAt;
}

/**
 * あるユーザーが持つファイターの一覧を返却
 * @param splId SPL ID
 * @returns fighter情報のリスト [{id, label, icon}, ...]
 */
export async function getFighters(splId) {
    const powers = await prisma.power.groupBy({
        where: {
            userId: splId
        },
        by: ["fighterId"]
    });
    return powers.map(e => {
        let ret = {};
        const nt = notation[e.fighterId];
        ret["id"] = e.fighterId;
        ret["label"] = nt["label"];
        ret["icon"] = nt["icon"];
        return ret;
    });
}