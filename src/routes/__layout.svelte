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

<div class="d-flex flex-column" style="min-height: 100vh">
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
    <div class="flex-1">
        <!-- ページが挿入される場所 -->
        <slot></slot>
    </div>
    <footer class="d-flex flex-justify-center border-top p-2">
        <div class="col-lg-4 col-12 text-small color-fg-subtle text-center">
            <a href="https://www.smashbros.com/ja_JP/">大乱闘スマッシュブラザーズSPECIAL</a>は任天堂株式会社様の登録商標です。
            <br>
            当サイトでは一部任天堂株式会社様の著作物を使用しておりますが、任天堂株式会社様その他関連企業様とは無関係の個人が運営するものです。
            <br>
            Copyright©︎2022 ちくしの All rights reserved.
        </div>
    </footer>
</div>