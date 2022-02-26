import { DynamoDB as ddb } from "$lib/_util";
import { getPowersBySplId } from "$lib/power";

export async function get({ params }) {
    if (isNaN(params.id)) {
        return {
            status: 404
        }
    }
    const splId = Number(params.id);
    try {
        // DBからユーザ情報を取得
        const result = await ddb.get({
            TableName: "SmashPowerLoggerUser",
            Key: {
                id: splId
            }
        }).promise();
        if (Object.keys(result).length === 0) {
            return {
                status: 404
            }
        }
        // 戦闘力情報を取得
        const powers = await getPowersBySplId(splId);
        // TODO: データのそぎ落とし
        return {
            status: 200,
            body: {
                id: splId,
                twitter_name: result.Item.twitter_name,
                twitter_username: result.Item.twitter_username,
                twitter_image: result.Item.twitter_image,
                powers: convertPowerToDatasets(powers)
            }
        }
    } catch (err) {
        console.log(err);
        return {
            status: 500
        }
    }
}

function convertPowerToDatasets(powers) {
    // [{spl_id, items: [], fighter_id, label, icon}]
    const datasets = powers.map(power => {
        const dataset = {};
        dataset["src"] = power["icon"];
        dataset["label"] = power["label"];
        dataset["backgroundColor"] = "rgb(255, 99, 132)";
        dataset["borderColor"] = "rgb(255, 99, 132)";
        dataset["data"] = power["items"].map((e) => {
            const data = {};
            data["x"] = e["time"];
            data["y"] = e["power"];
            return data;
        });
        return dataset;
    });
    // [{label, backgroundColor, borderColor, data: [{x, y}]}]
    return datasets;
}