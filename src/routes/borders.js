import { getBorder } from "$lib/border";

export async function get({ url }) {
    const query = url.searchParams;
    const from = query.get("from");
    const to = query.get("to");
    if (!from || !to) {
        return {
            status: 404
        };
    }
    const borders = await getBorder(from, to);

    return {
        status: 200,
        body: borders
    };
}