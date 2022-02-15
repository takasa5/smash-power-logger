export const get = async({ request, url, params, locals }) => {
    // const query = url.searchParams;

    // 認可callback時ログイン
    // const state = query.get("state");
    // const code = query.get("code");
    // const user = await login(locals.userid, state, code);

    return {
        body: {
            userid: locals.userid,
        }
    }
}