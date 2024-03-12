FROM mcr.microsoft.com/devcontainers/javascript-node:1-20-bullseye

WORKDIR /app

COPY . .

# User
ENV UID=1000
ENV GID=1000

# db settings
ENV POSTGRES_PASSWORD=example-pass
ENV POSTGRES_USER=example-user
ENV POSTGRES_DB=kojirer
ENV DATABASE_URL="postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}"

# アプリの依存関係をインストール
RUN npm run migrate:dev
RUN npm install

# ビルド
RUN npm run build

# ポートを指定
EXPOSE 52600
