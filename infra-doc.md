# Kojirer インフラストラクチャドキュメント

## 概要

本ドキュメントは、Kojirerアプリケーションの本番環境インフラストラクチャの構成、セットアップ手順、運用方法を記載しています。

## サーバー環境

### ホストサーバー

| 項目       | 値                 |
| ---------- | ------------------ |
| OS         | Ubuntu 24.04.2 LTS |
| ホスト名   | \*\*\*             |
| IPアドレス | \*\*\*             |
| Kubernetes | k3s                |

### k3s構成

- **インストール済みコンポーネント**
  - kubectl (組み込み)
  - Traefik Ingress Controller (組み込み)
  - Local Path Provisioner (ストレージ)

## インフラコンポーネント

### 1. cert-manager (証明書管理)

#### インストール

```bash
# Helmリポジトリ追加
helm repo add jetstack https://charts.jetstack.io
helm repo update

# cert-managerインストール
helm upgrade --install cert-manager jetstack/cert-manager \
  --namespace cert-manager --create-namespace \
  --set crds.enabled=true
```

#### ClusterIssuer設定

```yaml
# clusterissuer-prod.yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
      - http01:
          ingress:
            class: traefik
```

```bash
kubectl apply -f clusterissuer-prod.yaml
```

### 2. PostgreSQL Database

#### インストール

```bash
# Helmリポジトリ追加
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# PostgreSQLインストール
helm upgrade --install pg bitnami/postgresql \
  -n db --create-namespace \
  --set auth.database=*** \
  --set auth.username=*** \
  --set auth.password=*** \
  --set primary.persistence.size=10Gi
```

#### 接続情報

| 項目      | 値                                 |
| --------- | ---------------------------------- |
| Namespace | db                                 |
| Service   | pg-postgresql.db.svc.cluster.local |
| Port      | 5432                               |
| Database  | \*\*\*                             |
| Username  | \*\*\*                             |
| Password  | \*\*\*                             |
| Storage   | 10Gi (local-path)                  |

### 3. Kubernetes Dashboard

#### アクセス方法

```bash
# トークン生成
kubectl -n kubernetes-dashboard create token admin-user

# ポートフォワード
kubectl -n kubernetes-dashboard port-forward svc/kubernetes-dashboard-kong-proxy 8443:443

# ブラウザでアクセス
# https://localhost:8443
```

## アプリケーション構成

### Kojirerアプリケーション

#### デプロイメント仕様

| 項目           | 値                       |
| -------------- | ------------------------ |
| Namespace      | default                  |
| Image Registry | ghcr.io/arcircle/kojirer |
| Container Port | 52600                    |
| Service Type   | ClusterIP                |
| Replicas       | 1                        |

#### リソース制限

| リソース | Request | Limit |
| -------- | ------- | ----- |
| CPU      | 100m    | 200m  |
| Memory   | 128Mi   | 256Mi |

#### 環境変数とSecret

```bash
# DATABASE_URL Secretの作成
kubectl create secret generic kojirer-env \
  --from-literal=DATABASE_URL='postgresql://***/:***@pg-postgresql.db.svc.cluster.local:5432/***?schema=public'
```

### Ingress設定

#### ドメインとTLS

- **ドメイン**: kojirer.arcircle.f5.si
- **証明書**: Let's Encrypt (自動更新)
- **HTTPSリダイレクト**: 自動 (Traefik Middleware)

## CI/CD パイプライン

### GitHub Actions ワークフロー

1. **トリガー**: mainブランチへのプッシュ
2. **ビルド**: Dockerイメージをビルド
3. **プッシュ**: ghcr.io (GitHub Container Registry)へプッシュ
4. **デプロイ**: Kustomizeでマニフェスト生成 → kubectl apply

## 運用手順

### 本番デプロイメント

#### 自動デプロイ (CI/CD)

```bash
# mainブランチにプッシュすると自動実行
git push origin main
```

### dev環境運用

#### dev環境作成

```bash
# GitHub Actions > Actions > Deploy Development Environment
# 入力:
# - branch: デプロイしたいブランチ (例: feature-auth)

# デプロイされるリソース:
# - dev-[1-4]-kojirer (アプリケーション)
# - dev-[1-4]-prisma-studio (DB管理ツール)
# - dev-[1-4]-devdata-sql-xxxxx (サンプルデータConfigMap)
# - PostgreSQL schema: dev-[1-4] (マイグレーション＋サンプルデータ投入済み)
# ※事前準備済みSecret（dev-[1-4]-env）を使用
```

#### dev環境アクセス

```bash
# アプリケーション（例：dev-1スロット）
kubectl port-forward svc/dev-1-kojirer 8080:52600

# Prisma Studio
kubectl port-forward svc/dev-1-prisma-studio 5555:5555

# dev環境一覧確認
kubectl get deployments -l app=kojirer --field-selector metadata.name!=kojirer
```

#### dev環境削除

```bash
# GitHub Actions > Actions > Cleanup Development Environment
# 入力:
# - slot_number: 削除するスロット番号 (1〜4)

# 削除されるリソース:
# - Kubernetesリソース（Deployment, Service, ConfigMap）
# - PostgreSQLスキーマ（dev-[1-4]）とその全データ（サンプルデータ含む）
# ※Secret（dev-[1-4]-env）は保持（再利用可能）
```

### モニタリング

#### ログ確認

基本dashboardから閲覧。cliからなら以下コマンド。

```bash
# 最新ログ
kubectl logs deploy/kojirer --tail=200

# 前回のコンテナログ
kubectl logs deploy/kojirer --previous --tail=200
```

#### Pod状態確認

基本dashboardから閲覧。cliからなら以下コマンド。

```bash
# Pod一覧
kubectl get pod -l app=kojirer -o wide

# 詳細情報
kubectl describe deploy/kojirer
```

#### Prisma Studio

アプリケーションと同じ環境で、**GitHub ActionsのCDで自動デプロイ**：

```bash
# ポートフォワード
kubectl port-forward svc/prisma-studio 5555:5555

# ブラウザでアクセス
# http://localhost:5555
```

## セキュリティ

### Secret管理

- すべての機密情報はKubernetes Secretで管理
- kubeconfigは安全に保管

### ネットワークセキュリティ

- 外部公開はIngressのみ
- データベースは内部通信のみ
- HTTPS強制（HTTP→HTTPSリダイレクト）

### アクセス制御

- Kubernetes DashboardはTokenベース認証

---

## 初期セットアップ手順

新規サーバーでの環境構築手順：

```bash
# 1. k3sインストール
curl -sfL https://get.k3s.io | sh -

# 2. kubeconfigエクスポート
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml

# 3. Helmインストール
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
chmod 700 get_helm.sh
./get_helm.sh

# 4. cert-managerインストール
helm repo add jetstack https://charts.jetstack.io
helm upgrade --install cert-manager jetstack/cert-manager \
  --namespace cert-manager --create-namespace \
  --set crds.enabled=true

# 5. ClusterIssuer作成
kubectl apply -f clusterissuer-prod.yaml

# 6. PostgreSQLインストール
helm repo add bitnami https://charts.bitnami.com/bitnami
helm upgrade --install pg bitnami/postgresql \
  -n db --create-namespace \
  --set auth.database=*** \
  --set auth.username=*** \
  --set auth.password=*** \
  --set primary.persistence.size=10Gi

# 7. Secret作成
kubectl create secret generic kojirer-env \
  --from-literal=DATABASE_URL='postgresql://***/:***@pg-postgresql.db.svc.cluster.local:5432/***?schema=public'

# 8. dev環境用スロットSecret作成
kubectl create secret generic dev-1-env \
  --from-literal=DATABASE_URL='postgresql://***/:***@pg-postgresql.db.svc.cluster.local:5432/***?schema=dev-1'
kubectl create secret generic dev-2-env \
  --from-literal=DATABASE_URL='postgresql://***/:***@pg-postgresql.db.svc.cluster.local:5432/***?schema=dev-2'
kubectl create secret generic dev-3-env \
  --from-literal=DATABASE_URL='postgresql://***/:***@pg-postgresql.db.svc.cluster.local:5432/***?schema=dev-3'
kubectl create secret generic dev-4-env \
  --from-literal=DATABASE_URL='postgresql://***/:***@pg-postgresql.db.svc.cluster.local:5432/***?schema=dev-4'

# 9. dev環境システム
## 概要
- GitHub ActionsでWorkflow Dispatch実行によりdev環境を作成/削除
- PostgreSQLスキーマ分離により本番と完全独立
- 最大4環境まで同時運用可能

## セキュリティ機能
- ARCircle組織メンバーのみ実行可能（外部実行防止）
- kojirer-envからDATABASE_URLを自動抽出・変換（GitHub Secretsへの追加不要）
- ::add-mask::によるログ出力保護
- 削除時の本番データ保護機能

## Secret管理
- 事前準備済みスロット専用Secret（dev-1-env〜dev-4-env）を手動で作成・管理
- PostgreSQLスキーマ名をスロット別に変更（schema=dev-[1-4]）
- Kubernetes公式推奨のstringData方式を使用

## DB初期化システム
dev環境デプロイ時に以下の順序でDB初期化が実行される：

1. **db-migrate initContainer**
   - Image: kojirer:latest
   - Command: `pnpm dlx prisma migrate deploy`
   - 新しいスキーマにテーブル構造を作成

2. **db-seed initContainer**
   - Image: postgres:16-alpine
   - ConfigMap: kustomize configMapGeneratorで`packages/backend/examples/devdata.sql`から自動生成
   - Command: `psql "$DATABASE_URL" -f /devdata.sql`
   - 開発用サンプルデータを投入

3. **kojirer container**
   - メインアプリケーションが起動
   - すでにマイグレーション＋サンプルデータが投入済み

### サンプルデータ内容
- customizes: 8種類のカスタマイズ（サイズ3種 + トッピング5種）
- customize_prices: 価格履歴データ（2024年→2025年の価格変更を含む）
- orders: 6つの注文（SNSフォロー特典のパターン違い）
- dons: 11個の丼（全ステータスパターン + 時系列データ）
- don_customizes: カスタマイズ関連データ（SNS特典、割引テスト含む）

# 10. アプリケーションデプロイ
kubectl apply -k k8s/overlays/prod
```
