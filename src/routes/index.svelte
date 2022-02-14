<script context="module">
	import { browser } from "$app/env";
	import login from "./_login";
</script>

<script>
	export let user, userid;
</script>

<svelte:head>
	<title>Index</title>
</svelte:head>

id: {userid}
<br>
loginUser: {JSON.stringify(user)}
<p>
	<a href="/users/1">user 1</a>
</p>
<p>
	<a href="https://6wx2hlt0bd.execute-api.ap-northeast-1.amazonaws.com/dev/login?uuid={userid}">新規登録</a>
</p>
