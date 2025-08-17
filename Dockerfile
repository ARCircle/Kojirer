# 本番用アプリケーションイメージ
# 動作には docker run --env-file や docker compose による環境変数による credential の設定が必須

FROM node:22-slim AS base
# 作業ディレクトリを指定 (ディレクトリがない場合は作ってくれる)
WORKDIR /kojirer

RUN apt-get update -y && apt-get install -y openssl \
    && npm install -g pnpm

FROM base AS builder
COPY . /kojirer

RUN pnpm install --frozen-lockfile

RUN cd packages/backend && \
    sed -i '/generator erd {/,/}/d' prisma/schema.prisma && \
    pnpm exec prisma generate

RUN pnpm run build

FROM base AS production
ENV NODE_ENV=production
COPY --from=builder /kojirer/package.json ./package.json
COPY --from=builder /kojirer/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /kojirer/pnpm-workspace.yaml ./pnpm-workspace.yaml

COPY --from=builder /kojirer/packages/backend/package.json ./packages/backend/package.json
COPY --from=builder /kojirer/packages/backend/prisma/schema.prisma ./packages/backend/prisma/schema.prisma
COPY --from=builder /kojirer/packages/backend/node_modules/.prisma ./packages/backend/node_modules/.prisma

RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /kojirer/packages/backend/built ./packages/backend/built

EXPOSE 52600

ENTRYPOINT [ "sh" , "-c", "node /kojirer/packages/backend/built/index.js" ]
