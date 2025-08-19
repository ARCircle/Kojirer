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
  --from-literal=DATABASE_URL='postgresql://*** */:***@pg-postgresql.db.svc.cluster.local:5432/***?schema=public'
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

### Kustomize構成

```
k8s/
├── base/                 # 基本リソース定義
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   └── kustomization.yaml
├── overlays/
│   ├── prod/            # 本番環境設定
│   │   ├── deployment-patch.yaml
│   │   ├── ingress-patch.yaml
│   │   └── kustomization.yaml
│   └── infra/           # インフラツール
│       ├── prisma-studio.yaml
│       └── kustomization.yaml
```

## 運用手順

### デプロイメント

#### 自動デプロイ (CI/CD)

```bash
# mainブランチにプッシュすると自動実行
git push origin main
```

#### 手動デプロイ

```bash
# マニフェスト適用
kubectl apply -k k8s/overlays/prod

# デプロイメント状態確認
kubectl rollout status deployment/kojirer --timeout=600s
```

### モニタリング

#### ログ確認

```bash
# 最新ログ
kubectl logs deploy/kojirer --tail=200

# 前回のコンテナログ
kubectl logs deploy/kojirer --previous --tail=200
```

#### Pod状態確認

```bash
# Pod一覧
kubectl get pod -l app=kojirer -o wide

# 詳細情報
kubectl describe deploy/kojirer
```

#### ヘルスチェック

```bash
# 内部から
kubectl run tmp-curl --rm -it --restart=Never --image=curlimages/curl -- \
  curl -sSI http://kojirer/healthz

# 外部から
curl -sI https://kojirer.arcircle.f5.si/healthz
```

#### Prisma Studio

アプリケーションと同じ環境で、**GitHub ActionsのCDで自動デプロイ**：

```bash
# 状態確認
kubectl get pod -l app=prisma-studio

# ポートフォワード
kubectl port-forward svc/prisma-studio 5555:5555

# ブラウザでアクセス
# http://localhost:5555
```

**特徴**:

- アプリケーションと統合された環境で動作
- mainブランチpushでアプリケーションと同時にデプロイ
- 同じKustomizeオーバーレイで管理

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
  --from-literal=DATABASE_URL='postgresql://*** */:***@pg-postgresql.db.svc.cluster.local:5432/***?schema=public'

# 8. アプリケーションデプロイ
kubectl apply -k k8s/overlays/prod
```
