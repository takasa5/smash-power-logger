<script>
    import PowerGraph from "$lib/PowerGraph.svelte";
    import UserPage from "$lib/UserPage.svelte";
    export let id, twitter_name, twitter_image, twitter_username, publish_flag, twitter_publish_flag, fighters, powers;

    import { session } from "$app/stores";
    let loginUser = $session;

    import { browser } from "$app/env";
    let url = browser ? window.location.href : "";
    let origin = browser ? window.location.origin : "";

    const breadcrumb = `
        <nav aria-label="Breadcrumb">
            <ol>
                <li class="breadcrumb-item">
                    <a href="/">TOP</a>
                </li>
                <li class="breadcrumb-item breadcrumb-item-selected" aria-current="page">
                    <a href="/users/${id}">${twitter_name}</a>
                </li>
            </ol>
        </nav>
    `
</script>

<svelte:head>
    <meta property="og:url" content={url} />
    <meta property="og:type" content="article" />
    <meta property="og:image" content={origin + "/ogp.png"} />
    <meta property="og:title" content="{twitter_name}の戦闘力グラフ | SmashPowerLogger" />
    <meta name="twitter:card" content="summary" />
    <title>{twitter_name}の戦闘力グラフ | SmashPowerLogger</title>
</svelte:head>

<UserPage
    id={id}
    twitter_name={twitter_name}
    twitter_image={twitter_image}
    {twitter_username}
    fighters={fighters} 
    {publish_flag}
    {twitter_publish_flag}
    {breadcrumb}>
    <PowerGraph
        slot="power"
        id={id}
        powers={powers}
        loginUser={loginUser}
        control={true}
        isDisplayRank={true}
        isMultipleFighter={true}
        />
</UserPage>
