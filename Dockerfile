##################### BUILD STAGE #####################
FROM node:20-slim AS builder

# 作業ディレクトリを指定 (ディレクトリがない場合は作成)
WORKDIR /kojirer

# 依存関係をインストールするために package.json ファイルをコピー
COPY package.json package-lock.json ./

# 各パッケージの package.json をコピー
COPY packages/backend/package.json packages/backend/
COPY packages/frontend/package.json packages/frontend/
COPY packages/api/package.json packages/api/

# アプリの依存関係をインストール
RUN npm install --production

# ソースコード全体をビルド環境にコピー
COPY . .

# ビルド
RUN npm run build

##################### PRODUCTION STAGE #####################
FROM node:20-slim AS prod

# 作業ディレクトリを指定
WORKDIR /kojirer

# ビルド済みコードと依存関係のみをコピー
COPY --from=builder /kojirer/packages/backend/built/ ./packages/backend/built/
COPY --from=builder /kojirer/node_modules ./node_modules/
COPY --from=builder /kojirer/package.json ./package.json

# ポートを指定
EXPOSE 52600

# スタートスクリプトをコピーし、実行権限を付与
COPY start.sh /start.sh
RUN chmod +x /start.sh

# コンテナ実行時のコマンドを指定
CMD ["sh", "/start.sh"]
