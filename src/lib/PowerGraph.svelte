<script>
    import { onMount } from "svelte";
    import Chart from "chart.js/auto";
    import "chartjs-adapter-moment";

    export let id, loginUser, powers;
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
                                    minimumFractionDigits: 1,
                                    maximumFractionDigits: 1
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
                            tooltipFormat: "YYYY/MM/DD HH:mm"
                        },
                        
                    }
                }
            }
        });
    });
</script>

{#if powers.length === 0}
<div class="blankslate">
    <h3 class="blankslate-heading">記録された戦闘力がありません</h3>
    {#if id == loginUser.splId}
    <p>「戦闘力を記録」ボタンで記録を始めましょう！</p>
    {/if}
</div>
{:else}
<canvas id="powerChart" class="m-2"/>
{/if}