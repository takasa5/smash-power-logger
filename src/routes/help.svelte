<svelte:head>
	<title>ヘルプ | Smash Power Logger</title>
</svelte:head>

<div class="p-responsive my-4 d-flex flex-justify-center">
    <div class="col-md-10 col-12">
        <h1>ヘルプ</h1>
        <ul class="list-style-none pl-2">
            <li><a href="#how-to-use-smash-power-logger">SmashPowerLoggerのつかいかた</a></li>
            <li><a href="#how-to-register-power">戦闘力の記録方法</a></li>
            <li><a href="#troubleshooting">戦闘力が記録できないときは</a></li>
            <li><a href="#rule">利用規約</a></li>
            <li><a href="#privacy">プライバシーポリシー</a></li>
        </ul>
        <hr>
        <h2 id="how-to-use-smash-power-logger" class="my-2">SmashPowerLoggerのつかいかた</h2>
        <div class="p-responsive">
            SmashPowerLogger は、大乱闘スマッシュブラザーズSPECIALの世界戦闘力を記録するためのWebアプリです。<br>
            SmashPowerLogger を使って戦闘力を記録すると、戦闘力の変化が折れ線グラフによって可視化されるため、<b>実力の変化により敏感に</b>なれます。<br>
            また、<a href="https://kumamate.net/" target="_blank" rel="noopener noreferrer">クマメイト</a>様のご協力により、VIPボーダーラインおよび<a href="https://kumamate.net/vip/" target="_blank" rel="noopener noreferrer">世界戦闘力の段位</a>が日次で集計され、可視化されます。<br>
            各段位のボーダーラインと自分の戦闘力を比較することによって、<b>世界のプレイヤーに対する自分の実力の変化</b>を知ることもできます。ご活用ください。<br>
            ver 0.0.1 時点では、ユーザーページ機能（戦闘力の記録・共有）のみを提供しています。
        </div>
        <h2 id="how-to-register-power" class="mt-4 mb-2">戦闘力の記録方法</h2>
        <div class="p-responsive">
            SmashPowerLoggerでは、スクリーンショットを用いて戦闘力を記録します。<br>
            まず、大乱闘スマッシュブラザーズSPECIALの「オンライン > だれかと」モードでファイター選択画面を開きます。<br>
            戦闘力を記録したいファイターにカーソルを合わせ、Switch本体の機能でスクリーンショットを撮ります。<br>
            <div class="col-md-6 col-10">
                <img class="col-12" src="/mario_power.jpeg" alt="マリオの戦闘力スクリーンショット"/>
            </div>
            スクリーンショットを用意できたら、<a href="https://support.nintendo.co.jp/app/answers/detail/a_id/37589" target="_blank" rel="noopener noreferrer">Switch本体の画像一覧からTwitterへ共有</a>します。<br>
            ツイートがされていることを確認できたら、SmashPowerLoggerのご自身のユーザーページで「戦闘力を記録」ボタンを押します（ツイート完了から読み込めるようになるまで5秒程度かかります）。<br>
            <div class="col-md-4 col-8">
                <img class="col-12" src="/screenshot_register.png" alt="「戦闘力を記録」ボタン"/>
            </div>
            「戦闘力を記録」ボタンを押すと、SmashPowerLoggerはあなたのツイートを読み込み、自動でファイター・戦闘力・日付を認識します。<br>
            意図しないデータがある場合は「記録しない」ボタンを押して除去してください。<br>
            認識結果に満足された場合は「記録する」ボタンを押すことで戦闘力が記録されます。<br>
            <div class="col-md-6 col-10">
                <img class="col-12" src="/screenshot_recognize.png" alt="読み込み結果"/>
            </div>
        </div>
        <h2 id="troubleshooting" class="mt-4 mb-2">戦闘力が記録できないときは</h2>
        <div class="p-responsive">
            以下のいずれかの原因が考えられます。
            <h3>1. スクリーンショット</h3>
            左下にファイター名が、右下に世界戦闘力が写っていることをご確認ください。<br>
            特に、カーソルがいずれかの上にあると認識に失敗してしまうためご注意ください（下図の青枠で囲まれた範囲にカーソルがあると失敗することがあります）。<br>
            <div class="col-md-6 col-10">
                <img class="col-12" src="/recognize_zone.png" alt="認識範囲"/>
            </div>
            また、クッパJr.やMiiファイターなど一部のキャラは、ファイターの色を変えたりMiiを選択したりしていない状態のデフォルトの名前以外は認識できませんので、ご了承ください。<br>
            <h3>2. ツイート</h3>
            ver 0.0.1 時点では、SmashPowerLoggerは最大で最新20件より過去のツイートは読み込めません。<br>
            また、一度の記録で読み込めるスクリーンショットの枚数は4枚までです。<br>
            Twitterにスクリーンショットを共有する際のデフォルトのハッシュタグ（#SmashBrosSP #NintendoSwitch）は、認識のために必要なので消さずに投稿してください。<br>
            <h3>3. SmashPowerLogger</h3>
            上記のどれにも当てはまらないのに記録ができない場合は、システムのエラーが予想されます。<br>
            SmashPowerLoggerをよりよいものにするため、<a href="https://twitter.com/chixinossb">責任者</a>に状況などを詳しく教えていただけると幸いです。<br>
        </div>
        <h2 id="rule" class="mt-4 my-2">利用規約</h2>
        <div class="p-responsive">
            <ul>
                <li>SmashPowerLogger（以下、本サービス）への登録をもって利用規約に同意するものとします。</li>
                <li>著しく負荷をかける、虚偽の情報を流布するなど、本サービスの損失に繋がる行為を行った場合、アクセス制限及び法的に処分を行う場合があります。</li>
                <li>本サービスは、その継続が困難な場合、全部または一部の提供を停止または中断することができます。</li>
                <li>責任者は、本サービスの提供の停止または中断により、ユーザーまたは第三者が被ったいかなる不利益または損害についても、一切の責任を負わないものとします。</li>
                <li>利用規約は、責任者の都合によりユーザーへの通知なく変更することができます。</li>
            </ul>
        </div>
        <h2 id="privacy" class="mt-4 my-2">プライバシーポリシー</h2>
        <div class="p-responsive">
            <ul>
                <li>本サービスへの登録によって作成されるユーザー情報（Twitterのアイコン、ユーザーネーム）は、インターネット上に公開されます。</li>
                <li>本サービスに記録した戦闘力は、インターネット上に公開されます。</li>
                <li>アカウント登録時に本サービスがTwitterにアクセス可能な権限が表示されますが、本サービスが実際に行うのは次に限ります。
                <ol class="pl-4" style="list-style-type: decimal !important">
                    <li>「戦闘力を記録」ボタン押下時にツイートを読み込む</li>
                    <li>「ツイートする」ボタン押下時にツイートを投稿する</li>
                </ol>
                </li>
                <li>本サービスで記録した戦闘力は、ユーザーの意図しないタイミングで削除される可能性があります。</li>
            </ul>
        </div>
    </div>
</div>