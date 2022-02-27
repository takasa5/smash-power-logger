import { getPowersBySplId } from "$lib/power";
import { getUser } from "$lib/user";

export async function get({ params }) {
    if (isNaN(params.id)) {
        return {
            status: 404
        }
    }
    const splId = Number(params.id);
    try {
        // DBからユーザ情報を取得
        const user = await getUser(splId);
        if (!user) {
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
                twitter_name: user.twitter_name,
                twitter_username: user.twitter_username,
                twitter_image: user.twitter_image,
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
        dataset["backgroundColor"] = power["color"];
        dataset["borderColor"] = power["color"];
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