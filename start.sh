#!/bin/bash

# アプリケーションサーバーの起動
echo "Starting application server..."
npm run start&

# Prisma Studio の起動
echo "Starting Prisma Studio..."
npx --workspace=backend prisma studio&

# 両方のプロセスが終了するまで待機
wait
