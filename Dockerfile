FROM node:20-slim AS builder

WORKDIR /app

COPY . .

RUN apt-get update -y && apt-get install -y openssl

# db settings
ENV POSTGRES_PASSWORD=kojirer
ENV POSTGRES_USER=kojirer
ENV POSTGRES_DB=kojirer
ENV DATABASE_URL="postgres://kojirer:kojirer@localhost:5432/kojirer"

# アプリの依存関係をインストール
RUN npm install

# ビルド
RUN npm run build


CMD ["npm", "run", "start"]

