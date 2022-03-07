<script>
	import PowerGraph from "$lib/PowerGraph.svelte";

	const from = '2022-03-04T18:38:09.000Z';
	const to = '2022-03-05T23:01:01.000Z'
	const datasets = [
		{
			label: "マリオ",
			src: "/fighter_icons/mario.png",
			backgroundColor: "#e92223",
			borderColor: "#e92223",
			data: [
				{ x: from, y: 11128316 },
				{ x: '2022-03-05T10:12:15.000Z', y: 11145623 },
				{ x: to, y: 11179521 }
			]
		}
	];
</script>


<svelte:head>
	<title>Smash Power Logger</title>
</svelte:head>

<div class="p-responsive d-flex flex-justify-center flex-items-center flex-lg-row flex-column">
	<div class="col-lg-6 col-12 my-12">
		<h1 class="col-12 mx-auto d-flex flex-justify-center">
			数値だけでは、測れない努力がある
		</h1>
		<div class="f4 col-lg-8 col-12 mx-auto d-flex flex-justify-center color-fg-subtle">
			SmashPowerLoggerは、大乱闘スマッシュブラザーズSPECIALの戦闘力を手軽に記録できるWebアプリです
		</div>
		<div class="my-6 d-flex flex-justify-center flex-column">
			<a href="/login" class="mx-auto btn btn-large">
				1clickで新規登録する
			</a>
			<div class="color-fg-subtle d-flex flex-justify-center">
				※登録にはTwitterアカウントが必要です
			</div>
		</div>
	</div>
	<div class="col-lg-6 col-12">
		<PowerGraph
			id={"dummyId"}
			powers={datasets}
			loginUser={{splId: "dummy"}}}
			borderFrom={from}
			borderTo={to}
		/>
	</div>
</div>