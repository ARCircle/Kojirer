# Kojirer

- AR会謹製豚そば「こうじろう」の食券管理システム

## API仕様書

- REST API: [OpenAPI](https://arcircle.github.io/Kojirer/openapi)
- Websocket API: [AsyncAPI](https://arcircle.github.io/Kojirer/asyncapi)

## How to Start Develop

### ０. 前提

以下のインストールおよびセットアップをすること．

- VSCode
- Docker
- Git
- Node.js
- pnpm

また，VSCode内に以下の拡張機能のインストールが必要．

- Dev Containers

### 1. リポジトリのクローン

Workingディレクトリにおいて，GitHubからソースファイルをクローンする．

```bash
git clone "git@github.com:ARCircle/Kojirer.git"
```

クローンしたディレクトリに移動し，`.env`ファイルをコピーする．

```bash
cd Kojirer
cp example.env .env
cp example.env.container .env.container
```

### 2. 依存関係のインストール

```bash
pnpm install
```

### 3. 開発サーバーの起動

docker composeを使用して開発用のDB、フロントエンド、バックエンドのサーバーを起動する。

```bash
docker compose up
```

サーバーが起動したら下記コマンドでDBのマイグレーションを実行する。

```bash
pnpm run migrate:dev
```

DBにシードを入れる。

```bash
docker exec -i kojirer-db-local psql -U kojirer -d kojirer < packages/backend/examples/devdata.sql
```

起動するサーバー
| サーバー | URL |
| -------- | --- |
| フロントエンド | http://localhost:52800 |
| バックエンド | http://localhost:52600 |
| Prisma Studio | http://localhost:5555 |
| データベース | http://localhost:5333 |

ホットリロードが有効なのでこのサーバーを起動したままホストマシンでコードを編集して開発を進められる。

## How to Start Production

本番環境も一応用意している。

```bash
docker compose -f docker-compose.prod.yml up
```

本番環境では統合されたバックエンドサーバー (port: 52600) のみが起動する。

## ディレクトリ構成

### packages

Kojirerのコア部分．基本的にここをいじくることになる．

### packages/backend

| Feature                    | Package                                 |
| -------------------------- | --------------------------------------- |
| HTTPサーバフレームワーク   | [Express.js](https://expressjs.com/ja/) |
| ORM/マイグレーションツール | [Prisma.js](https://www.prisma.io/)     |
| データベース               | PostgreSQL                              |

#### Routeの追加

tsファイルを`src/routes`に追加すると，そのファイル名のパスが作られる．

### APIスキーマ編集

バックエンド側の型再生成

```bash
pnpm run api
```

#### DBマイグレーション

データベースへのテーブルの追加や編集といったスキーマへの操作を記録し，それらを逐次実行することで，開発者間で環境を揃えることをマイグレーションという．

このリポジトリにおけるマイグレーションの手順は以下のとおりです．

1. `prisma/schema.prisma`において，スキーマを編集する
2. `pnpm run migrate:create`を実行し，sqlファイルを`prisma`ディレクトリ以下に作成される
3. 作成されたsqlファイルを確認し，既存のスキーマを壊すことがないか確認
4. `pnpm run migrate:dev`でsqlを実行する

### packages/frontend

| Feature                | Package                                                           |
| ---------------------- | ----------------------------------------------------------------- |
| UIライブラリ           | [React](https://ja.react.dev/)                                    |
| ルーティングライブラリ | [@generouted/react-router](https://github.com/oedotme/generouted) |
| UIコンポーネント       | [Chakra UI](https://chakra-ui.com/)                               |

## Nodeのバージョンについて

pnpmの問題かは不明だが最新のNode24を使用するとpnpm install時にnodeのJavaScript heap out of memoryエラーが発生して失敗する

そのためプロジェクトのビルドおよびCIではNode.jsのバージョンを22に設定している。

## インフラ

kubernetes dashboardがデプロイされているので以下で確認できる。

## 環境構成

### 本番環境 (Production)

- **デプロイ**: mainブランチへのpushで自動デプロイ
- **URL**: https://kojirer.arcircle.f5.si

### 開発環境 (Development)

- **デプロイ**: GitHub ActionsのWorkflow Dispatchで手動デプロイ（組織メンバーのみ）
- **制限**: 最大4スロット（dev-1〜dev-4）まで同時存在可能
- **アクセス**: ポートフォワーディング（外部公開なし）
- **データベース**: PostgreSQLスキーマ分離で本番から完全独立
- **DB初期化**: Prismaマイグレーション + 開発用サンプルデータ自動投入
- **Secret管理**: 事前準備済みスロット専用Secret（`dev-1-env`〜`dev-4-env`）

#### dev環境の使い方

**1. デプロイ**

```bash
# GitHub ActionsのDeploy Development Environmentワークフローを実行
# 入力項目:
# - branch: デプロイしたいブランチ/コミット (例: feature-auth)
# → 利用可能なスロット（dev-1〜dev-4）に自動デプロイされる
```

**2. アクセス**

```bash
# アプリケーション（例：dev-1スロット）
kubectl port-forward svc/dev-1-kojirer 8080:52600
# → http://localhost:8080 でアクセス

# Prisma Studio（DB管理）
kubectl port-forward svc/dev-1-prisma-studio 5555:5555
# → http://localhost:5555 でアクセス
```

**3. 削除**

```bash
# GitHub ActionsのCleanup Development Environmentワークフローを実行
# 入力項目:
# - slot_number: 削除するスロット番号 (1〜4)
# → Kubernetesリソース + DBスキーマも完全削除（Secretは保持）
```

**セキュリティ機能**

- 組織メンバーのみデプロイ可能（外部からの実行を防止）
- PostgreSQLスキーマ分離で本番データと完全独立

### 初回だけ

- kubectl が入っていなければまずは何らかの方法でkubectlをインストール
- kubeconfigを`~/.kube/config`に貼り付ける。(※configはディレクトリではなく拡張子なしのファイル)

### 次回以降

```bash

# 一時的なトークンを生成
kubectl -n kubernetes-dashboard create token admin-user

# dashboard をポートフォワーディング
kubectl -n kubernetes-dashboard port-forward svc/kubernetes-dashboard-kong-proxy 8443:443

# ブラウザで https://localhost:8443 にアクセスして上のトークンでログイン
```

### データベース

PostgreSQLはHelmでデプロイ・管理されています。直接アクセスは基本無し。

### Prisma Studio

```bash
# ポートフォワーディングでアクセス
kubectl port-forward svc/prisma-studio 5555:5555

# ブラウザで http://localhost:5555 にアクセス
```
