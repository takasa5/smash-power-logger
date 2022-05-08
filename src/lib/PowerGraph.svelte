<script>
    import { onMount } from "svelte";
    import Chart from "chart.js/auto";
    import moment from "moment";
    import "chartjs-adapter-moment";
    import { getRankData, getRanks } from "./kumamateRank";

    export let id, loginUser, powers, control, isDisplayRank, isMultipleFighter, disableLegends;
    let rankString;
    let range = 10;

    /**
     * 現在の段位を算出して返す
     * @params borders ボーダーのリスト [{id, border, createdAt}]
     * @params powers 戦闘力のリスト [{x, y}, ...]
    */
    function getCurrentRank(borders, powers) {
        if (borders.length <= 1) {
            return;
        }
        const currentPower = powers.reduce((a, b) => 
            moment(a.x).isAfter(moment(b.x)) ? a : b
        );
        const newestBorder = borders[borders.length - 1];
        const newBorder = borders[borders.length - 2];
        const deltaX = moment(newestBorder.createdAt).diff(moment(newBorder.createdAt));
        const deltaY = newestBorder.border - newBorder.border;
        let currentBorder;
        let isEstimated = false;
        if (moment(currentPower.x) > moment(newestBorder.createdAt)) {
            // 推定値
            currentBorder = newestBorder.border + (deltaY / deltaX) * (moment(currentPower.x).diff(newestBorder.createdAt));
            isEstimated = true;
        } else {
            currentBorder = newBorder.border + (deltaY / deltaX) * (moment(currentPower.x).diff(newBorder.createdAt));
        }
        const ranks = getRanks().reverse();
        let currentRank = null;
        for (const rank of ranks) {
            currentRank = rank;
            if (rank * currentBorder < currentPower.y) {
                break;
            }
        }
        const rankData = getRankData(currentRank);
        return `現在の段位は <b>${rankData.rank}段：${rankData.label}</b> です${isEstimated ? "<span class='color-fg-subtle'>（推定値）</span>" : ""}`;
    }

    /**
     * 戦闘力に対して最新と最古の日付を取得する
     * @params datasets *ファイターのデータのみを含む*データセット（ボーダーを含んではいけない）
    */
    function getEdgeDate(datas) {
        const fighterDatas = [].concat(...datas.map(e => e.data));

        const from = fighterDatas.reduce((a, b) => 
            moment(a.x).isBefore(moment(b.x)) ? a : b
        );
        const to = fighterDatas.reduce((a, b) => 
            moment(a.x).isAfter(moment(b.x)) ? a : b
        );
        return {
            from: from.x,
            to: to.x
        };
    } 

    /**
     * 戦闘力に対して描画範囲内のクマメイトの段を返す
     * @params borders ボーダーのリスト [{id, border, createdAt}]
     * @params powers 戦闘力のリスト [{x, y}, ...]
    */
    function getNearRanks(borders, powers) {
        if (borders.length == 0 || powers.length == 0) {
            return [];
        }
        // 最大と最小を取得
        const max = powers.reduce((a, b) => a.y > b.y ? a : b);
        const min = powers.reduce((a, b) => a.y < b.y ? a : b);
        // TODO: 1日おきにボーダーが取得できていないと綺麗に出ない
        // 最大の直前のボーダーを取得
        const maxBorder = borders.find(
            e => moment(e.createdAt).isBetween(
                moment(max.x).subtract(1, "days"),
                moment(max.x)
            )
        ) || borders[0];
        // 最小の直後のボーダーを取得
        const minBorder = borders.find(
            e => moment(e.createdAt).isBetween(
                moment(min.x),
                moment(min.x).add(1, "days")
            )
        ) || borders[borders.length - 1];
        const ranks = getRanks().reverse();
        let upperRank;
        const drawRanks = [];
        for (const rank of ranks) {
            if (maxBorder.border * rank > max.y) {
                upperRank = rank;
            } else if (maxBorder.border * rank <= max.y && minBorder.border * rank >= min.y) {
                if (upperRank) {
                    drawRanks.push(upperRank);
                    upperRank = null;
                }
                drawRanks.push(rank);
            } else if (upperRank) {
                // 上のif文に一度も引っ掛からずにきた場合、一回余分に追加する
                drawRanks.push(upperRank);
                upperRank = null;
                drawRanks.push(rank);
                continue;
            } else {
                drawRanks.push(rank);
                break;
            }
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
     * @param datasets *ファイターのデータのみを含む*データセット（ボーダーを含んではいけない）
    */
    async function addBorderData(datasets, from, to) {
        const response = await fetch(`/borders?from=${from}&to=${to}`);
        const borders = await response.json(); // [{id, border, createdAt}]
        // NOTE: 以下で複数ファイター存在時に対応する
        const fighterDatas = [].concat(...datasets.map(e => e.data));
        rankString = getCurrentRank(borders, fighterDatas);
        const rankDatas = getNearRanks(borders, fighterDatas).map(c => {
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
        if (rankDatas.length > 1) {
            rankDatas.forEach(e => {e.data = [e.data[0], e.data[e.data.length - 1]]});
        }
        return datasets.concat(rankDatas);
    }

    function addAlpha(color, opacity) {
        // coerce values so ti is between 0 and 1.
        const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
        return color + _opacity.toString(16).toUpperCase();
    }

    async function updateChart(originDatasets, range, isDisplayBorder) {
        // データをフィルタリング
        let datasets = sliceDatasets(originDatasets, range);
        // スタイル追加
        datasets = addPointStyle(datasets);
        // ボーダー追加
        if (isDisplayBorder) {
            const {from, to} = getEdgeDate(datasets);
            datasets = await addBorderData(datasets, from, to);
        }
        const chart = Chart.getChart("powerChart");
        chart.data.datasets = datasets;
        chart.update();
    }

    onMount(async () => {
        if (powers.length === 0) {
            return;
        }
        let datasets = sliceDatasets(powers, range);
        // pointStyleを設定する
        datasets = addPointStyle(datasets);
        // ボーダーを取得する
        if (isDisplayRank) {
            const {from, to} = getEdgeDate(datasets);
            datasets = await addBorderData(datasets, from, to);
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
                ctx.save();
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, chart.canvas.width, chart.canvas.height);
                ctx.restore();
            }
            }],
            options: {
                plugins: {
                    legend: {
                        display: !disableLegends,
                        position: 'bottom',
                        async onClick(event, item) {
                            const index = item.datasetIndex;
                            const ci = this.chart;
                            if (ci.isDatasetVisible(index)) {
                                ci.hide(index);
                                ci.data.datasets[index].hidden = true;
                                item.hidden = true;
                            } else {
                                ci.show(index);
                                ci.data.datasets[index].hidden = false;
                                item.hidden = false;
                            }
                            if (item.text.includes("段")) {
                                return;
                            }
                            const visibleDatas = this.chart.data.datasets.filter(e =>
                                !e.label.includes("段") 
                                && !e.hidden
                            );
                            if (visibleDatas.length == 0) {
                                return;
                            }
                            let fighterDatas = this.chart.data.datasets.filter(e => !e.label.includes("段"));
                            // 見えているデータの範囲でボーダー取得
                            const {from, to} = getEdgeDate(visibleDatas);
                            const datasets = await addBorderData(visibleDatas, from, to);
                            // 完全なデータとボーダーを結合
                            this.chart.data.datasets = fighterDatas.concat(datasets.filter(e => e.label.includes("段")));
                            this.chart.update();
                        },
                        labels: {
                            usePointStyle: true,
                            boxWidth: 30,
                            filter: (d) => {
                                if (isMultipleFighter) {
                                    if (isDisplayRank) {
                                        return !d.text.includes("段") ? true : false;
                                    }
                                    return true;
                                }
                                return (isDisplayRank && !d.text.includes("段")) ? false : true
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
{#if rankString && !isMultipleFighter}
<div class="p-responsive my-2">
    {@html rankString}
</div>
{/if}
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
            <input disabled={isMultipleFighter} bind:group={range} value={undefined} on:change={async () => await updateChart(powers, range, isDisplayRank)} class="radio-input" id="radio-all" type="radio" name="range">
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