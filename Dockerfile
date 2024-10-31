##################### BUILD STAGE #####################
FROM node:20-slim AS builder

# 作業ディレクトリを指定 (ディレクトリがない場合は作ってくれる)
WORKDIR /kojirer

# ソースコードをコピー
COPY . .

# アプリの依存関係をインストール
RUN npm install --production

# ビルド
RUN npm run build

##################### PRODUCTION STAGE #####################
FROM node:20-slim AS prod

# 作業ディレクトリを指定
WORKDIR /kojirer

COPY --from=builder "/kojirer/packages/backend/built/" "./packages/backend/built/"
COPY --from=builder "/kojirer/node_modules" "./node_modules/"
COPY --from=builder "/kojirer/package.json" "./package.json"

# ポートを指定
EXPOSE 52600

COPY start.sh /start.sh
RUN chmod +x /start.sh
CMD ["sh", "/start.sh"]
