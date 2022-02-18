<script>
	import { session } from "$app/stores";
	let user = $session;
</script>

<svelte:head>
	<title>Index</title>
</svelte:head>

<br>
user: {JSON.stringify(user)}
<p>
	<a href="/users/1">user 1</a>
</p>
{#if Object.keys(user).length === 0}
<p>
	<a href="/login">新規登録</a>
</p>
{:else}
<p>
	<a href="/logout">ログアウト</a>
</p>
{/if}
<p>
	<a href="/callback">callback</a>
</p>
<p>
	<a href="/db">DB</a>
</p>