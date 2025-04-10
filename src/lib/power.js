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
    const DELIMITER = "-";
    if (powers.length === 0) {
        return [];
    }
    const fighterMap = {};
    for (const power of powers) {
        const key = power.userId + DELIMITER + power.fighterId;
        if (Object.keys(fighterMap).includes(key)) {
            fighterMap[key].push({
                x: power["recordedAt"],
                y: power["power"]
            });
        } else {
            fighterMap[key] = [{
                x: power["recordedAt"],
                y: power["power"]
            }];
        }
    }
    const datasets = [];
    for (const [key, data] of Object.entries(fighterMap)) {
        const fighterId = key.split(DELIMITER)[1];
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
export async function getPowers(splId, fighterId, limit = undefined) {
    // TODO: 期間の制御
    const powers = await prisma.power.findMany({
        where: {
            userId: splId,
            fighterId: fighterId
        },
        orderBy: {
            recordedAt: "desc"
        },
        take: limit
    });
    return powers.reverse();
}

/**
 * 全体のユーザーの最新の戦闘力を取得
 * @returns [{id, userId, fighterId, power, recordedAt}, ...]
 */
export async function getRecentPowers() {
    const powers = await prisma.power.findMany({
        orderBy: {
            recordedAt: "desc"
        },
        take: 10,
        include: {
            user: true
        }
    });
    return powers.reverse();
}

/**
 * SPL IDを指定し、そのユーザーの最新の戦闘力を取得
 * @param splId SPL ID
 * @returns [{id, userId, fighterId, power, recordedAt}, ...]
 */
export async function getRecentPowersBy(splId) {
    const powers = await prisma.power.findMany({
        where: {
            userId: splId
        },
        orderBy: {
            recordedAt: "desc"
        },
        take: 10
    });
    return powers.reverse();
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

/**
 * 戦闘力IDを指定して削除
 */
export async function deletePower(powerId) {
    await prisma.power.delete({
        where: {
            id: powerId
        }
    });
}

/**
 * SPL IDとファイターIDを指定してその戦闘力を全て削除
 */
export async function deletePowers(splId, fighterId) {
    await prisma.power.deleteMany({
        where: {
            userId: splId,
            fighterId: fighterId
        }
    });
}

/**
 * SPL IDを指定してその戦闘力を全て削除
 * アカウント削除時
 */
export async function deleteUserPowers(splId) {
    await prisma.power.deleteMany({
        where: {
            userId: splId
        }
    });
}