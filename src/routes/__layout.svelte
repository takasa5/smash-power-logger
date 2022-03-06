<script context="module">
    export async function load({ fetch }) {
        const response = await fetch(`/refresh`, {
            method: "GET"
        });
        if (response.ok) {
            const res = await response.json();
            return {
                status: 200,
                props: res,
                stuff: res
            };
        }
        return {
            status: 200
        }
    }
</script>
<script>
    export let user;
</script>

<div class="Header">
    <div class="Header-item Header-item--full">
        <a href="/" class="Header-link">Smash Power Logger</a>
    </div>
    <div class="Header-item">
        {#if !user }
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