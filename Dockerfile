FROM node:20-slim AS prod

# 作業ディレクトリを指定 (ディレクトリがない場合は作ってくれる)
WORKDIR /kojirer

# 依存関係を示すファイルをコピー
COPY . /kojirer

RUN apt-get update -y && apt-get install -y openssl \
    && npm install -g pnpm

# アプリの依存関係をインストール
RUN pnpm install

RUN npx prisma generate --schema packages/backend/prisma/schema.prisma

# ビルド
RUN pnpm run build

CMD [ "sh", "-c", "pnpm run start & npx prisma studio --schema packages/backend/prisma/schema.prisma" ]
