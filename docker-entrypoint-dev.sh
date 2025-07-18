#!/bin/bash
set -e

echo "Initializing node_modules from cache..."

# キャッシュからnode_modulesをtmpfsマウントポイントにコピー
cp -a /opt/node_modules_cache/node_modules /kojirer/
cp -a /opt/node_modules_cache/packages/api/node_modules /kojirer/packages/api/
cp -a /opt/node_modules_cache/packages/backend/node_modules /kojirer/packages/backend/
cp -a /opt/node_modules_cache/packages/frontend/node_modules /kojirer/packages/frontend/

# コンテナ起動時のコマンドを実行
echo "Running command: $@"
exec "$@"
