<script>
    import PowerGraph from "$lib/PowerGraph.svelte";
    import UserPage from "$lib/UserPage.svelte";
    import { session } from "$app/stores";

    export let id, twitter_name, twitter_image, fighters, fighter_name;
    export let powers;

    let loginUser = $session;

    import { browser } from "$app/env";
    let url = browser ? window.location.href : "";
    let origin = browser ? window.location.origin : "";
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
    fighters={fighters} >
    <PowerGraph
        id={id}
        slot="power"
        powers={powers}
        loginUser={loginUser}
        control={true}
        isDisplayRank={true}
        />
</UserPage>
