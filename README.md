# Kojirer
- AR会謹製豚そば「こうじろう」の食券管理システム

## How to Start Develop
### ０. 前提
以下のインストールおよびセットアップをすること．
- VSCode
- Docker
- Git

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
```
VSCodeでクローンしたディレクトリを開く．
```bash
code .
```
### 2. devcontainerの起動
VSCodeの画面左の「><」のようなマークから，
「コンテナーで再度開く（Reopen in Container）」という欄をクリック．

初めてビルドする際は，右下にダイアログが出現するので
「コンテナーで再度開く」を実行しても可能．

### 3. マイグレーションの実行
開発中のDBとスキーマ定義を合わせるため，
開発開始時には必ずマイグレーションを実行する．
```bash
npm run migrate:dev
```

`TARGET=dev`では，ホットリロードの恩恵を受けるため，フロントエンドサーバ (port: 52800) とバックエンドサーバ (port: 52600) の両方が起動する．
なお，バックエンドのコンソール表示が2重になっているが，これは仕様である (原因探し中)．

## How to Start Production
```bash
sudo docker-compose up -d --build
```
開発環境ではバックエンドサーバ (port: 52600) のみ起動する．

## ディレクトリ構成
### pakages
Kojirerのコア部分．基本的にここをいじくることになる．

### pakages/backend
| Feature | Package |
| -- | -- |
| HTTPサーバフレームワーク | [Express.js](https://expressjs.com/ja/) |
| ORM/マイグレーションツール | [Prisma.js](https://www.prisma.io/) |
| データベース | PostgreSQL |

#### Routeの追加
tsファイルを`src/routes`に追加すると，そのファイル名のパスが作られる．

#### DBマイグレーション
データベースへのテーブルの追加や編集といったスキーマへの操作を記録し，それらを逐次実行することで，開発者間で環境を揃えることをマイグレーションという．

このリポジトリにおけるマイグレーションの手順は以下のとおりです．
1. `prisma/schema.prisma`において，スキーマを編集する
2. `npm run migrate:create`を実行し，sqlファイルを`prisma`ディレクトリ以下に作成される
3. 作成されたsqlファイルを確認し，既存のスキーマを壊すことがないか確認
4. `npm run migrate:dev`でsqlを実行する

#### 開発用データのInsert
`.devcontainer`の外，すなわちWSL上の`Kojirer`ディレクトリにおいて，以下のコマンドを実行．
```bash
 docker exec -i kojirer_devcontainer-db-1 psql -U kojirer -d kojirer < packages/backend/examples/devdata.sql 
```

### pakages/frontend
| Feature | Package |
| -- | -- |
| UIライブラリ | [React](https://ja.react.dev/) |
| ルーティングライブラリ | [@generouted/react-router](https://github.com/oedotme/generouted) |
| UIコンポーネント | [Chakra UI](https://chakra-ui.com/) |
