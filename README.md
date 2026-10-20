# Auto Message Reference for Discord Bot

The Japanese section is [available below](#目次).

## Table of Contents

1. [Summary](#summary)
2. [Background of Development](#background-of-development)
3. [Features](#features)
4. [Usage](#usage)
5. [Requirements, Dependencies](#requirements-dependencies)
6. [Installation](#installation)
7. [Setting](#setting)
8. [LICENSE](#license)

## Summary

This script is a Discord bot written in Node.js that automatically quotes the content of message links when they are sent on Discord.

## Background of Development

When a message link is sent, you actually have to jump to view the full text or image, and there are times when that feels like a hassle.  
That is reason why I made it.

## Features

- Auto Detect URL and Auto Quote Message  
When a URL is sent, the system detects it and automatically displays the message including images.  
When displaying the message, the content will not be expanded in the following cases:
  - When the message is sent from a different server
  - When the message is sent from a different channel that is not visible to @everyone  

## Usage

- Sending Discord Message URL in server which is already installed this bot, then it'll be quoted.
- Use `/ping` to check the Gateway latency.

## Requirements, Dependencies

1. Discord Server
2. [Node.js](https://nodejs.org/en/download) 24.17.0 or newer with npm (Node.js 24 LTS recommended)
3. Discord Bot Token

You can obtain a token from the [Discord Developer Portal](https://discord.com/developers/applications).

Windows, macOS, and Linux are supported. The bot uses `discord.js`; dependency versions are recorded in `package-lock.json`. An outbound HTTPS/WebSocket connection to Discord is required.

## Installation

1. Install Node.js and confirm that `node --version` is at least 24.17.0 and `npm --version` works.
2. Download this repository and install its dependencies:

   ```sh
   git clone https://github.com/oz-coden/auto-message-reference-for-discord.js-bot.git
   cd auto-message-reference-for-discord.js-bot
   npm ci
   ```

   You can also download and extract the repository as a ZIP, then run `npm ci` in the folder containing `package.json`.
3. Configure the Discord application and `.env` file as described in [Setting](#setting).
4. Check the configuration and start the bot:

   ```sh
   npm run check
   npm start
   ```

   `check` checks local configuration and module loading without connecting to Discord; it does not verify the token's validity. After `Ready!` appears, try `/ping` in your server. Stop with Ctrl+C.

For hosting, set the environment variables in the service's settings, install with `npm ci --omit=dev`, and start with `npm start`. A continuously running process is required to maintain the Discord connection.

### Docker (optional)

After creating `.env`, run these commands in the repository directory:

```sh
docker build -t reference-bot .
docker run -d --name reference-bot --restart unless-stopped --env-file .env reference-bot
docker logs -f reference-bot
```

The container runs as a non-root user. No port mapping is needed for normal operation. If HTTP is enabled with `PORT=3000`, add `-p 127.0.0.1:3000:3000` to `docker run`. Stop with `docker stop reference-bot` and remove with `docker rm reference-bot`.

Offline development checks are available with `npm test`.

## Setting

### Discord application

1. Create an application in the [Discord Developer Portal](https://discord.com/developers/applications), open its **Bot** page, and generate a bot token.
2. Enable **Message Content Intent** on the Bot page. Server Members Intent and Presence Intent are not required.
3. In **OAuth2 → URL Generator**, select the **bot** and **applications.commands** scopes and these bot permissions: **View Channels, Send Messages, Embed Links, Attach Files, and Read Message History**.
4. Open the generated URL to install the bot in your server. Check channel-specific permissions as well. To send messages in threads, also allow **Send Messages in Threads**.

### Environment variables

Copy `.env.example` to `.env` in the repository directory:

- Linux / macOS: `cp .env.example .env`
- Windows PowerShell: `Copy-Item .env.example .env`

Edit `.env` and set the token:

```dotenv
DISCORD_TOKEN=your_bot_token
```

| Variable | Required / default | Description |
| --- | --- | --- |
| `DISCORD_TOKEN` | Required | Discord bot token |
| `token` | Compatibility fallback | Used if `DISCORD_TOKEN` is empty or unset |
| `PORT` | Empty / unset | Optional HTTP health endpoint port (1–65535) |
| `HOST` | `0.0.0.0` | HTTP bind address; use `127.0.0.1` for local-only access |

Keep `.env` and the token private. The file is loaded from the directory containing `main.js`, regardless of the working directory. Host environment variables take precedence over `.env`.

Leave `PORT` empty unless your hosting service requires HTTP. If enabled, `GET /` and `GET /health` return 200 when Discord is ready and slash commands are registered, or 503 while unavailable. This endpoint does not prevent a hosting service from putting the process to sleep.

If startup fails, check the token, network access, and Discord settings. `EADDRINUSE` means the configured `PORT` is already in use. Global slash commands may take time to appear after startup.

## LICENSE

This project is released under the [MIT License](LICENSE).

---

# Auto Message Reference for Discord Bot

## 目次

1. [概要](#概要)
2. [開発背景](#開発背景)
3. [機能](#機能)
4. [使い方](#使い方)
5. [前提・依存](#前提依存)
6. [導入方法](#導入方法)
7. [設定](#設定)
8. [ライセンス](#ライセンス)

## 概要

Discordでメッセージリンクが送信されたとき、その内容を自動的に引用するためのNode.jsで動作するDiscord Botです。

## 開発背景

メッセージリンクが送られてくるたびに、全文や画像を見るためには実際にそのページに移動しなければならず、それが面倒に感じられることがあります。  
それを解消するためにこれを作ることにしました。

## 機能

- URLの自動検出とメッセージの自動引用  
URLが送信されると、BOTがそれを検出し、画像を含むメッセージを自動的に表示します。  
メッセージを表示する際、以下の場合はコンテンツが展開されません：
  - メッセージが別のサーバーから送信された場合　　
  - メッセージが、@everyoneには表示されない別のチャンネルから送信された場合　　

## 使い方

- このBOTが導入済みのサーバーでDiscordのメッセージURLを送信すると、そのメッセージが引用されます。
- `/ping` で Gateway の遅延を確認できます。

## 前提・依存

1. Discord サーバー
2. [Node.js](https://nodejs.org/en/download) 24.17.0 以上と npm（Node.js 24 LTS 推奨）
3. Discord ボットトークン

トークンは [Discord Developer Portal](https://discord.com/developers/applications) から取得できます。

Windows／macOS／Linux で動作します。依存パッケージは `discord.js` で、バージョンは `package-lock.json` に記録されています。Discord への HTTPS・WebSocket 接続が必要です。

## 導入方法

1. Node.js をインストールし、`node --version` が 24.17.0 以上であることと、`npm --version` が動作することを確認します。
2. リポジトリを取得し、依存パッケージをインストールします。

   ```sh
   git clone https://github.com/oz-coden/auto-message-reference-for-discord.js-bot.git
   cd auto-message-reference-for-discord.js-bot
   npm ci
   ```

   ZIP でダウンロードした場合も、展開後に `package.json` のあるフォルダーで `npm ci` を実行できます。
3. [設定](#設定)に従って Discord アプリケーションと `.env` ファイルを設定します。
4. 設定を確認し、Bot を起動します。

   ```sh
   npm run check
   npm start
   ```

   `check` は Discord に接続せず、ローカルの設定とモジュールの読み込みを確認します。トークンの有効性は確認しません。`Ready!` が表示されたら、サーバーで `/ping` を実行してください。終了は Ctrl+C です。

ホスティングサービスでは管理画面から環境変数を設定し、インストールコマンドに `npm ci --omit=dev`、起動コマンドに `npm start` を指定できます。Discord への接続を維持するため、プロセスを常時実行できる環境が必要です。

### Docker を使う場合（任意）

`.env` を作成してから、リポジトリのディレクトリで実行します。

```sh
docker build -t reference-bot .
docker run -d --name reference-bot --restart unless-stopped --env-file .env reference-bot
docker logs -f reference-bot
```

コンテナーは非 root ユーザーで動作します。通常はポート公開は不要です。`PORT=3000` で HTTP を有効にした場合は、`docker run` に `-p 127.0.0.1:3000:3000` を追加します。停止は `docker stop reference-bot`、削除は `docker rm reference-bot` です。

開発時のオフライン検証には `npm test` を使えます。

## 設定

### Discord アプリケーション

1. [Discord Developer Portal](https://discord.com/developers/applications) でアプリケーションを作成し、**Bot** ページで Bot トークンを生成します。
2. Bot ページで **Message Content Intent** を有効にします。Server Members Intent と Presence Intent は不要です。
3. **OAuth2 → URL Generator** で **bot** と **applications.commands** のスコープを選択し、Bot 権限に **View Channels, Send Messages, Embed Links, Attach Files, and Read Message History** を指定します。
4. 生成された URL を開いてサーバーに導入します。チャンネル個別の権限も確認してください。スレッドに送信する場合は **Send Messages in Threads** も許可します。

### 環境変数

リポジトリのディレクトリで `.env.example` を `.env` にコピーします。

- Linux／macOS: `cp .env.example .env`
- Windows PowerShell: `Copy-Item .env.example .env`

`.env` を編集し、トークンを設定します。

```dotenv
DISCORD_TOKEN=自分のBotトークン
```

| 変数 | 必須・既定値 | 説明 |
| --- | --- | --- |
| `DISCORD_TOKEN` | 必須 | Discord の Bot トークン |
| `token` | 旧設定との互換用 | `DISCORD_TOKEN` が空欄／未設定の場合に使用 |
| `PORT` | 空欄／未設定 | HTTP ヘルスチェック用のポート番号（1〜65535、任意） |
| `HOST` | `0.0.0.0` | HTTP 待受アドレス。ローカル限定の場合は `127.0.0.1` |

`.env` とトークンは公開しないでください。作業ディレクトリにかかわらず、`main.js` と同じ場所にある `.env` を読み込みます。ホスト側の環境変数が `.env` より優先されます。

ホスティングサービスが HTTP を必要としなければ `PORT` は空欄にします。有効にすると `GET /` と `GET /health` が利用でき、Discord 接続とスラッシュコマンド登録が完了していれば 200、利用不可の間は 503 を返します。ホスティングサービスによるスリープを防ぐ機能ではありません。

起動に失敗する場合は、トークン・ネットワーク接続・Discord 側の設定を確認してください。`EADDRINUSE` は指定した `PORT` が使用中であることを示します。グローバルスラッシュコマンドの反映には時間がかかる場合があります。

## ライセンス

This project is released under the [MIT License](LICENSE).
