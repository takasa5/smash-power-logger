<script context="module">
    export async function load({ params, fetch, session, stuff }) {
        const id = params.id;
        return {
			props: {
                id
            }
		};
    }
</script>

<script>
    import { onMount } from "svelte";
    import Chart from "chart.js/auto";
    export let id;

    onMount(() => {
        const ctx = document.getElementById("powerChart").getContext("2d");
        new Chart(ctx, {
        type: "line",
        data: {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [
            {
                label: "My First dataset",
                backgroundColor: "rgb(255, 99, 132)",
                borderColor: "rgb(255, 99, 132)",
                data: [0, 10, 5, 2, 20, 30, 45]
            }
            ]
        },
        options: {}
        });
    });
</script>

<svelte:head>
	<title>ユーザーネーム</title>
</svelte:head>

<div class="d-flex flex-wrap-reverse col-md-8 col-12 mx-auto my-4">
    <div class="col-md-4 col-12">
        <div class="Box mr-4">
            <div class="Box-header h3">
                ユーザーネーム
            </div>
            <div class="Box-row d-flex">
                <div class="col-4 d-flex">
                    <img src="" alt="" class="avatar avatar-8 mx-auto"/>
                </div>
                <div class="col-8">SPL-ID: {id}</div>
            </div>
        </div>
    </div>
    <div class="col-md-8 col-12">
        <div class="Box ml-4">
            <div class="Box-header h3">
                ユーザーネーム の戦闘力グラフ
            </div>
            <canvas id="powerChart" class="m-2"/>
        </div>
    </div>
</div>