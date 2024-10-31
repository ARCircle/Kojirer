FROM node:20-slim AS prod

# 作業ディレクトリを指定 (ディレクトリがない場合は作ってくれる)
WORKDIR /kojirer

# 依存関係を示すファイルをコピー
COPY . /kojirer

RUN apt-get update -y && apt-get install -y openssl

# アプリの依存関係をインストール
RUN npm install

RUN npx prisma generate --schema packages/backend/prisma/schema.prisma

# ビルド
RUN npm run build

CMD [ "sh", "-c", "npm run start & npx prisma studio --schema packages/backend/prisma/schema.prisma" ]
