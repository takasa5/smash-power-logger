<script>
    import { session } from "$app/stores";
    import { flash } from "$lib/flash";
    let user = $session;
    let fls;
    flash.subscribe(val => {
        fls = val;
    });
    function closeFlash() {
        flash.update(() => null);
    }

    export let id, twitter_name, twitter_image, fighters;

    import { writable } from "svelte/store";
    import Modal, { bind } from "svelte-simple-modal";
    import PowerLoading from "$lib/PowerLoading.svelte";
    import TweetEdit from "./TweetEdit.svelte";
    const modal = writable(null);
    const showPowerModal = () => modal.set(bind(PowerLoading, { splId: id }));
    const showShareModal  = () => modal.set(bind(TweetEdit, {id}));
</script>

<Modal
    show={$modal}
    classContent="Box"
    closeButton={false}
>
{#if fls}
    <div class="d-flex mt-4 mx-2">
        <div class="col-12">
            <div class="flash" class:flash-success={fls.type == "success"} class:flash-error={fls.type == "error"}>
                {fls.message}
                <button on:click={closeFlash} class="flash-close" type="button" aria-label="Close">
                    <svg class="octicon octicon-x" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill-rule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path></svg>
                </button>
            </div>
        </div>
    </div>
{/if}
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
                <button class="btn btn-large m-1" on:click={showPowerModal}>戦闘力を記録</button>
                <button on:click={showShareModal} class="btn btn-large m-1 d-inline-flex flex-items-center">
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