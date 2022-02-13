export default async function(state, code) {
    if (!state || !code) {
        return null;
    }
    // localStorageからuuidを取得
    const uuid = localStorage.getItem("uuid");
    // callbackAPIを叩いてユーザー情報を取得 
    const response = await fetch(
        "https://6wx2hlt0bd.execute-api.ap-northeast-1.amazonaws.com/dev/callback",
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uuid,
                state,
                code
            })
        }
    );
    // debug
    console.log(response);
    if (!response.ok) {
        return null;
    }
    const res = await response.json();
    const obj = JSON.parse(res.body);
    return obj;
}
