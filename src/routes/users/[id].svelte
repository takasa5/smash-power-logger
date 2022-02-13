<script context="module">
    export async function load({ params, fetch, session, stuff }) {
        const id = params.id;
        return {
			props: {
                id
            }
		};
    }
</script>

<script>
    export let id;
</script>

<svelte:head>
	<title>User</title>
</svelte:head>

ID: {id}