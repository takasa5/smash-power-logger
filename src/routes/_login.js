export default async function(uuid, state, code) {
    if (!state || !code) {
        return null;
    }
    // callbackAPIを叩いてユーザー情報を取得 
    const body = {
        uuid,
        state,
        code
    };
    const response = await fetch(
        "https://6wx2hlt0bd.execute-api.ap-northeast-1.amazonaws.com/dev/login",
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        }
    );
    // debug
    if (!response.ok) {
        return null;
    }
    console.log(response)
    const res = await response.json();
    if (!res || res["errorType"]) {
        return null;
    }
    const obj = JSON.parse(res.body);
    return obj;
}
