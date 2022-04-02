export async function post({ request, params, locals }) {
    if (isNaN(params.id)) {
        return {
            status: 404,
            body: []
        }
    }
    const splId = Number(params.id);
    // セッションのユーザーと記録ボタンを押したユーザーの同一チェック
    if (locals.user.info.splId != splId) {
        return {
            status: 403
        }
    }
    const req = await request.json();
    const data = await recognizeImages(splId, req);

    return {
        status: 200,
        body: data
    };
}

async function recognizeImages(splId, urlList) {
    if (urlList.length === 0) {
        return [];
    }
    const body = JSON.stringify({
        splId,
        urlList
    });
    const response = await fetch(process.env.API_GATEWAY_ENDPOINT + "/recognition", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: body
    });
    const res = await response.json();
    
    return JSON.parse(res.body);
}