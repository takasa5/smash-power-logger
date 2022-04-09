<script>
    import { flash } from "$lib/stores/flash";
    import { getContext } from "svelte";
    const { close } = getContext("simple-modal");
    export let id, publish_flag;

    let value = "";
    const hashTag = "#SmashPowerLogger"
    $: restCount = getRestCount(value);
    /**
     * ツイートの残り文字数をカウントする
    */
    function getRestCount(content) {
        const max = 140;
        const urlLength = publish_flag ? 23 : 0;
        return max - urlLength - hashTag.length - content.length;
    }

    /**
     * shareエンドポイントを叩きツイートを実行する
    */
    const canvas = document.getElementById("powerChart");
    const base64 = canvas.toDataURL();
    let disabled = false;
    async function share() {
        disabled = true;
        const text = value.length > 0 
            ? value + " " + hashTag + (publish_flag ? " " + window.location.href : "") 
            : hashTag + " " + (publish_flag ? " " + window.location.href : "") ;
        const response = await fetch(`/users/${id}/share`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                img: base64
            })
        });
        if (response.ok) {
            flash.update(() => {
                return {
                    type: "success",
                    message: "ツイートに成功しました"
                }
            });
            close();
            return;
        }
        flash.update(() => {
            return {
                type: "error",
                message: "ツイートに失敗しました"
            }
        });
        close();
    }
</script>

<style>
    .errored {
        border-color: #cf222e
    }
</style>

<div class="d-flex flex-column">
    <div class="col-12 form-control" class:errored={restCount < 0}>
        <textarea placeholder="ツイートの内容を記入できます" bind:value class="col-12" style="resize: none; border: none; outline: none;"></textarea>
        <div class="color-fg-subtle text-right">{hashTag}{(publish_flag ? " " + window.location.href : "")}</div>
    </div>
    <div class="col-12 color-fg-subtle text-right">{restCount}</div>
    <img class="col-8 m-auto" src={base64} alt="添付画像"/>
</div>
<div class="d-flex flex-justify-center mt-2">
    <button class="btn btn-secondary mr-2" on:click={close}>
        キャンセル
    </button>
    <button class="btn btn-outline" on:click={share} aria-disabled={restCount < 0 || disabled} disabled={restCount < 0 || disabled}>
        ツイートする
    </button>
</div>