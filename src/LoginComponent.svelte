<script>
    import {get} from "./utils";
    const loginUrl = get("/login");
</script>

{#await loginUrl then url}
    <a href={url.body}>ログイン</a>
{/await}