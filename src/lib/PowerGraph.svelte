<script>
    import { onMount } from "svelte";
    import Chart from "chart.js/auto";
    import "chartjs-adapter-moment";
    import { getRankData, getRanks } from "./kumamateRank";

    export let id, loginUser, powers, borderFrom, borderTo;

    /**
     * 戦闘力に対して描画範囲内のスマメイトの段を返す
     * @params borders ボーダーのリスト [{id, border, createdAt}]
     * @params powers 戦闘力のリスト [power, ...]
    */
    function getNearRanks(borders, powers) {
        if (borders.length == 0 || powers.length == 0) {
            return [];
        }
        // 描画範囲を取得（戦闘力の最大と最小）
        const powerMax = Math.max(...powers) + 10000;
        const powerMin = Math.min(...powers) - 10000;
        // 各borderの平均値が範囲内であれば描画する
        const ranks = getRanks().reverse();
        let beforeRank, afterRank;
        let drawRanks = [];
        for (const rank of ranks) {
            const borderSum = borders.map(b => b.border).reduce((a, b) => a + b);
            const borderAvg = (borderSum * rank) / borders.length;
            if (borderAvg >= powerMin && borderAvg <= powerMax) {
                drawRanks.push(rank);
                continue;
            } else if (drawRanks.length > 0) {
                // drawRanksに要素がある状態で描画範囲外になったら終わる
                afterRank = rank;
                break;
            }
            beforeRank = rank;
        }
        if (drawRanks.length == 1) {
            drawRanks.unshift(beforeRank);
            drawRanks.push(afterRank);
        } else if (drawRanks.length == 2) {
            drawRanks.unshift(beforeRank);
        }
        return drawRanks;
    }

    function addAlpha(color, opacity) {
        // coerce values so ti is between 0 and 1.
        const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
        return color + _opacity.toString(16).toUpperCase();
    }

    onMount(async () => {
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
        // ボーダーを取得する
        if (borderFrom && borderTo) {
            const response = await fetch(`/borders?from=${borderFrom}&to=${borderTo}`);
            const borders = await response.json(); // [{id, border, createdAt}]
            const powers = datasets[0].data.map(e => e.y);
            getNearRanks(borders, powers).map(c => {
                const dataset = {};
                const rankData = getRankData(c)
                dataset["label"] = rankData.rank + "段: " + rankData.label;
                dataset["borderColor"] = rankData.color;
                dataset["backgroundColor"] = addAlpha(rankData.color, 0.1);
                dataset["borderDash"] = [5, 10];
                dataset["borderWidth"] = 2;
                dataset["fill"] = "+1"
                dataset["data"] = borders.map(b => {
                    return {
                        x: b.createdAt,
                        y: b.border * c
                    };
                });
                datasets.push(dataset);
            });
            
        }
        const ctx = document.getElementById("powerChart").getContext("2d");
        new Chart(ctx, {
            type: "line",
            data: {
                datasets: datasets
            },
            options: {
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            boxWidth: 30,
                            filter: (d) => {return (borderFrom && borderTo && d.datasetIndex == 0) ? false : true}
                        }
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
                                    maximumFractionDigits: 0
                                }).format(label);
                            },
                            stepSize: 10000
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
                        ticks: {
                            maxRotation: 0,
                            maxTicksLimit: 8
                        }
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
<div class="m-2" id="chartContainer">
    <canvas id="powerChart"/>
</div>
{/if}