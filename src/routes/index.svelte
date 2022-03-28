<script>
	import PowerGraph from "$lib/PowerGraph.svelte";

	const from = '2022-03-04T18:38:09.000Z';
	const to = '2022-03-06T12:01:01.000Z'
	const datasets = [
		{
			label: "マリオ",
			src: "/fighter_icons/mario.png",
			backgroundColor: "#e92223",
			borderColor: "#e92223",
			data: [
				{ x: from, y: 8198316 },
				{ x: '2022-03-05T10:12:15.000Z', y: 9011423 },
				{ x: '2022-03-05T20:01:01.000Z', y: 10039521 },
				{ x: to, y: 10290001 }
			]
		},
		{
			label: "ソニック",
			src: "/fighter_icons/sonic.png",
			backgroundColor: "#5067eb",
			borderColor: "#5067eb",
			data: [
				{ x: from, y: 8210112 },
				{ x: '2022-03-04T23:54:11.000Z', y: 8886267 },
				{ x: '2022-03-05T12:31:46.000Z', y: 8342219 },
				{ x: '2022-03-05T23:53:51.000Z', y: 9011123 },
				{ x: to, y: 10010239 }
			]
		}
	];

	import { browser } from "$app/env";
    let url = browser ? window.location.href : "";
    let origin = browser ? window.location.origin : "";
</script>


<svelte:head>
	<meta property="og:url" content={url} />
	<meta property="og:type" content="website" />
	<meta property="og:image" content={origin + "/ogp.png"} />
	<meta property="og:title" content="スマブラ戦闘力記録サービス SmashPowerLogger" />
	<meta name="twitter:card" content="summary" />

	<title>スマブラ戦闘力記録サービス SmashPowerLogger</title>
</svelte:head>

<div class="p-responsive d-flex flex-justify-center flex-items-center flex-lg-row flex-column">
	<div class="col-lg-6 col-12 mt-12 mb-6">
		<h1 class="col-12 mx-auto d-flex flex-justify-center">
			数値だけでは、<br class="d-md-none">測れない努力がある
		</h1>
		<div class="f4 col-lg-8 col-12 mx-auto d-flex flex-justify-center color-fg-subtle">
			SmashPowerLoggerは、大乱闘スマッシュブラザーズSPECIALの戦闘力を手軽に記録できるWebアプリです
		</div>
		<div class="my-6 d-flex flex-justify-center flex-column">
			<a href="/login" class="mx-auto btn btn-large color-bg-accent-emphasis color-fg-on-emphasis">
				新規登録する
			</a>
			<div class="color-fg-subtle d-flex flex-justify-center">
				<div class="col-12 text-center">
					※登録にはTwitterアカウントが必要です<br class="d-md-none">（<a href="/help#rule">利用規約</a>）
				</div>
			</div>
		</div>
	</div>
	<div class="col-lg-6 col-12">
		<PowerGraph
			id={"dummyId"}
			powers={datasets}
			loginUser={{splId: "dummy"}}
			borderFrom={from}
			borderTo={to}
			control={false}
		/>
	</div>
</div>
<div class="p-responsive d-flex flex-justify-center flex-wrap my-6">
	<div class="mt-6 col-12 d-flex flex-justify-center">
		<h2>戦闘力の記録はわずか3ステップ</h2>
	</div>
	<div class="mb-3 col-12 d-flex flex-justify-center">
		<a href="/help">詳しく見る</a>
	</div>
	<div class="col-12 d-flex flex-justify-center flex-md-row flex-column flex-wrap">
		<div class="col-lg-3 col-md-4 col-12 p-4">
			<div class="Box color-shadow-large">
				<div class="Box-header">
					<h3>Step 1</h3>
				</div>
				<div class="Box-row d-flex flex-justify-center flex-column">
					<img src="/Gaming-bro.svg" alt="スクリーンショットを撮る" />
				</div>
				<div class="Box-row">
					戦闘力のスクリーンショットを撮る
				</div>
			</div>
		</div>
		<div class="col-lg-3 col-md-4 col-12 p-4">
			<div class="Box color-shadow-large">
				<div class="Box-header">
					<h3>Step 2</h3>
				</div>
				<div class="Box-row d-flex flex-justify-center flex-column">
					<img src="/Message-bro.svg" alt="Twitterにアップローする" />
				</div>
				<div class="Box-row">
					Twitterにアップロードする
				</div>
			</div>
		</div>
		<div class="col-lg-3 col-md-4 col-12 p-4">
			<div class="Box color-shadow-large">
				<div class="Box-header">
					<h3>Step 3</h3>
				</div>
				<div class="Box-row d-flex flex-justify-center flex-column">
					<img src="/Stats-bro.svg" alt="SmashPowerLoggerで記録する" />
				</div>
				<div class="Box-row">
					SmashPowerLoggerで記録する
				</div>
			</div>
		</div>
	</div>
	<div class="my-6 d-flex flex-justify-center flex-column">
		<a href="/login" class="mx-auto btn btn-large color-bg-accent-emphasis color-fg-on-emphasis">
			新規登録する
		</a>
		<div class="color-fg-subtle d-flex flex-justify-center">
			<div class="col-12 text-center">
				※登録にはTwitterアカウントが必要です<br class="d-md-none">（<a href="/help#rule">利用規約</a>）
			</div>
		</div>
	</div>
</div>