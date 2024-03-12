# Kojirer
- AR会謹製豚そば「こうじろう」の食券管理システム

## How to Start develop
- DockerおよびGitのインストール，GitHubのセットアップが前提
```bash
git clone "git@github.com:ARCircle/Kojirer.git"
cd Kojirer
cp example.env .env
```
ここで，.env の中身の環境変数であるPOSTGRES_PASSWORD，POSTGRES_USERを編集してください．そして，以下のコマンドを入力することで，開発サーバが起動します．
```bash
sudo TARGET=dev docker-compose up -d
npm run migrate:dev
npm install
```

`TARGET=dev`では，開発の迅速化のため，フロントエンドサーバ (port: 52800) とバックエンドサーバ (port: 52600) の両方が起動します．このときはフロントエンドサーバを軸に開発してください．
なお，バックエンドのコンソール表示が2重になっていますが，これは仕様です (原因探し中)．

また，現状ではvolumeが自動的にroot権限になってしまうためsudoが必要です．
UIDとかそこら辺が原因？

### trouble shooting
- `.docker/buildx/current: permission denied`
    - `sudo chown -R {username} ~/.docker/buildx/current`


## How to Start Production
```bash
sudo docker-compose up -d --build
```

環境変数`TARGET`を指定しないときは，デフォルト値`TARGET=prod`になります．
開発環境ではバックエンドサーバ (port: 52600) のみ起動します．

## ディレクトリ構成
### pakages
Kojirerのコア部分です．基本的にここをいじくります．

### pakages/backend
| Feature | Package |
| -- | -- |
| HTTPサーバフレームワーク | [Express.js](https://expressjs.com/ja/) |
| ORM/マイグレーションツール | [Prisma.js](https://www.prisma.io/) |
| データベース | PostgreSQL |

#### Routeの追加
tsファイルを`src/routes`に追加すると，そのファイル名のパスが作られます．

#### DBマイグレーション
データベースへのテーブルの追加や編集といったスキーマへの操作を記録し，それらを逐次実行することで，開発者間で環境を揃えることをマイグレーションといいます．

このリポジトリにおけるマイグレーションの手順は以下のとおりです．
1. `prisma/schema.prisma`において，スキーマを編集する
2. `npm run migrate:create`を実行し，sqlファイルを`prisma`ディレクトリ以下に作成される
3. 作成されたsqlファイルを確認し，既存のスキーマを壊すことがないか確認
4. `npm run migrate:dev`でsqlを実行する

### pakages/frontend
| Feature | Package |
| -- | -- |
| UIライブラリ | [React](https://ja.react.dev/) |
| ルーティングライブラリ | [@generouted/react-router](https://github.com/oedotme/generouted) |
| UIコンポーネント | [Chakra UI](https://chakra-ui.com/) |
