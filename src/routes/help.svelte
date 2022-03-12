<svelte:head>
	<title>ヘルプ | Smash Power Logger</title>
</svelte:head>

<div class="p-responsive my-4 d-flex flex-justify-center">
    <div class="col-md-10 col-12">
        <h1>ヘルプ</h1>
        <ul class="list-style-none">
            <li><a href="#how-to-use-smash-power-logger">SmashPowerLoggerのつかいかた</a></li>
            <li><a href="#how-to-register-power">戦闘力の記録方法</a></li>
            <li><a href="#troubleshooting">戦闘力が記録できないときは</a></li>
        </ul>
        <hr>
        <h2 id="how-to-use-smash-power-logger" class="my-2">SmashPowerLoggerのつかいかた</h2>
        <div class="p-responsive">
            SmashPowerLogger は、大乱闘スマッシュブラザーズSPECIALの世界戦闘力を記録するためのWebアプリです。<br>
            SmashPowerLogger を使って戦闘力を記録すると、戦闘力の変化が線グラフによって可視化されるため、<b>実力の変化により敏感に</b>なれます。<br>
            また、<a href="https://kumamate.net/">クマメイト</a>様のご協力により、VIPボーダーラインおよび<a href="https://kumamate.net/vip/">世界戦闘力の段位</a>が日次で集計され、可視化されます。<br>
            各段位のボーダーラインと自分の戦闘力を比較することによって、<b>世界のプレイヤーに対する自分の実力の変化</b>を知ることもできます。ご活用ください。<br>
            ver 0.0.1 時点では、ユーザーページ機能（戦闘力の記録・共有）のみを提供しています。<br>
            今後、戦闘力上位ランキング表示機能などを実装予定です。<br>
        </div>
        <h2 id="how-to-register-power" class="mt-4 mb-2">戦闘力の記録方法</h2>
        <div class="p-responsive">
            まず、大乱闘スマッシュブラザーズSPECIALの「オンライン > だれかと」モードでファイター選択画面を開きます。<br>
            戦闘力を記録したいファイターにカーソルを合わせ、Switch本体の機能でスクリーンショットを撮ります。<br>
            <div class="col-md-6 col-10">
                <img class="col-12" src="/mario_power.jpeg" alt="マリオの戦闘力スクリーンショット"/>
            </div>
            スクリーンショットを用意できたら、<a href="https://support.nintendo.co.jp/app/answers/detail/a_id/37589">Switch本体の画像一覧からTwitterへ共有</a>します。<br>
            ツイートがされていることを確認できたら、SmashPowerLoggerのご自身のユーザーページで「戦闘力を記録」ボタンを押します。<br>
            <div class="col-md-4 col-8">
                <img class="col-12" src="/screenshot_register.png" alt="「戦闘力を記録」ボタン"/>
            </div>
            「戦闘力を記録」ボタンを押すと、SmashPowerLoggerはあなたのツイートを読み込み、自動でファイター・戦闘力・日付を認識します。<br>
            意図しないデータがある場合は「記録しない」ボタンを押して除去してください。<br>
            認識結果が正しい場合は「記録する」ボタンを押すことで戦闘力が記録されます。<br>
            <div class="col-md-6 col-10">
                <img class="col-12" src="/screenshot_recognize.png" alt="読み込み結果"/>
            </div>
        </div>
        <h2 id="troubleshooting" class="mt-4 mb-2">戦闘力が記録できないときは</h2>
        <div class="p-responsive">
            以下のいずれかの原因が考えられます。
            <h3>1. スクリーンショット</h3>
            左下にファイター名が、右下に世界戦闘力が写っていることをご確認ください。<br>
            特に、カーソルがいずれかの上にあると認識に失敗してしまうためご注意ください。<br>
            また、クッパJr.やMiiファイターなど一部のキャラは、ファイターの色を変えたりMiiを選択したりしていない状態のデフォルトの名前以外は認識できませんので、ご了承ください。<br>
            <h3>2. ツイート</h3>
            ver 0.0.1 時点では、SmashPowerLoggerは最新のいくつかのツイートのみを読み込むため、過去のツイートは読み込めません。ツイートした直後にSmashPowerLoggerを使うようにするとうまくいきやすいです。<br>
            Twitterにスクリーンショットを共有する際のデフォルトのハッシュタグ（#スマブラSP #SmashBrosSP #NintendoSwitch）は、認識のために必要なので消さずに投稿してください。<br>
            <h3>3. SmashPowerLogger</h3>
            上記のどれにも当てはまらないのに記録ができない場合は、システムのエラーが予想されます。<br>
            SmashPowerLoggerをよりよいものにするため、<a href="https://twitter.com/chixinossb">開発者</a>に状況などを詳しく教えていただけると幸いです。<br>
        </div>
    </div>
</div>