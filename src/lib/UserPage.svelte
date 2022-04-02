<script>
    import { session } from "$app/stores";
    import { flash } from "$lib/stores/flash";
    let user = $session;
    function closeFlash() {
        flash.update(() => null);
    }

    export let id, twitter_name, twitter_image, fighters, breadcrumb;

    import { writable } from "svelte/store";
    import Modal, { bind } from "svelte-simple-modal";
    import PowerLoading from "$lib/PowerLoading.svelte";
    import TweetEdit from "./TweetEdit.svelte";
    import ImageUpload from "./ImageUpload.svelte";
    const modal = writable(null);
    const showPowerModal = () => modal.set(bind(PowerLoading, { splId: id }));
    const showShareModal = () => modal.set(bind(TweetEdit, {id}));
    const showImageModal = () => modal.set(bind(ImageUpload, { splId: id }));
</script>

<Modal
    show={$modal}
    classContent="Box"
    closeButton={false}
>
{#if $flash}
    <div class="d-flex mt-4 mx-2">
        <div class="col-12">
            <div class="flash" class:flash-success={$flash.type == "success"} class:flash-error={$flash.type == "error"}>
                {$flash.message}
                <button on:click={closeFlash} class="flash-close" type="button" aria-label="Close">
                    <svg class="octicon octicon-x" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill-rule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path></svg>
                </button>
            </div>
        </div>
    </div>
{/if}
<div class="d-flex mx-2 mt-4">
    {@html breadcrumb}
</div>
<div class="d-flex flex-wrap-reverse mb-4">
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
                <button class="btn btn-large btn-block m-1 d-flex flex-justify-center flex-items-center" on:click={showPowerModal}>
                    <img class="mr-1" src="/twitter_logo.svg" width="16" height="16" alt="twitter"/> ツイートから戦闘力を記録
                </button>
                <button class="btn btn-large btn-block m-1 d-flex flex-justify-center flex-items-center" on:click={showImageModal}>
                    <svg class="mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill-rule="evenodd" d="M1.75 2.5a.25.25 0 00-.25.25v10.5c0 .138.112.25.25.25h.94a.76.76 0 01.03-.03l6.077-6.078a1.75 1.75 0 012.412-.06L14.5 10.31V2.75a.25.25 0 00-.25-.25H1.75zm12.5 11H4.81l5.048-5.047a.25.25 0 01.344-.009l4.298 3.889v.917a.25.25 0 01-.25.25zm1.75-.25V2.75A1.75 1.75 0 0014.25 1H1.75A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25zM5.5 6a.5.5 0 11-1 0 .5.5 0 011 0zM7 6a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    画像から戦闘力を記録
                </button>
                <button on:click={showShareModal} class="btn btn-large btn-block m-1 d-flex flex-justify-center flex-items-center">
                    <img class="mr-1" src="/twitter_logo.svg" width="16" height="16" alt="twitter"/> 戦闘力グラフをツイート
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