<script>
    import PowerGraph from "$lib/PowerGraph.svelte";
    import UserPage from "$lib/UserPage.svelte";
    export let id, twitter_name, twitter_image, fighters, powers;

    import { page } from "$app/stores";
    let loginUser = $page.stuff.user;
</script>

<svelte:head>
    <title>{twitter_name}の戦闘力グラフ | SmashPowerLogger</title>
</svelte:head>

<UserPage
    id={id}
    twitter_name={twitter_name}
    twitter_image={twitter_image}
    fighters={fighters} >
    <PowerGraph
        slot="power"
        id={id}
        powers={powers}
        loginUser={loginUser}
        />
</UserPage>
