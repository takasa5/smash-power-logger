<script>
    import moment from "moment";
    import { getContext } from "svelte";
    const { close } = getContext("simple-modal");
    export let splId;
    let powers = [];

    async function getPower() {
        const response = await fetch(`/users/${splId}/powers`, {
            method: "GET"
        });
        const res = await response.json();
        // TODO: 取得時に期限付きでどっかのストレージに入れられたらよさそう
        powers = res;
        return res;
    }

    async function getPowerDummy() {
        const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));
        await sleep(3000);
        powers = [
            {
                id: '3_1495754719251238914',
                power: '11138316',
                fighter: 'キャフテン・ファルコン',
                time: '2022-02-21T13:38:09.000Z'
            },
            {
                id: '3_1495754719251238911',
                power: '11140404',
                fighter: 'キャフテン・ファルコン',
                time: '2022-02-23T13:38:09.000Z'
            },
            {
                id: '3_1495754719251238944',
                power: '11145098',
                fighter: 'キャフテン・ファルコン',
                time: '2022-02-28T13:38:09.000Z'
            }
        ]
        return powers;
    }

    function deleteData(mediaId) {
        powers = powers.filter(e => e.id != mediaId);
    }
</script>

{#await getPowerDummy()}
    <div class="Box">
        <div class="blankslate">
            <h3 class="blankslate-heading">ツイートから戦闘力を読み込んでいます<span class="AnimatedEllipsis"></span></h3>
            <p>これには数秒かかることがあります</p>
        </div>
    </div>
{:then datas}
    <div class="Box">
    {#each powers as data (data.id)}
        <div class="Box-row d-flex flex-items-center">
            <div class="flex-auto d-flex flex-column flex-md-row">
                <div class="col-2 d-flex flex-justify-center flex-items-center">
                    <img class="avatar-6" alt="" src="/fighter_icons/captain.png">
                </div>
                <div>
                    <div class="h2">{data.power}</div>
                    <div class="text-small color-fg-subtle">
                        {moment(data.time, "YYYY-MM-DDTHH:mm:ssZ").format("YYYY/MM/DD HH:mm:ss")}
                    </div>
                </div>
            </div>
            <button type="button" class="btn" on:click={deleteData(data.id)}>記録しない</button>
        </div>
    {:else}
        <div class="blankslate">
            <h3 class="blankslate-heading">記録する戦闘力が見つかりません</h3>
            <p>ヘルプページを参照してください</p>
        </div>
    {/each}
    </div>
    <div class="d-flex flex-justify-center mt-2">
        <button class="btn btn-secondary mr-2" on:click={close}>
            キャンセル
        </button>
        <button class="btn btn-primary" aria-disabled={powers.length == 0}>
            記録する
        </button>
    </div>
{/await}