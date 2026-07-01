# Auto Message Reference for Discord Bot

Discordでメッセージリンクが送信されたときに、その内容を自動的に引用するためのNode.jsで動作するDiscord Botです。

## 機能

URLが送信されたときに、それを検知して自動的にメッセージを参照します。  
参照する際には、次の場合は内容の展開を行いません。  
- 異なるサーバーの内容を引用している場合
- @everyoneが見れない異なるチャンネルの内容を引用しているとき
また、テキストだけでなく、画像も自動で引用します。

## 環境

以下の環境が必要です。

- **Node.js**: v18以上
- **Discord Bot Token**: Discord Developer Portal から取得したトークン

## 導入方法

Node.jsの環境が必要です。
それを用意した後は、リポジトリにあるファイルを使用し、packageの情報に従って必要なパッケージをダウンロードします。
.envにDiscordのTOKEN情報を記載します。
