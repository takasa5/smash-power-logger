import { DynamoDB as ddb } from "$lib/_util";
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
}

export async function getPowersBySplId(splId) {
    const result = await ddb.query({
        TableName: "SmashPower",
        KeyConditionExpression: "spl_id = :id",
        ExpressionAttributeValues: {
            ":id": splId
        }
    }).promise();
    // [ { spl_id: 4, items: [Array], fighter_id: 11 } ]
    let items = result.Items;
    items = items.map(e => {
        const nt = notation[`${e.fighter_id}`];
        e["label"] = nt["label"];
        e["icon"] = nt["icon"];
        return e;
    });
    return items;
}