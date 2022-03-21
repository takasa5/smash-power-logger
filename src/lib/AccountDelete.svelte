<script>
    import { getContext } from "svelte";
    import { flash } from "$lib/stores/flash";
    const { close } = getContext("simple-modal");

    export let userId;
    let disabled = false;

    async function deleteAccount(splId) {
        disabled = true;
        const response = await fetch(
            `/users/${splId}/api`,
            {
                method: "DELETE"
            }
        );
        if (response.ok) {
            // ログアウト処理
            location.href = "/logout";
            return;
        }
        flash.update(() => {
            return {
                type: "error",
                message: "アカウントの削除に失敗しました"
            }
        });
        close();
        document.body.scrollIntoView();
        return;
    }
</script>

<div class="mb-2">
    アカウントを削除してもよろしいですか？<br>
    記録した全ての戦闘力データも削除されます
</div>
<div class="d-flex flex-justify-center mt-2">
    <button class="btn btn-secondary mr-2" on:click={close}>
        キャンセル
    </button>
    <button class="btn btn-danger" on:click|once={async () => await deleteAccount(userId)} aria-disabled={disabled} {disabled}>
        削除する
    </button>
</div>