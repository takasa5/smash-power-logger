<script>
    import PowerGraph from "$lib/PowerGraph.svelte";
    import notation from "$lib/fighter_notation.json";
    import moment from "moment";
    export let powers, datas;

    import { browser } from "$app/env";
    let url = browser ? window.location.href : "";
    let origin = browser ? window.location.origin : "";
</script>

<svelte:head>
    <meta property="og:url" content={url} />
    <meta property="og:type" content="article" />
    <meta property="og:image" content={origin + "/ogp.png"} />
    <meta property="og:title" content="最近記録された戦闘力 | SmashPowerLogger" />
    <meta name="twitter:card" content="summary" />
    <title>最近記録された戦闘力 | SmashPowerLogger</title>
</svelte:head>

<div class="col-md-8 col-12 mx-auto m-4 p-responsive">
    <h1>最近記録された戦闘力</h1>
    <div>
        SmashPowerLoggerに記録された最新10件の戦闘力を表示します。<br>
        自分のユーザー名を表示されたくない場合は、設定から「ページを非公開にする」にチェックを入れてください。
    </div>
    <PowerGraph
        powers={powers}
        control={false}
        isDisplayRank={true}
        isMultipleFighter={true}
        disableLegends={true}
        />
    <div class="Box d-flex flex-column-reverse">
    {#each datas as data}
        <div class="Box-row d-flex">
            <div class="col-md-2 col-2 mr-1 d-flex flex-items-center">
                {#if data.user.publish_flag}
                <a class="mx-auto" href="/users/{data.userId}">
                    <img class="avatar avatar-4" src={data.user.twitter_image} alt={data.user.twitter_name} />
                </a>
                {:else}
                <svg class="mx-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill-rule="evenodd" d="M4 4v2h-.25A1.75 1.75 0 002 7.75v5.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 13.25v-5.5A1.75 1.75 0 0012.25 6H12V4a4 4 0 10-8 0zm6.5 2V4a2.5 2.5 0 00-5 0v2h5zM12 7.5h.25a.25.25 0 01.25.25v5.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25v-5.5a.25.25 0 01.25-.25H12z"></path></svg>
                {/if}
            </div>
            <div class="col-md-4 col-3 mr-1 d-flex flex-items-center">
                {#if data.user.publish_flag}
                <a href="/users/{data.userId}">
                    {data.user.twitter_name}
                </a>
                {:else}
                    非公開ユーザー
                {/if}
            </div>
            <div class="col-md-4 col-4 mr-1 d-flex flex-items-center">
                {data.power} <img class="ml-1" width="20px" height="20px" src={notation[data.fighterId]["icon"]} alt={notation[data.fighterId]["label"]} />
            </div>
            <div class="col-md-2 col-3 d-flex flex-items-center">
                <span class="color-fg-subtle">
                    {moment(data.recordedAt).format("YYYY/MM/DD HH:mm:ss")}
                </span>
            </div>
        </div>
    {/each}
    </div>

</div>