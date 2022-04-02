<script>
    import {clickOutside} from "$lib/clickOutside";
    import { session } from "$app/stores";
    let user = $session;
    let popoverShow = false;

    function openPopover() {
        popoverShow = !popoverShow;
    }

    function closePopover(event) {
        popoverShow = false;
    }
</script>

<div class="d-flex flex-column position-relative" style="min-height: 100vh">
    {#if popoverShow}
    <div id="popover" class="right-0 Popover" style="top: 0 !important">
        <div class="mt-6 mr-md-4 Popover-message Popover-message--top-right text-left Box color-shadow-large"
            use:clickOutside on:click_outside={closePopover}>
                <ul>
                    <li class="Box-row　p-0"><a class="d-block m-lg-2 m-3" href="/users/{user.splId}">マイページ</a></li>
                    <li class="Box-row　p-0"><a class="d-block m-lg-2 m-3" href="/users/{user.splId}/setting">設定</a></li>
                    <li class="Box-row　p-0"><a class="d-block m-lg-2 m-3" href="/help">ヘルプ</a></li>
                    <li class="Box-row　p-0"><a class="d-block m-lg-2 m-3" href="/logout">ログアウト</a></li>
                </ul>
        </div>
    </div>
    {/if}
    <div class="Header">
        <div class="Header-item Header-item--full d-table">
            <a href="/" class="mr-2 d-inline-flex flex-items-center v-align-middle">
                <img src="/favicon.png" alt="logo" width="24" height="24" />
            </a>
            <a href="/" class="Header-link v-align-middle">SmashPowerLogger</a>
            <a href="/history" class="f6 Link--primary color-fg-on-emphasis v-align-bottom pl-1">0.3.0 β</a>
        </div>
        <div class="Header-item">
            {#if !user }
            <a href="/login" class="Header-link">ログイン/<span class="d-md-inline d-none">新規</span>登録</a>
            {:else}
            <img on:click={openPopover} class="Link avatar avatar-2" src={user["profile_image_url"]} alt={user.name}/>
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
            Copyright©︎2022 <a href="https://twitter.com/chixinossb">ちくしの</a> All rights reserved.
        </div>
    </footer>
</div>