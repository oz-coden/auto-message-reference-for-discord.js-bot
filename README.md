# Auto Message Reference for Discord Bot

[日本語の説明](#日本語) · [English](#english)

## English

Automatically quotes a Discord message when someone posts its message link.

### Requirements

- **Node.js 24.17.0 or newer** with npm. Node.js 24 LTS is recommended; `.nvmrc` selects major version 24 when using nvm.
- Windows, macOS, or Linux with outbound HTTPS/WebSocket access to Discord and HTTPS access to npm for installation. No inbound port or database is required for normal operation.
- A Discord application with a bot token, and permission to install it in your server.
- Runtime dependency: `discord.js`, pinned by `package-lock.json`. No Replit-specific services are used.

### Discord setup

1. Open the [Discord Developer Portal](https://discord.com/developers/applications), create an application, and open its **Bot** page.
2. Generate/reset the bot token and keep it private. Use the bot token, not the client secret or public key.
3. Enable **Message Content Intent** under Bot → Privileged Gateway Intents. Server Members Intent and Presence Intent are not needed.
4. Open **OAuth2 → URL Generator**, select the **bot** and **applications.commands** scopes, and select these bot permissions: **View Channels, Send Messages, Embed Links, Attach Files, and Read Message History**. Administrator permission is unnecessary.
5. Open the generated URL and install the bot in your server. Channel overrides must also allow the required permissions. For threads, grant Send Messages in Threads where needed.

Use a separate Discord application/token for each bot. On startup, each bot replaces its own application's global slash commands; sharing one application causes the command lists to overwrite each other.

### Install and run

1. Install [Node.js](https://nodejs.org/en/download), then confirm `node --version` is at least 24.17.0 and `npm --version` works.
2. Clone this repository and open its directory:

   ```sh
   git clone https://github.com/oz-coden/auto-message-reference-for-discord.js-bot.git
   cd auto-message-reference-for-discord.js-bot
   npm ci
   ```

   A GitHub ZIP download also works: extract it, open a terminal in the folder containing `package.json`, and run `npm ci`.
3. Copy `.env.example` to `.env` in that same folder. On Linux/macOS run `cp .env.example .env`; on Windows PowerShell run `Copy-Item .env.example .env`. A text editor can also create the file; ensure the name is `.env`, not `.env.txt`.
4. Set `DISCORD_TOKEN=your_bot_token` in `.env`. Leave `PORT` blank unless your hosting service requires an HTTP listener.
5. Run these commands:

   ```sh
   npm run check
   npm start
   ```

   `check` validates the local configuration and loads bot modules **without connecting to Discord**. It does not validate the token with Discord. After `Ready!` appears during normal startup, try `/ping` in your server. Global slash commands may take time to appear. Stop with Ctrl+C.

You can also run `node /absolute/path/to/main.js` from another directory: `.env` is always resolved beside `main.js`. On a hosting service, set the environment variables in its dashboard and use `npm ci --omit=dev` for installation and `npm start` for startup. The process needs to remain running; request-only serverless hosting is unsuitable for this Gateway bot.

### Environment variables

| Variable | Required / default | Meaning |
| --- | --- | --- |
| `DISCORD_TOKEN` | Required | Discord bot token |
| `token` | Legacy fallback | Used when `DISCORD_TOKEN` is empty or unset; retained for existing deployments |
| `PORT` | Unset / empty: HTTP disabled | Optional integer from 1 to 65535 for the HTTP health endpoint |
| `HOST` | `0.0.0.0` | HTTP bind address; use `127.0.0.1` for local-only access |

Host environment variables take precedence over the same variables in `.env`. Keep `.env` private; it is excluded from Git and Docker builds. Never put a token in source code, a Dockerfile, or a committed configuration file.

If `PORT` is configured, `GET /` and `GET /health` return 200 only after Discord is ready and slash commands have registered; they return 503 while unavailable. These endpoints report status and do not prevent a hosting provider from sleeping the process. For two bots on one machine, leave HTTP disabled or choose a different port for each.

### Docker (optional)

With Docker installed, run from this repository's directory after creating `.env`:

```sh
docker build -t reference-bot .
docker run -d --name reference-bot --restart unless-stopped --env-file .env reference-bot
docker logs -f reference-bot
```

The container runs as a non-root user. Its token is supplied at runtime and is not included in the image. No port mapping is needed unless you enabled HTTP; for `PORT=3000`, add `-p 127.0.0.1:3000:3000` to `docker run`. To stop/remove it, run `docker stop reference-bot` and `docker rm reference-bot`.

### Usage

- Send a Discord message URL in a server where the bot is installed.
- Links to another server are ignored. A link to another channel is quoted only when that channel is visible to `@everyone`; a private channel can quote its own messages.
- `/ping` reports the Gateway latency.

### Troubleshooting and development

- Startup exits immediately: check `DISCORD_TOKEN` and `PORT`. Authentication failures or Gateway intent errors also exit with a nonzero code. Runtime errors omit full Discord request objects to avoid logging credentials.
- `EADDRINUSE`: another process already uses the configured port. Change `PORT` or leave it empty.
- Online but no commands: check the application/token, installation scopes, and command permissions; allow time for global command propagation.
- No automatic quotes: enable Message Content Intent in the Portal and check channel permissions, Read Message History, and the cross-channel visibility rule.
- Run `npm test` for offline configuration, startup, and bot behavior checks. CI runs them on Windows/macOS/Linux with Node.js 24 and 26. These tests do not exercise a real Discord connection.
- Update dependencies intentionally and commit `package-lock.json`; use `npm ci` for reproducible installs. SIGINT/SIGTERM close the Discord client and optional HTTP listener.

---

## 日本語

Discordのメッセージリンクが投稿されると、本文と添付ファイルを自動的に引用するBot。

### 前提条件

- **Node.js 24.17.0以上**とnpm。Node.js 24 LTSを推奨。nvmを使う場合は `.nvmrc` で24系を選択できる。
- Windows／macOS／Linux。DiscordへのHTTPS・WebSocket接続と、インストール時のnpmへのHTTPS接続が必要。通常動作に受信ポートやデータベースは不要。
- DiscordアプリケーションのBotトークンと、導入先サーバーにBotを追加する権限。
- 実行時の依存は `discord.js`。`package-lock.json` で固定し、Replit固有のサービスには依存しない。

### Discord側の設定

1. [Discord Developer Portal](https://discord.com/developers/applications) でアプリケーションを作成し、**Bot** ページを開く。
2. Botトークンを生成／再発行して控える。Client SecretやPublic Keyではなく、Botのトークンを使う。
3. Bot → Privileged Gateway Intents で **Message Content Intent** を有効にする。Server Members Intent と Presence Intent は不要。
4. **OAuth2 → URL Generator** で **bot** と **applications.commands** を選択し、Bot権限に **View Channels, Send Messages, Embed Links, Attach Files, and Read Message History** を指定する。Administrator権限は不要。
5. 生成されたURLを開いてサーバーに導入する。チャンネル個別の権限上書きでも必要な権限を許可する。スレッドで送信する場合は Send Messages in Threads も許可する。

**引用BotとSplatoon Botには別々のアプリケーション／トークンを使う。** 起動時に自身のアプリケーションのグローバルスラッシュコマンドを置き換えるため、同じものを共有すると互いのコマンドを上書きしてしまう。

### 導入・起動手順

1. [Node.js](https://nodejs.org/en/download) をインストールし、`node --version` が24.17.0以上であること、`npm --version` が動くことを確認する。
2. リポジトリを取得し、そのディレクトリで依存をインストールする。

   ```sh
   git clone https://github.com/oz-coden/auto-message-reference-for-discord.js-bot.git
   cd auto-message-reference-for-discord.js-bot
   npm ci
   ```

   ZIPでダウンロードした場合も、展開後に `package.json` のあるフォルダーでターミナルを開いて `npm ci` を実行すればよい。
3. 同じフォルダーの `.env.example` を `.env` にコピーする。Linux／macOSでは `cp .env.example .env`、Windows PowerShellでは `Copy-Item .env.example .env` を実行する。エディターで作成してもよいが、`.env.txt` にしないよう注意する。
4. `.env` に `DISCORD_TOKEN=自分のBotトークン` を設定する。ホスティング側でHTTP待受が必要でなければ `PORT` は空欄にしておく。
5. 設定を確認してから起動する。

   ```sh
   npm run check
   npm start
   ```

   `check` はローカルの設定とモジュール読み込みを確認し、**Discordには接続しない**。トークンの有効性は確認しない。通常起動で `Ready!` が表示されたら、サーバーで `/ping` を実行する。グローバルコマンドの反映には時間がかかる場合がある。終了はCtrl+C。

別ディレクトリから `node /絶対パス/main.js` と実行しても、`.env` は常に `main.js` と同じ場所から読み込む。ホスティングでは管理画面の環境変数で設定し、インストールコマンドに `npm ci --omit=dev`、起動コマンドに `npm start` を指定できる。Gateway接続を維持する常駐プロセスが必要なので、リクエスト時だけ実行されるサーバーレス環境には適さない。

### 環境変数

| 変数 | 必須・既定値 | 説明 |
| --- | --- | --- |
| `DISCORD_TOKEN` | 必須 | DiscordのBotトークン |
| `token` | 旧設定の互換用 | `DISCORD_TOKEN` が空欄／未設定の場合に使う |
| `PORT` | 未設定／空欄でHTTP無効 | HTTPヘルスチェックを有効にする場合は1〜65535の整数 |
| `HOST` | `0.0.0.0` | HTTP待受アドレス。ローカル限定にする場合は `127.0.0.1` |

同じ変数が両方にある場合、ホスト側の環境変数が `.env` より優先される。`.env` はGit・Dockerビルドの対象外。トークンをソースコードやDockerfile、コミットする設定ファイルに記載しない。

`PORT` を設定すると `GET /` と `GET /health` が有効になる。Discordの接続とコマンド登録が完了していれば200、利用不可の間は503を返す。稼働状態を示す機能なので、ホスティングサービス側のスリープを防ぐものではない。同じマシンで2つのBotを動かす場合はHTTPを無効にするか、別々のポートを指定する。

### Dockerで起動する場合

Dockerをインストールし、`.env` を用意してからリポジトリのディレクトリで実行する。

```sh
docker build -t reference-bot .
docker run -d --name reference-bot --restart unless-stopped --env-file .env reference-bot
docker logs -f reference-bot
```

コンテナー内では非rootユーザーで実行する。トークンは実行時に渡し、イメージには含めない。HTTPを有効にしていなければポート公開は不要。`PORT=3000` の場合は `docker run` に `-p 127.0.0.1:3000:3000` を追加する。停止は `docker stop reference-bot`、削除は `docker rm reference-bot`。

### 使い方

- Botを導入したサーバーでDiscordのメッセージURLを送信すると引用される。
- 別サーバーのリンクは無視する。別チャンネルのリンクは、そのチャンネルを `@everyone` が閲覧できる場合のみ引用する。非公開チャンネル内では同じチャンネルのメッセージだけ引用できる。
- `/ping` でGatewayの遅延を確認できる。

### トラブル対応・開発

- 起動直後に終了する場合は、`DISCORD_TOKEN` と `PORT` を確認する。認証失敗やGateway Intentのエラーでも異常終了する。認証情報をログに出さないため、Discordリクエスト全体は出力しない。
- `EADDRINUSE` はポートの競合。`PORT` を変更するか空欄にする。
- オンラインなのにコマンドがない場合は、アプリケーション／トークン、導入時のスコープ、コマンドの権限を確認する。グローバルコマンドの反映時間も考慮する。
- 自動引用されない場合は、PortalのMessage Content Intent、チャンネルの権限、Read Message History、別チャンネルを引用する際の公開条件を確認する。
- `npm test` で設定・起動処理・Botの動作をオフライン検証できる。CIはWindows／macOS／LinuxとNode.js 24・26で実行する。実際のDiscord接続はテスト対象外。
- 依存を更新するときは `package-lock.json` もコミットする。普段の導入には `npm ci` を使う。SIGINT／SIGTERMを受け取るとDiscord接続とHTTP待受を終了する。

## License

This project is released under the [MIT License](LICENSE).
