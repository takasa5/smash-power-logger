<script context="module">
	import { browser } from "$app/env";
	import login from "./_login";

	export async function load({ url, params, props, fetch, session, stuff }) {
		// browser=trueでないとlocalStorageが使えないのでブロックする
		if (!browser) {
			return {};
		}
		const query = new URLSearchParams(url.search);
		console.log(url);
		console.log(`state: ${query.get("state")}`);
		console.log(`code: ${query.get("code")}`);
		const userObj = await login(query.get("state"), query.get("code"));
		const user = userObj ? JSON.stringify(userObj) : userObj;

		if (localStorage.getItem("uuid")) {
			return {
				props: {
					uuid: localStorage.getItem("uuid"),
					user
				}
			}
		}

        const response = await fetch(
            "https://6wx2hlt0bd.execute-api.ap-northeast-1.amazonaws.com/dev/uuid",
            {
                method: "GET"
            }
        );
        if (!response.ok) {
            return {
                error: "failed to get uuid"
            }
        }
        const res = await response.json();
        const uuid = JSON.parse(res.body).uuid;
		localStorage.setItem("uuid", uuid);
        return {
            props: {
				uuid,
				user
			}
        }
    }
</script>

<script>
	export let uuid, user;
</script>

<svelte:head>
	<title>Index</title>
</svelte:head>

loginUser: {user}
<p>
	<a href="/users/1">user 1</a>
</p>
<p>
	<a href="https://6wx2hlt0bd.execute-api.ap-northeast-1.amazonaws.com/dev/login?uuid={uuid}">新規登録</a>
</p>
