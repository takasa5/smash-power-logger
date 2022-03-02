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
        powers = res;
        return res;
    }

    async function registPower() {
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
            location.reload();
        }
        // TODO: 失敗時の挙動
        return {
            status: 500
        };
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
            <p>ヘルプページを参照してください</p>
        </div>
    {/each}
    </div>
    <div class="d-flex flex-justify-center mt-2">
        <button class="btn btn-secondary mr-2" on:click={close}>
            キャンセル
        </button>
        <button class="btn btn-primary" on:click={registPower} aria-disabled={powers.length == 0}>
            記録する
        </button>
    </div>
{/await}