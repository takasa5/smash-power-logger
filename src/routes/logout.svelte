<script>
    import { browser } from "$app/env";
    // サーバーから直接リダイレクトするとセッション反映が間に合わないため、フロントで遷移先に飛ばす
    if (browser) {
        window.location.href = "/";
    }
</script>