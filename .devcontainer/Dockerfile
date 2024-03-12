FROM mcr.microsoft.com/devcontainers/javascript-node:1-20-bullseye

WORKDIR /app

COPY . .

# アプリの依存関係をインストール
RUN npm install --production

# ビルド
RUN npm run build

# ポートを指定
EXPOSE 52600
