<script>
    import PowerGraph from "$lib/PowerGraph.svelte";
    import UserPage from "$lib/UserPage.svelte";
    import { session } from "$app/stores";

    export let id, twitter_name, twitter_image, fighters, fighter_name, fighterId;
    export let powers;

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
                <li class="breadcrumb-item">
                    <a href="/users/${id}">${twitter_name}</a>
                </li>
                <li class="breadcrumb-item breadcrumb-item-selected" aria-current="page">
                    <a href="/users/${id}/fighters/${fighterId}">${fighter_name}</a>
                </li>
            </ol>
        </nav>
    `
</script>

<svelte:head>
    <meta property="og:url" content={url} />
    <meta property="og:type" content="article" />
    <meta property="og:image" content={origin + "/ogp.png"} />
    <meta property="og:title" content="{twitter_name}の戦闘力グラフ ({fighter_name}) | SmashPowerLogger" />
    <meta name="twitter:card" content="summary" />
	<title>{twitter_name}の戦闘力グラフ ({fighter_name}) | SmashPowerLogger</title>
</svelte:head>

<UserPage
    id={id}
    twitter_name={twitter_name}
    twitter_image={twitter_image}
    fighters={fighters}
    {breadcrumb}>
    <PowerGraph
        id={id}
        slot="power"
        powers={powers}
        loginUser={loginUser}
        control={true}
        isDisplayRank={true}
        />
</UserPage>
