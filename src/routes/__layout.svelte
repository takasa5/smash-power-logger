<script>
    import { session } from "$app/stores";
	$: user = $session;
</script>

<svelte:head>
    <link rel="stylesheet" href="https://unpkg.com/@primer/css/dist/primer.css" />
</svelte:head>

<div class="Header">
    <div class="Header-item Header-item--full">
        <a href="/" class="Header-link">Smash Power Logger</a>
    </div>
    <div class="Header-item">
        {#if Object.keys(user).length === 0 }
        <a href="/login" class="Header-link">ログイン/新規登録</a>
        {:else}
        <img class="avatar avatar-4" src={user["profile_image_url"]} alt={user.name}/>
        {/if}
    </div>
</div>

<!-- ページが挿入される場所 -->
<slot></slot>