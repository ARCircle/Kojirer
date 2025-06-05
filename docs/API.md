# API Schema

This project exposes REST endpoints documented via [OpenAPI](https://www.openapis.org/). The full specification is available at `packages/api/openapi.yml`.

## Don

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/dons` | 全ての丼を取得 |
| `GET` | `/dons/{id}` | 特定の id の丼の詳細を取得 |
| `PUT` | `/dons/{id}` | don の調理状態を更新 |
| `POST` | `/dons/price` | 条件に応じた丼の価格を計算 |
| `POST` | `/dons/status/` | 指定した状態の don 一覧を取得 |

## Option

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/options` | オプションの数字と言葉のマッピングを取得 |

## Order

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/order` | 新規注文を追加 |
| `POST` | `/order/price` | オーダー単位の価格を計算 |
| `POST` | `/order/status` | don の状態に応じて Order を取得 |
| `PUT` | `/order/status` | Order 内の全 don の状態をまとめて更新 |

## Topping

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/toppings` | すべてのトッピングを返す |
| `GET` | `/toppings/available` | 利用可能なトッピングのみ返す |

For exact request and response formats please refer to the [OpenAPI file](../packages/api/openapi.yml).
