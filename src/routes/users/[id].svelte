<script>
    import { onMount } from "svelte";
    import Chart from "chart.js/auto";
    import "chartjs-adapter-moment";
    import { session } from "$app/stores";

	$: user = $session;
    export let id, twitter_name, twitter_image, powers;

    import { writable } from "svelte/store";
    import Modal, { bind } from "svelte-simple-modal";
    import PowerLoading from "$lib/PowerLoading.svelte";
    const modal = writable(null);
    const showModal = () => modal.set(bind(PowerLoading, { splId: id }));

    onMount(() => {
        if (powers.length === 0) {
            return;
        }
        // imageをsetする
        const datasets = powers.map(e => {
            const image = new Image();
            image.src = e["src"];
            image.width = image.height = 24;
            delete e["src"];
            e["pointStyle"] = image;
            return e;
        });
        const ctx = document.getElementById("powerChart").getContext("2d");
        new Chart(ctx, {
            type: "line",
            data: {
                datasets: datasets
            },
            options: {
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: "戦闘力"
                        },
                        ticks: {
                            callback: function(label, index, labels) {
                                return Intl.NumberFormat("ja-JP", {
                                    notation: "compact",
                                    useGrouping: false,
                                    minimumFractionDigits: 1
                                }).format(label);
                            }
                        }
                    },
                    x: {
                        type: "time",
                        time: {
                            parser: "YYYY-MM-DDTHH:mm:ssZ",
                            unit: "day",
                            displayFormats: {
                                day: "MM/DD"
                            },
                            tooltipFormat: "YYYY/MM/DD"
                        },
                        
                    }
                }
            }
        });
    });
</script>

<svelte:head>
	<title>{twitter_name}の戦闘力グラフ</title>
</svelte:head>

<Modal
    show={$modal}
    classContent="Box"
    closeButton={false}
>
<div class="d-flex flex-wrap-reverse col-md-8 col-12 mx-auto my-4">
    <div class="col-md-4 col-12">
        <div class="Box m-2">
            <div class="Box-header h3">
                {twitter_name}
            </div>
            <div class="Box-row d-flex">
                <img class="col-4 avatar avatar-8 mx-auto" src={twitter_image} alt="{twitter_name}" />
                <div class="col-8">SPL-ID: {id}</div>
            </div>
            {#if id == user.splId}
            <div class="Box-row d-flex flex-wrap flex-justify-center">
                <button class="btn btn-large m-1" on:click={showModal}>戦闘力を記録</button>
                <button class="btn btn-large m-1 d-inline-flex flex-items-center">
                    <img class="mr-1" src="/twitter_logo.svg" width="16" height="16" alt="シェア"/> シェア
                </button>
            </div>
            {/if}
        </div>
    </div>
    <div class="col-md-8 col-12">
        <div class="Box m-2">
            <div class="Box-header h3">
                戦闘力グラフ
            </div>
            {#if powers.length === 0}
                <div class="blankslate">
                    <h3 class="blankslate-heading">記録された戦闘力がありません</h3>
                    {#if id == user.splId}
                    <p>「戦闘力を記録」ボタンで記録を始めましょう１</p>
                    {/if}
                </div>
            {:else}
                <canvas id="powerChart" class="m-2"/>
            {/if}
        </div>
    </div>
</div>
</Modal>