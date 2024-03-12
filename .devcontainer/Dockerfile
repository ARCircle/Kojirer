FROM mcr.microsoft.com/devcontainers/javascript-node:1-20-bullseye

WORKDIR /app

COPY . .

# db settings
ENV POSTGRES_PASSWORD=kojirer
ENV POSTGRES_USER=kojirer
ENV POSTGRES_DB=kojirer
ENV DATABASE_URL="postgres://kojirer:kojirer@localhost:5432/kojirer"

# アプリの依存関係をインストール
RUN npm install

# ビルド
RUN npm run build

# ポートを指定
EXPOSE 52600
