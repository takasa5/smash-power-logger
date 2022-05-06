import { convertPowersToDataset, getRecentPowers } from "$lib/power";

export async function get() {
    try {
        const powers = await getRecentPowers();
        const datasets = convertPowersToDataset(powers);

        return {
            status: 200,
            body: {
                powers: datasets, // グラフ表示用
                datas: powers // ユーザリンク生成用
            }
        }
    } catch (err) {
        console.log(err);
        return {
            status: 500
        }
    }
}