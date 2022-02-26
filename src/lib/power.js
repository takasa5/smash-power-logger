import { DynamoDB as ddb } from "$lib/_util";

export async function registPowers(splId, itemList) {
    // itemListをfighter_id: [{power, time}]の形に変換する
    const fighterIdSet = Array.from(new Set(itemList.map(e => e.fighter_id)));
    const itemMap = new Map(fighterIdSet.map(id => [id, itemList.filter(e => e.fighter_id == id)]))
    for (const [fighterId, item] of itemMap) {
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
                ":vals": item
            }
        }).promise();
    }
    return {
        status: 200
    };
}

