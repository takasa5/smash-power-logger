<script>
    import moment from "moment";
    import notation from "$lib/fighter_notation.json";
    import { getContext } from "svelte";
    const { close } = getContext("simple-modal");
    export let id, userId, fighterId, power, recordedAt;

    const { label, icon } = notation[fighterId];
</script>

{#if id && power && recordedAt}
<div class="mb-2">
    以下の戦闘力データを削除してもよろしいですか？
</div>
<div class="Box">
    <div class="Box-row d-flex flex-items-center">
        <div class="flex-auto d-flex flex-column flex-md-row">
            <div class="col-2 d-flex flex-justify-center flex-items-center">
                <img class="avatar-6" alt={label} src={icon}>
            </div>
            <div>
                <div class="h2">{power}</div>
                <div class="text-small color-fg-subtle">
                    {moment(recordedAt, "YYYY-MM-DDTHH:mm:ssZ").format("YYYY/MM/DD HH:mm:ss")}
                </div>
            </div>
        </div>
    </div>
</div>
{:else}
<div class="mb-2">
    {label}の戦闘力データをすべて削除してもよろしいですか？
</div>
{/if}
<div class="d-flex flex-justify-center mt-2">
    <button class="btn btn-secondary mr-2" on:click={close}>
        キャンセル
    </button>
    <button class="btn btn-danger" on:click={() => {}} >
        削除する
    </button>
</div>