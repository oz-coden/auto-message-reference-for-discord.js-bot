# Auto Message Reference for Discord Bot

Japanese section is [available](#目次) in below this section.

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

## Requirements, Dependencies

1. Discord Server
2. Node.js V18 or newer  
3. Discord Bot Token  
You can obtain token from Discord Developer Portal.

## Installation

You'll need a Node.js environment.  
Once you've set that up, use the files in the repository and download the necessary packages according to the package instructions.  

## Setting

To execute, you need to write your Discord token information in the .env file.

## LICENSE

This project is released under the MIT License.  

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

## 前提・依存

1. Discord サーバー
2. Node.js V18 以降  
3. Discord ボットトークン  
トークンは Discord Developer Portal から取得できます。

## 導入方法

Node.js 環境が必要です。  
環境設定が完了したら、リポジトリ内のファイルを使用し、パッケージの指示に従って必要なパッケージをダウンロードしてください。 

## 設定

実行するには、.env ファイルに Discord のトークン情報を記述する必要があります。

## ライセンス

This project is released under the MIT License.  
