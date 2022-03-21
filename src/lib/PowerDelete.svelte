<script>
    import moment from "moment";
    import notation from "$lib/fighter_notation.json";
    import { flash } from "$lib/stores/flash";
    import { getContext } from "svelte";
    import { powerCache } from "$lib/stores/powerCache";
    const { close } = getContext("simple-modal");
    export let id, userId, fighterId, power, recordedAt;
    let disabled = false;
    const { label, icon } = notation[fighterId];
    
    async function deletePower(powerId) {
        disabled = true;
        if (powerId) {
            const response = await fetch(
                `/users/${userId}/fighters/${fighterId}/api`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({powerId})
                }
            );
            if (response.ok) {
                // 戦闘力キャッシュも更新して実データに追随
                flash.update(() => {
                    return {
                        type: "success",
                        message: "戦闘力の削除に成功しました"
                    }
                });
                powerCache.update(c => modCache(c, powerId));
                close();
                document.body.scrollIntoView();
                return;
            }
            flash.update(() => {
                return {
                    type: "error",
                    message: "戦闘力の削除に失敗しました"
                }
            });
            close();
            document.body.scrollIntoView();
            return;
        }
        const response = await fetch(
            `/users/${userId}/fighters/${fighterId}/api`,
            { 
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "powerId": null
                })
            }
        )
        if (response.ok) {
            location.reload();
            return;
        }
        flash.update(() => {
            return {
                type: "error",
                message: "戦闘力の削除に失敗しました"
            }
        });
        close();
        document.body.scrollIntoView();
        return;
    }

    function modCache(cache, id) {
        cache[fighterId] = cache[fighterId].filter(e => e.id != id);
        console.log(cache);
        return cache;
    }
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
    <button class="btn btn-danger" on:click|once={async () => await deletePower(id)} aria-disabled={disabled} {disabled}>
        削除する
    </button>
</div>