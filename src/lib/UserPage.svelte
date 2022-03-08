<script>
    import { page } from "$app/stores";
    $: user = $page.stuff.user;

    export let id, twitter_name, twitter_image, fighters;

    import { writable } from "svelte/store";
    import Modal, { bind } from "svelte-simple-modal";
    import PowerLoading from "$lib/PowerLoading.svelte";
    const modal = writable(null);
    const showModal = () => modal.set(bind(PowerLoading, { splId: id }));

</script>

<Modal
    show={$modal}
    classContent="Box"
    closeButton={false}
>
<div class="d-flex flex-wrap-reverse my-4">
    <div class="col-lg-4 col-12">
        <div class="Box m-2">
            <div class="Box-header h3">
                <a href="/users/{id}" class="Link--primary">{twitter_name}</a>
            </div>
            <div class="Box-row d-flex">
                <img class="col-4 avatar avatar-8 mx-auto" src={twitter_image.replace("_normal", "_bigger")} alt="{twitter_name}" />
                <div class="col-8">SPL-ID: {id}</div>
            </div>
            {#if user && id == user.splId}
            <div class="Box-row d-flex flex-wrap flex-justify-center">
                <button class="btn btn-large m-1" on:click={showModal}>戦闘力を記録</button>
                <button class="btn btn-large m-1 d-inline-flex flex-items-center">
                    <img class="mr-1" src="/twitter_logo.svg" width="16" height="16" alt="シェア"/> シェア
                </button>
            </div>
            {/if}
            {#if fighters.length > 0}
                {#each fighters as fighter}
                <div class="Box-row d-flex">
                    <a class="col-4 d-flex flex-items-center" href="/users/{id}/fighters/{fighter.id}">
                        <img class="col-4 mx-auto" src={fighter.icon} alt={fighter.label}/>
                    </a>
                    <div class="col-8 d-flex flex-items-center">
                        <a href="/users/{id}/fighters/{fighter.id}">{fighter.label}</a>
                    </div>
                </div>
                {/each}
            {/if}
        </div>
    </div>
    <div class="col-lg-8 col-12">
        <div class="Box m-2">
            <div class="Box-header h3">
                戦闘力グラフ
            </div>
            <slot name="power">
            </slot>
            <slot name="parts">
                <!-- 期間の制御など -->
            </slot>
        </div>
    </div>
</div>
</Modal>