<script>
    import { onMount } from "svelte";
    import Chart from "chart.js/auto";
    import "chartjs-adapter-moment";
    import { session } from "$app/stores";
	$: user = $session;
    export let id, twitter_name, twitter_image;

    onMount(() => {
        const image = new Image();
        image.src = "/fighter_icons/captain.png";
        image.width = image.height = 24;
        const ctx = document.getElementById("powerChart").getContext("2d");
        new Chart(ctx, {
            type: "line",
            data: {
                datasets: [
                {
                    label: "キャプテン・ファルコン",
                    backgroundColor: "rgb(255, 99, 132)",
                    borderColor: "rgb(255, 99, 132)",
                    data: [
                        {
                            x: "2022-02-21T07:00:00Z",
                            y: 10801212
                        },
                        {
                            x: "2022-02-20T07:00:00Z",
                            y: 10770000
                        }, {
                            x: "2022-02-01T07:00:00Z",
                            y: 10500000
                        }
                    ]
                }
                ]
            },
            options: {
                elements: {
                    point: {
                        pointStyle: image
                    }
                },
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
<div class="d-flex flex-wrap-reverse col-md-8 col-12 mx-auto my-4">
    <div class="col-md-4 col-12">
        <div class="Box m-2">
            <div class="Box-header h3">
                {twitter_name}
            </div>
            <div class="Box-row d-flex">
                <img class="col-4 avatar avatar-8 mx-auto" src={twitter_image} alt="" />
                <div class="col-8">SPL-ID: {id}</div>
            </div>
            {#if id == user.splId}
            <div class="Box-row d-flex flex-wrap flex-justify-center">
                <button class="btn btn-large m-1">戦闘力を記録</button>
                <button class="btn btn-large m-1 d-inline-flex flex-items-center">
                    <img class="mr-1" src="/twitter_logo.svg" width="16" height="16" alt="共有"/> シェア
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
            <canvas id="powerChart" class="m-2"/>
        </div>
    </div>
</div>