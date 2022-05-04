
<script>
    import Dropzone from "svelte-file-dropzone";
    import moment from "moment";
    import { getContext } from "svelte";
    import { flash } from "$lib/stores/flash";
    const { close } = getContext("simple-modal");

    export let splId;

    let disabled = false;
    async function registPower() {
        disabled = true;
        if (powers.length === 0) {
            return;
        }
        const response = await fetch(`/users/${splId}/powers`, {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(powers)
        });
        if (response.ok) {
            // ページを更新して戦闘力を反映
            location.reload();
            return;
        }
        if (response.status == 403) {
            flash.update(() => {
                return {
                    type: "error",
                    message: "戦闘力の登録に成功しましたが、ツイートの削除に失敗しました"
                }
            });
            close();
            document.body.scrollIntoView();
            return;
        }
        flash.update(() => {
            return {
                type: "error",
                message: "戦闘力の登録に失敗しました"
            }
        });
        close();
        document.body.scrollIntoView();
    }

    let acceptedFiles = [];
    let powers = [];
    let postObjs;
    async function handleFilesSelect(e) {
        const { acceptedFiles: accepted, fileRejections } = e.detail;
        acceptedFiles = [...acceptedFiles, ...accepted];
        if (acceptedFiles.length == 0) {
            return;
        }
        postObjs = await Promise.all(acceptedFiles.map(async (file, index) => {
            if (index > 3) {
                return;
            }
            const obj = {};
            obj.tweetId = "dummy";
            obj.media_key = String(index); // 除却に使う
            obj.base64 = await readFile(file);
            obj.createdAt = moment().utcOffset(0).format("YYYY-MM-DDTHH:mm:ss[Z]");
            return obj;
        }));
    }

    async function recognize() {
        const response = await fetch(`/users/${splId}/powersimage`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(postObjs)
        });
        powers = await response.json();
        return powers;
    }

    function readFile(file) {
        return new Promise((resolve, reject) => {
            var fr = new FileReader();  
            fr.onload = () => {
                resolve(fr.result.split(",")[1]);
            };
            fr.onerror = reject;
            fr.readAsDataURL(file);
        });
    }

    function deleteData(mediaKey) {
        powers = powers.filter(e => e.key != mediaKey);
    }
</script>

{#if !postObjs}
<div class="Box">
    <Dropzone on:drop={handleFilesSelect} accept="image/*">
        <p class="text-center">戦闘力のスクリーンショットをドラッグ&ドロップするか、<br class="d-md-inline d-none">ここをクリックして選択してください</p>
        <p>一度に4枚まで読み込めます</p>
    </Dropzone>
</div>
{:else}
    {#await recognize()}
    <div class="Box">
        <div class="blankslate">
            <h3 class="blankslate-heading">画像から戦闘力を読み込んでいます<span class="AnimatedEllipsis"></span></h3>
            <p>これには数秒かかることがあります</p>
        </div>
    </div>
    {:then datas} 
        <div class="Box">
        {#each powers as data (data.key)}
            <div class="Box-row d-flex flex-items-center">
                <div class="flex-auto d-flex flex-column flex-md-row">
                    <div class="col-2 d-flex flex-justify-center flex-items-center">
                        <img class="avatar-6" alt={data.fighter} src={data.icon}>
                    </div>
                    <div>
                        <div class="h2">{data.power}</div>
                        <div class="text-small color-fg-subtle">
                            {moment(data.time, "YYYY-MM-DDTHH:mm:ssZ").format("YYYY/MM/DD HH:mm:ss")}
                        </div>
                    </div>
                </div>
                <button type="button" class="btn" on:click={() => deleteData(data.key)}>記録しない</button>
            </div>
        {:else}
            <div class="blankslate">
                <h3 class="blankslate-heading">記録する戦闘力が見つかりません</h3>
                <p><a href="/help">ヘルプページ</a>を参照してください</p>
                <p>
                    現在本サービスはβ版で、一部ファイターでは正常な画像でも認識が失敗することがあります。
                    全ファイターを安定して認識させるために、認識失敗した画像を<a href="https://twitter.com/chixinossb" target="_blank" rel="noopener noreferrer">Twitterで共有</a>いただけると幸いです。
                </p>
            </div>
        {/each}
        </div>
    {/await}
{/if}
<div class="d-flex flex-justify-center mt-4">
    <button class="btn btn-secondary mr-2" on:click={close}>
        キャンセル
    </button>
    <button class="btn btn-outline" on:click={registPower} aria-disabled={powers.length == 0 || disabled} disabled={powers.length == 0 || disabled}>
        記録する
    </button>
</div>