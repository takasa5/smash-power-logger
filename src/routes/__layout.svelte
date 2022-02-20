<script>
    import { session } from "$app/stores";
	$: user = $session;
</script>

<div class="Header">
    <div class="Header-item Header-item--full">
        <a href="/" class="Header-link">Smash Power Logger</a>
    </div>
    <div class="Header-item">
        {#if Object.keys(user).length === 0 }
        <a href="/login" class="Header-link">ログイン/新規登録</a>
        {:else}
        <a href="/users/{user.splId}" class="Header-link">
            <img class="avatar avatar-2" src={user["profile_image_url"]} alt={user.name}/>
        </a>
        {/if}
    </div>
</div>

<!-- ページが挿入される場所 -->
<slot></slot>