<script>
    import PowerGraph from "$lib/PowerGraph.svelte";
    import UserPage from "$lib/UserPage.svelte";
    import { page } from "$app/stores";

    export let id, twitter_name, twitter_image, fighters, fighter_name;
    export let powers;

    let loginUser = $page.stuff.user;
</script>

<svelte:head>
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
        />
</UserPage>
