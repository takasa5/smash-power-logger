export default async function(state, code) {
    if (!state || !code) {
        return null;
    }
    // localStorageからuuidを取得
    const uuid = localStorage.getItem("uuid");
    // callbackAPIを叩いてユーザー情報を取得 
    const body = {
        uuid,
        state,
        code
    };
    console.log(body);
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
