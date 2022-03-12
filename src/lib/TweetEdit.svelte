<script>
    import { getContext } from "svelte";
    const { close } = getContext("simple-modal");
    export let id;
    let value = "";
    const hashTag = "#SmashPowerLogger"
    $: restCount = getRestCount(value);

    const canvas = document.getElementById("powerChart");
    const base64 = canvas.toDataURL();

    function getRestCount(content) {
        const max = 140;
        return max - hashTag.length - content.length;
    }

    async function share() {
        await fetch(`/users/${id}/share`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: value + " " + hashTag,
                img: base64
            })
        });
    }
</script>

<style>
    .errored {
        border-color: #cf222e
    }
</style>

<div class="d-flex flex-column">
    <div class="col-12 form-control" class:errored={restCount < 0}>
        <textarea bind:value class="col-12" style="resize: none; border: none; outline: none;"></textarea>
        <div class="color-fg-subtle text-right">{hashTag}</div>
    </div>
    <div class="col-12 color-fg-subtle text-right">{restCount}</div>
    <img class="col-8 m-auto" src={base64} alt="添付画像"/>
</div>
<div class="d-flex flex-justify-center mt-2">
    <button class="btn btn-secondary mr-2" on:click={close}>
        キャンセル
    </button>
    <button class="btn btn-outline" on:click={share} aria-disabled={restCount < 0} disabled={restCount < 0}>
        ツイートする
    </button>
</div>