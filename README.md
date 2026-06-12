# usagii

予定だけを、まっすぐ並べる。Windows 常駐の予定リストアプリ。

このリポジトリは usagii の**配布専用**です。ソースコードは公開していません。

- 公式ページ / ダウンロード: https://usagii.jp/
- 最新版インストーラ: https://github.com/koutakagatsume/usagii/releases/latest/download/usagii-setup.exe
- 不具合報告・要望: [Issues](https://github.com/koutakagatsume/usagii/issues)

## 動作要件

- Windows 10 / 11(64bit)
- インストール・実行に管理者権限は不要(per-user インストール)
- WebView2 ランタイム(通常は OS に同梱。未導入の場合のみインストール時に自動導入)
- ディスク使用量: 約 20MB(インストーラは約 5MB)

## インストール時の表示について

署名なしの個人開発アプリのため、初回実行時に SmartScreen の確認(「Windows によって PC が保護されました」)が表示されることがあります。「詳細情報」→「実行」で起動できます。

## 更新について

新しいバージョンは [Releases](https://github.com/koutakagatsume/usagii/releases) に公開します。新しいインストーラをダウンロードして実行するだけで上書き更新され、予定データ・設定はそのまま引き継がれます(アプリが自動で更新を確認・適用することはありません)。

過去のバージョンも [Releases](https://github.com/koutakagatsume/usagii/releases) からバージョン番号付きのインストーラとして入手できます。以前のバージョンに戻したい場合は、該当バージョンの setup.exe を実行してください。

## プライバシー

予定・カテゴリ・設定はすべて PC 内にのみ保存され、外部へ送信されません。アプリは外部のサーバと一切通信せず、完全にオフラインで動作します。
詳細: https://usagii.jp/privacy.html

## 免責

usagii は無償・無保証で提供されます。利用により生じたいかなる損害についても、開発者は責任を負いません。

© 2026 usagii project
