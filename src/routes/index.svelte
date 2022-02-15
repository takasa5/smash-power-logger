<script>
	export let userid;
	import { session } from "$app/stores";
	let sess = $session;
</script>

<svelte:head>
	<title>Index</title>
</svelte:head>

id: {userid}
<br>
session: {JSON.stringify(sess)}
<p>
	<a href="/users/1">user 1</a>
</p>
<p>
	<a href="/login">新規登録</a>
</p>