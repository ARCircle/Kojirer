FROM node:20-slim AS prod

# 作業ディレクトリを指定 (ディレクトリがない場合は作ってくれる)
WORKDIR /kojirer

# 依存関係を示すファイルをコピー
COPY . .

# アプリの依存関係をインストール
RUN npm install

# ビルド
RUN npm run build

CMD [ "npm", "run", "start" ]
