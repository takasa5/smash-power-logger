<script>
    import { writable } from "svelte/store";
    import Modal, { bind } from "svelte-simple-modal";
    import PowerDelete from "$lib/PowerDelete.svelte";
    import AccountDelete from "$lib/AccountDelete.svelte";
    const modal = writable(null);
    function showPowerModal(power) {
        modal.set(bind(PowerDelete, power));
    }
    function showAccountModal() {
        modal.set(bind(AccountDelete, {
            userId: user.splId
        }));
    }

    import { session } from "$app/stores";
    import { slide } from 'svelte/transition';
    import moment from "moment";
    import { flash } from "$lib/stores/flash";
    import { powerCache } from "$lib/stores/powerCache";

    export let fighters;
    let user = $session;
    let powers, selectedFighter;

    async function togglePower(id) {
        if (selectedFighter && selectedFighter == id) {
            // opened
            selectedFighter = undefined;
            return;
        }
        selectedFighter = id;

        if ($powerCache[id]) {
            // キャッシュヒットしたら利用する
            powers = $powerCache[id];
        } else {
            powers = fetchPower(id);
            // powers = getDummy(id);
        }
    }

    async function fetchPower(id) {
        const response = await fetch(`/users/${user.splId}/fighters/${id}/api`);
        const powers = await response.json();
        // キャッシュ
        saveCache(id, powers);
        return powers;
    }

    async function getDummy(id) {
        const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));
        await sleep(1000);
        const powers = [
            {
                id: 1,
                userId: 1,
                power: 11138316,
                fighterId: id,
                recordedAt: '2022-02-01T11:11:01.000Z'
            },
            {
                id: 2,
                userId: 1,
                power: 11138316,
                fighterId: id,
                recordedAt: '2022-02-21T13:38:39.000Z'
            },
            {
                id: 3,
                userId: 1,
                power: 11138316,
                fighterId: id,
                recordedAt: '2022-03-21T13:38:39.000Z'
            }
        ];
        // キャッシュ
        saveCache(id, powers);

        return powers;
    }

    function saveCache(fighterId, powers) {
        const tmp = {};
        tmp[fighterId] = powers;
        powerCache.update(c => Object.assign(c, tmp));
    }
</script>

<svelte:head>
	<title>設定 | Smash Power Logger</title>
</svelte:head>

<style>
    svg { 
        transition: transform 0.1s ease-in;
    }
    svg[aria-expanded=true] { transform: rotate(0.25turn); }
</style>

<Modal
    show={$modal}
    classContent="Box"
    closeButton={false}
>
{#if $flash}
<div class="d-flex mt-4 mx-2">
    <div class="col-lg-8 col-12 mx-auto">
        <div class="flash" class:flash-success={$flash.type == "success"} class:flash-error={$flash.type == "error"}>
            {$flash.message}
            <button on:click={() => {flash.update(() => null)}} class="flash-close" type="button" aria-label="Close">
                <svg class="octicon octicon-x" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill-rule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path></svg>
            </button>
        </div>
    </div>
</div>
{/if}
<div class="d-flex my-4 mx-2">
    <div class="col-lg-8 col-12 mx-auto">
        <div class="Box">
            <div class="Box-header h3">
                設定
            </div>
            <div class="Box-row">
                <div class="col-12 d-flex flex-column flex-items-center">
                    <img class="avatar avatar-8" src={user.profile_image_url.replace("_normal", "_bigger")} alt="{user.name}" />
                    <div class="h4">{user.name}</div>
                    <div>SPL-ID: {user.splId}</div>
                </div>
            </div>
            <div class="Box-row">
                <div class="h4">データを削除する</div>
                <div class="color-fg-subtle">※各ファイターの最新10件のみ各個データを削除できます</div>
                <!-- svelte-ignore a11y-no-redundant-roles -->
                <ul class="ActionList" role="list">
                    {#each fighters as fighter (fighter.id)}
                    <li class="ActionList-item ActionList-item--hasSubItem">
                        <!-- ファイター -->
                        <span class="border ActionList-content ActionList-content--sizeMedium ActionList-content--visual16" on:click={async () => await togglePower(fighter.id)}>
                            <span class="ActionList-item-visual ActionList-item-visual--leading d-flex flex-items-center"><svg aria-expanded={powers && selectedFighter == fighter.id} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill-rule="evenodd" d="M6.22 3.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 010-1.06z"></path></svg></span>
                            <span class="ActionList-item-label d-flex flex-items-center"><img class="mr-1" width="16" src={fighter.icon} alt={fighter.label} />{fighter.label}</span>
                        </span>
                        <!-- 戦闘力 -->
                        {#if $powerCache && selectedFighter == fighter.id}
                        {#await powers}
                        <span class="ActionList-content pl-4" transition:slide="{{dulation: 100}}">
                            <span class="ActionList-item-label">読み込み中です<span class="AnimatedEllipsis"></span></span>
                        </span>
                        {:then results}
                        <ul class="ActionList ActionList--subGroup" role="list"
                            transition:slide="{{dulation: 100}}">
                            {#each $powerCache[fighter.id] as power}
                            <li class="ActionList-item ActionList-item--subItem pl-4"
                                on:click={() => showPowerModal(power)}>
                                <div class="ActionList-content">
                                    <span class="ActionList-item-visual ActionList-item-visual--leading"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill-rule="evenodd" d="M3.404 12.596a6.5 6.5 0 119.192-9.192 6.5 6.5 0 01-9.192 9.192zM2.344 2.343a8 8 0 1011.313 11.314A8 8 0 002.343 2.343zM6.03 4.97a.75.75 0 00-1.06 1.06L6.94 8 4.97 9.97a.75.75 0 101.06 1.06L8 9.06l1.97 1.97a.75.75 0 101.06-1.06L9.06 8l1.97-1.97a.75.75 0 10-1.06-1.06L8 6.94 6.03 4.97z"></path></svg></span>
                                    <span class="ActionList-item-label d-flex">
                                        <span class="col-lg-8 col-6 d-inline-block">{moment(power.recordedAt, "YYYY-MM-DDTHH:mm:ssZ").format("YYYY/MM/DD HH:mm:ss")}</span>
                                        <span class="col-lg-4 col-6 d-inline-block">{power.power}</span>
                                    </span>
                                </div>
                            </li>
                            {/each}
                            <li class="ActionList-item ActionList-item--subItem ActionList-item--danger pl-4"
                                on:click={() => showPowerModal({ userId: user.splId, fighterId: selectedFighter })}>
                                <div class="ActionList-content">
                                    <span class="ActionList-item-visual ActionList-item-visual--leading"><svg style="fill: #cf222e" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill-rule="evenodd" d="M8.22 1.754a.25.25 0 00-.44 0L1.698 13.132a.25.25 0 00.22.368h12.164a.25.25 0 00.22-.368L8.22 1.754zm-1.763-.707c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0114.082 15H1.918a1.75 1.75 0 01-1.543-2.575L6.457 1.047zM9 11a1 1 0 11-2 0 1 1 0 012 0zm-.25-5.25a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5z"></path></svg></span>
                                    <span class="ActionList-item-label">このファイターのすべての戦闘力を削除</span>
                                </div>
                            </li>
                        </ul>
                        {/await}
                        {/if}
                    </li>
                    {:else}
                    <li class="ActionList-item">
                        <span class="ActionList-content">
                            <span class="ActionList-item-label">戦闘力データがありません</span>
                        </span>
                    </li>
                    {/each}
                </ul>
                <div class="h4 mt-4">アカウントを削除する</div>
                <div class="color-fg-subtle">※全ての戦闘力データも削除されます</div>
                <div class="p-2">
                    <button on:click={showAccountModal} class="btn btn-danger" type="button">アカウントを削除</button>
                </div>
            </div>
        </div>
    </div>
</div>
</Modal>