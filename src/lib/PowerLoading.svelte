<script>
    import moment from "moment";
    import { getContext } from "svelte";
    import { flash } from "$lib/stores/flash";
    const { close } = getContext("simple-modal");
    export let splId;
    let powers = [];
    let tweetDeleteFlag = window ? window.localStorage.getItem("tweetDeleteFlag") == "true" : false;

    async function getPower() {
        const response = await fetch(`/users/${splId}/powers`, {
            method: "GET"
        });
        const res = await response.json();
        powers = res;
        return res;
    }

    let disabled = false;
    async function registPower() {
        disabled = true;
        if (powers.length === 0) {
            return;
        }
        powers.forEach(e => e.deleteFlag = tweetDeleteFlag);
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

    async function getPowerDummy() {
        const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));
        await sleep(1000);
        powers = [
            {
                key: '3_1495754719251238914',
                power: 11138316,
                fighter_id: "01",
                fighter: 'マリオ',
                icon: "/fighter_icons/mario.png",
                time: '2022-02-21T13:38:09.000Z'
            },
            {
                key: '3_1495754719251238911',
                power: 11140404,
                fighter_id: "01",
                fighter: 'マリオ',
                icon: "/fighter_icons/mario.png",
                time: '2022-02-23T13:38:09.000Z'
            },
            {
                key: '3_1495754719251238944',
                power: 11145098,
                fighter_id: "01",
                fighter: 'マリオ',
                icon: "/fighter_icons/mario.png",
                time: '2022-02-28T13:38:09.000Z'
            }
        ]
        return powers;
    }

    function deleteData(mediaKey) {
        powers = powers.filter(e => e.key != mediaKey);
    }

    function checkDelete() {
        window.localStorage.setItem("tweetDeleteFlag", tweetDeleteFlag);
    }
</script>

{#await getPower()}
    <div class="Box">
        <div class="blankslate">
            <h3 class="blankslate-heading">ツイートから戦闘力を読み込んでいます<span class="AnimatedEllipsis"></span></h3>
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
            <button type="button" class="btn" on:click={deleteData(data.key)}>記録しない</button>
        </div>
    {:else}
        <div class="blankslate">
            <h3 class="blankslate-heading">記録する戦闘力が見つかりません</h3>
            <p><a href="/help">ヘルプページ</a>を参照してください</p>
            <p>
                現在本サービスはβ版で、一部ファイターでは正常な画像でも認識が失敗することがあります。
                全ファイターを安定して認識させるために、認識失敗したツイートを<a href="https://twitter.com/chixinossb" target="_blank" rel="noopener noreferrer">Twitterで共有</a>いただけると幸いです。
            </p>
        </div>
    {/each}
    </div>
    <div class="d-flex flex-justify-center">
        <form>
            <div class="form-checkbox">
            <label>
                <input bind:checked={tweetDeleteFlag} type="checkbox" on:change={checkDelete} />
                記録したツイートを削除する
            </label>
            </div>
        </form>
    </div>
    <div class="d-flex flex-justify-center">
        <button class="btn btn-secondary mr-2" on:click={close}>
            キャンセル
        </button>
        <button class="btn btn-outline" on:click={registPower} aria-disabled={powers.length == 0 || disabled} disabled={powers.length == 0 || disabled}>
            記録する
        </button>
    </div>
{/await}