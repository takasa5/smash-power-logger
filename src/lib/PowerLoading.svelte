<script>
    import { getContext } from "svelte";
    const { close } = getContext("simple-modal");
    export let splId;

    async function getPower() {
        const response = await fetch(`/users/${splId}/powers`, {
            method: "GET"
        });
        const res = await response.json();
        console.log(res);
        // TODO: 取得時に期限付きでどっかのストレージに入れられたらよさそう
        return res;
    }

    async function getPowerDummy() {
        return [
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
            }
        ];
    }
</script>

{#await getPowerDummy()}
    <p>Loading...</p>
{:then datas}
    <div class="Box">
    {#each datas as data}
        <div class="Box-row d-flex flex-items-center">
            <div class="flex-auto d-flex flex-column flex-md-row">
                <div class="col-2 d-flex flex-justify-center flex-items-center">
                    <img class="avatar-6" alt="" src="/fighter_icons/captain.png">
                </div>
                <div>
                    <div class="h2">{data.power}</div>
                    <div class="text-small color-fg-subtle">
                        {data.time}
                    </div>
                </div>
            </div>
            <button type="button" class="btn">削除</button>
        </div>
    {/each}
    </div>
    <div class="d-flex flex-justify-center mt-2">
        <button class="btn btn-secondary mr-2" on:click={close}>
            キャンセル
        </button>
        <button class="btn btn-primary">
            記録する
        </button>
    </div>
{/await}