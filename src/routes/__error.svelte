<script context="module">
    export function load({ error, status }) {
        let message = "エラーが発生しました";
        let submessage = "";
        if (status == 404) {
            message = "ページが見つかりません";
        } else if (status == 403) {
            message = "認証に失敗しました";
            submessage = "再度<a href='/login'>ログイン</a>することによりうまくいくことがあります。"
        }
        return {
            props: {
            message,
            submessage
            }
        };
    }
  </script>

<script>
    export let message, submessage;
</script>

<div class="d-flex flex-justify-center flex-items-center mt-6">
    <div class="blankslate">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill-rule="evenodd" d="M7.638 2.22a.75.75 0 01.53-.22h7.664a.75.75 0 01.53.22l5.418 5.418c.141.14.22.332.22.53v7.664a.75.75 0 01-.22.53l-5.418 5.418a.75.75 0 01-.53.22H8.168a.75.75 0 01-.53-.22l-5.42-5.418a.75.75 0 01-.219-.53V8.168a.75.75 0 01.22-.53l5.418-5.42zM8.48 3.5L3.5 8.48v7.04l4.98 4.98h7.04l4.98-4.98V8.48L15.52 3.5H8.48zM7 11.75a.75.75 0 01.75-.75h8.5a.75.75 0 010 1.5h-8.5a.75.75 0 01-.75-.75z"></path></svg>
        <h3 class="blankslate-heading">{message}</h3>
        {#if submessage.length > 0}
        <p>{@html submessage}</p>
        {/if}
        <p>お困りの際は<a href="/help">ヘルプページ</a>をご覧になるか、<a href="https://twitter.com/chixinossb">開発者</a>へご連絡ください。</p>
    </div>
</div>