<script>
    import { onMount } from "svelte";
    import Chart from "chart.js/auto";
    import "chartjs-adapter-moment";
    import { getRankData, getRanks } from "./kumamateRank";

    export let id, loginUser, powers, borderFrom, borderTo, control;
    let isDisplayRank = true, range = 10;
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
        const ranks = getRanks().reverse(); // 上から
        let beforeRank, afterRank;
        let drawRanks = [];
        for (const rank of ranks) {
            const borderSum = borders.map(b => b.border).reduce((a, b) => a + b);
            const borderAvg = (borderSum * rank) / borders.length;
            if (borderAvg >= powerMin && borderAvg <= powerMax) {
                drawRanks.push(rank);
                continue;
            } else if (borderAvg < powerMin) {
                // drawRanksに要素がある状態で描画範囲外になったら終わる
                afterRank = rank;
                break;
            }
            beforeRank = rank;
        }
        if (drawRanks.length == 0 || drawRanks.length == 1) {
            drawRanks.unshift(beforeRank);
            drawRanks.push(afterRank);
        } else if (drawRanks.length == 2) {
            drawRanks.unshift(beforeRank);
        }
        return drawRanks;
    }

    function sliceDatasets(datasets, sliceRange) {
        return datasets.map(dataset => {
            const newDataset = { ...dataset };
            newDataset.data = dataset.data.slice(-sliceRange);
            return newDataset;
        });
    }

    /**
     * データセットのElementの点の描画スタイルを追加し、
     * *新しい配列*を返す
    */
    function addPointStyle(datasets) {
        return datasets.map(e => {
            const image = new Image();
            image.src = e["src"];
            if (window.innerWidth > 1024) {
                image.width = image.height = 20;
            } else {
                image.width = image.height = 16;
            }

            // データ数が10より多い場合は画像を中抜き
            if (e.data.length > 10) {
                e["pointStyle"] = e.data.map((_, i) => {
                    if ((i + 1) % 10 == 0) {
                        return image;
                    }
                    return "circle";
                });
                return e;
            }
            
            e["pointStyle"] = image;
            return e;
        });
    }

    /**
     * データセットにボーダーのデータを追加する。
     * *新しい配列*を返す
    */
    async function addBorderData(datasets, from, to) {
        const response = await fetch(`/borders?from=${from}&to=${to}`);
        const borders = await response.json(); // [{id, border, createdAt}]
        // TODO: 複数ファイターがいるときのボーダー取得方法
        const powers = datasets[0].data.map(e => e.y);
        const rankDatas = getNearRanks(borders, powers).map(c => {
            const dataset = {};
            const rankData = getRankData(c)
            dataset["label"] = rankData.rank + "段";
            dataset["pointRadius"] = 2;
            dataset["hoverRadius"] = 3;
            dataset["labelOption"] = rankData.label;
            dataset["borderColor"] = rankData.color;
            dataset["backgroundColor"] = addAlpha(rankData.color, 0.1);
            dataset["borderDash"] = [5, 10];
            dataset["borderWidth"] = 2;
            dataset["fill"] = "+1"
            dataset["data"] = borders.map(b => {
                return {
                    x: b.createdAt,
                    y: parseInt(b.border * c)
                };
            });
            return dataset;
        });
        return datasets.concat(rankDatas);
    }

    function addAlpha(color, opacity) {
        // coerce values so ti is between 0 and 1.
        const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
        return color + _opacity.toString(16).toUpperCase();
    }

    async function updateChart(originDatasets, range, border) {
        // データをフィルタリング
        let datasets = sliceDatasets(originDatasets, range);
        // スタイル追加
        datasets = addPointStyle(datasets);
        // ボーダー追加
        if (border) {
            datasets = await addBorderData(datasets, borderFrom, borderTo);
        }
        const chart = Chart.getChart("powerChart");
        chart.data.datasets = datasets;
        chart.update();
    }

    onMount(async () => {
        if (powers.length === 0) {
            return;
        }
        let datasets = sliceDatasets(powers, 10);
        // pointStyleを設定する
        datasets = addPointStyle(powers);
        // ボーダーを取得する
        if (borderFrom && borderTo) {
            datasets = await addBorderData(datasets, borderFrom, borderTo);
        }
        const ctx = document.getElementById("powerChart").getContext("2d");
        new Chart(ctx, {
            type: "line",
            data: {
                datasets: datasets
            },
            plugins: [{
                id: "custom_canvas_background_color",
                beforeDraw: (chart) => {
                const ctx = chart.canvas.getContext('2d');
                const chartArea = chart.chartArea;
                ctx.save();
                ctx.backgroundColor = "white";
                ctx.restore();
            }
            }],
            options: {
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            boxWidth: 30,
                            filter: (d) => {
                                return (borderFrom && borderTo && !d.text.includes("段")) ? false : true
                            },
                            generateLabels: function(chart) {
                                var data = chart.data;
                                return data.datasets.map(function(dataset, i) {
                                    let label = dataset.label;
                                    if (window.innerWidth > 1024 && dataset.labelOption) {
                                        label = label + ": " + dataset.labelOption;
                                    }
                                    return {
                                        text:           label,
                                        fillStyle:      dataset.backgroundColor,
                                        hidden:         !chart.isDatasetVisible(i),
                                        lineCap:        dataset.borderCapStyle,
                                        // lineDash:       dataset.borderDash,
                                        // lineDashOffset: dataset.borderDashOffset,
                                        lineJoin:       dataset.borderJoinStyle,
                                        // This parameter, "borderWidth" is not good.
                                        lineWidth:      dataset.borderWidth, 
                                        strokeStyle:    dataset.borderColor,
                                        pointStyle:     dataset.pointStyle,
                                        // Below is extra data used for toggling the datasets
                                        datasetIndex: i
                                    };
                                }, this);
                            }
                        }
                    },
                    tooltip: {
                        usePointStyle: true,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (context.dataset.labelOption) {
                                    label = label + ": " + context.dataset.labelOption;
                                }
                                return [label, context.parsed.y]
                            }
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
{#if control}
<div class="p-responsive my-4">
    <div>
        <label for="range">表示範囲</label>
        <div class="radio-group" name="range">
            <input bind:group={range} value={10} on:change={async () => await updateChart(powers, range, isDisplayRank)} class="radio-input" id="radio-recent" type="radio" name="range" checked="checked">
            <label class="radio-label" for="radio-recent">最新10件</label>
            <input bind:group={range} value={undefined} on:change={async () => await updateChart(powers, range, isDisplayRank)} class="radio-input" id="radio-all" type="radio" name="range">
            <label class="radio-label" for="radio-all">すべて</label>
        </div>
    </div>
    <div class="mt-2">
        <label for="rank">段位表示</label>
        <div class="radio-group" name="rank">
            <input bind:group={isDisplayRank} value={true} on:change={async () => await updateChart(powers, range, isDisplayRank)} class="radio-input" id="radio-rank" type="radio" name="rank" checked="checked">
            <label class="radio-label" for="radio-rank">あり</label>
            <input bind:group={isDisplayRank} value={false} on:change={async () => await updateChart(powers, range, isDisplayRank)} class="radio-input" id="radio-norank" type="radio" name="rank">
            <label class="radio-label" for="radio-norank">なし</label>
        </div>
        <div class="f6 color-fg-subtle">最新の段位を確認するには<a href="https://kumamate.net/vip/" target="_blank" rel="noopener noreferrer">こちら</a>(外部サイト)</div>
    </div>
</div>
{/if}
{/if}