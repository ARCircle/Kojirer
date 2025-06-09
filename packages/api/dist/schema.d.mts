interface paths {
  '/dons': {
    parameters: {
      query?: never | null;
      header?: never | null;
      path?: never | null;
      cookie?: never | null;
    };
    /** @description 全ての丼を取得 */
    get: {
      parameters: {
        query?: never | null;
        header?: never | null;
        path?: never | null;
        cookie?: never | null;
      };
      requestBody?: never | null;
      responses: {
        /** @description 成功 */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            'application/json': components['schemas']['Don'][];
          };
        };
      };
    };
    put?: never | null;
    post?: never | null;
    delete?: never | null;
    options?: never | null;
    head?: never | null;
    patch?: never | null;
    trace?: never | null;
  };
  '/dons/{id}': {
    parameters: {
      query?: never | null;
      header?: never | null;
      path?: never | null;
      cookie?: never | null;
    };
    /** @description 特定のidの丼の詳細を取得 */
    get: {
      parameters: {
        query?: never | null;
        header?: never | null;
        path: {
          id: number;
        };
        cookie?: never | null;
      };
      requestBody?: never | null;
      responses: {
        /** @description 丼の詳細を返す */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            'application/json': components['schemas']['Don'];
          };
        };
      };
    };
    /** @description donの調理状態を更新する */
    put: {
      parameters: {
        query?: never | null;
        header?: never | null;
        path: {
          id: number;
        };
        cookie?: never | null;
      };
      requestBody: {
        content: {
          'application/json': {
            /** Format: int32 */
            status: number;
          };
        };
      };
      responses: {
        /** @description 調理状態の変更に成功 */
        201: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            'application/json': components['schemas']['Don'];
          };
        };
      };
    };
    post?: never | null;
    delete?: never | null;
    options?: never | null;
    head?: never | null;
    patch?: never | null;
    trace?: never | null;
  };
  '/dons/price': {
    parameters: {
      query?: never | null;
      header?: never | null;
      path?: never | null;
      cookie?: never | null;
    };
    get?: never | null;
    put?: never | null;
    /** @description 特定の条件の場合の丼の値段を取得 */
    post: {
      parameters: {
        query?: never | null;
        header?: never | null;
        path?: never | null;
        cookie?: never | null;
      };
      requestBody: {
        content: {
          'application/json': {
            /** Format: int32 */
            size: number;
            toppings?:
              | {
                  /** Format: int32 */
                  id: number;
                  /** Format: int32 */
                  amount: number;
                }[]
              | null;
            snsFollowed?: boolean | null;
          };
        };
      };
      responses: {
        /** @description 価格を返す */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            'application/json': {
              /** Format: int32 */
              price?: number | null;
            };
          };
        };
      };
    };
    delete?: never | null;
    options?: never | null;
    head?: never | null;
    patch?: never | null;
    trace?: never | null;
  };
  '/dons/status/': {
    parameters: {
      query?: never | null;
      header?: never | null;
      path?: never | null;
      cookie?: never | null;
    };
    get?: never | null;
    put?: never | null;
    /** @description 特定の状態の丼を取得する */
    post: {
      parameters: {
        query?: never | null;
        header?: never | null;
        path?: never | null;
        cookie?: never | null;
      };
      requestBody: {
        content: {
          'application/json': {
            /**
             * Format: int32
             * @description 調理状態を表すstatus
             *     1: 調理中
             *     2: 調理完了
             *     3: 受け渡し済み
             *
             */
            status: number;
            /**
             * Format: int32
             * @description 取得件数上限
             * @default 10
             */
            limit?: number | null;
          };
        };
      };
      responses: {
        /** @description 注文の一覧を正常に取得 */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            'application/json': components['schemas']['Don'][];
          };
        };
      };
    };
    delete?: never | null;
    options?: never | null;
    head?: never | null;
    patch?: never | null;
    trace?: never | null;
  };
  '/options': {
    parameters: {
      query?: never | null;
      header?: never | null;
      path?: never | null;
      cookie?: never | null;
    };
    get: {
      parameters: {
        query?: never | null;
        header?: never | null;
        path?: never | null;
        cookie?: never | null;
      };
      requestBody?: never | null;
      responses: {
        /** @description オプションの数字と言葉をマッピングを取得 */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            'application/json': components['schemas']['Option'][];
          };
        };
      };
    };
    put?: never | null;
    post?: never | null;
    delete?: never | null;
    options?: never | null;
    head?: never | null;
    patch?: never | null;
    trace?: never | null;
  };
  '/order': {
    parameters: {
      query?: never | null;
      header?: never | null;
      path?: never | null;
      cookie?: never | null;
    };
    get?: never | null;
    put?: never | null;
    /**
     * 新規注文を追加
     * @description 新規注文を含むリクエストに対して，DBにその内容を保存し，作成した内容をレスポンスする
     */
    post: {
      parameters: {
        query?: never | null;
        header?: never | null;
        path?: never | null;
        cookie?: never | null;
      };
      requestBody: {
        content: {
          'application/json': {
            callNum: number;
            dons: {
              /** Format: int32 */
              size: number;
              /** Format: int32 */
              yasai: number;
              /** Format: int32 */
              ninniku: number;
              /** Format: int32 */
              karame: number;
              /** Format: int32 */
              abura: number;
              snsFollowed?: boolean | null;
              toppings: {
                /** Format: int32 */
                id: number;
                /** Format: int32 */
                amount: number;
              }[];
            }[];
          };
        };
      };
      responses: {
        /** @description 注文の追加が成功 */
        201: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            'application/json': components['schemas']['Order'];
          };
        };
      };
    };
    delete?: never | null;
    options?: never | null;
    head?: never | null;
    patch?: never | null;
    trace?: never | null;
  };
  '/order/price': {
    parameters: {
      query?: never | null;
      header?: never | null;
      path?: never | null;
      cookie?: never | null;
    };
    get?: never | null;
    put?: never | null;
    /** @description オーダー単位の値段を取得 */
    post: {
      parameters: {
        query?: never | null;
        header?: never | null;
        path?: never | null;
        cookie?: never | null;
      };
      requestBody: {
        content: {
          'application/json': {
            dons: {
              /** Format: int32 */
              size: number;
              toppings?:
                | {
                    /** Format: int32 */
                    id: number;
                    /** Format: int32 */
                    amount: number;
                  }[]
                | null;
              snsFollowed?: boolean | null;
            }[];
          };
        };
      };
      responses: {
        /** @description 価格を返す */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            'application/json': {
              /** Format: int32 */
              price?: number | null;
            };
          };
        };
      };
    };
    delete?: never | null;
    options?: never | null;
    head?: never | null;
    patch?: never | null;
    trace?: never | null;
  };
  '/order/status': {
    parameters: {
      query?: never | null;
      header?: never | null;
      path?: never | null;
      cookie?: never | null;
    };
    get?: never | null;
    /** @description 1つの order の中の全ての don の状態を targetStatus に更新する
     *     order 単位で変更可能な status は 2 -> 3 or 3 -> 2 のみ.
     *      */
    put: {
      parameters: {
        query?: never | null;
        header?: never | null;
        path?: never | null;
        cookie?: never | null;
      };
      requestBody: {
        content: {
          'application/json': {
            /** Format: int32 */
            targetStatus: number;
            /** Format: int32 */
            orderId: number;
          };
        };
      };
      responses: {
        /** @description 更新後の Order を返す */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            'application/json': components['schemas']['Order'];
          };
        };
      };
    };
    /** @description don のステータスに応じて Order を取得する。各ステータスの動作は以下の通り
     *     1: 一つでも調理中の don がある Order を全て取得
     *     2: 全ての don が調理済み かつ 受け渡しが完了していない Order を取得
     *     3: オーダー内の全ての don が受け渡し完了の Order を取得
     *      */
    post: {
      parameters: {
        query?: never | null;
        header?: never | null;
        path?: never | null;
        cookie?: never | null;
      };
      requestBody: {
        content: {
          'application/json': {
            /** Format: int32 */
            status: number;
          };
        };
      };
      responses: {
        /** @description ステータスに応じた Order を返す */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            'application/json': components['schemas']['Order'][];
          };
        };
      };
    };
    delete?: never | null;
    options?: never | null;
    head?: never | null;
    patch?: never | null;
    trace?: never | null;
  };
  '/toppings': {
    parameters: {
      query?: never | null;
      header?: never | null;
      path?: never | null;
      cookie?: never | null;
    };
    get: {
      parameters: {
        query?: never | null;
        header?: never | null;
        path?: never | null;
        cookie?: never | null;
      };
      requestBody?: never | null;
      responses: {
        /** @description すべてのトッピングを返す */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            'application/json': components['schemas']['Topping'][];
          };
        };
      };
    };
    put?: never | null;
    post?: never | null;
    delete?: never | null;
    options?: never | null;
    head?: never | null;
    patch?: never | null;
    trace?: never | null;
  };
  '/toppings/available': {
    parameters: {
      query?: never | null;
      header?: never | null;
      path?: never | null;
      cookie?: never | null;
    };
    get: {
      parameters: {
        query?: never | null;
        header?: never | null;
        path?: never | null;
        cookie?: never | null;
      };
      requestBody?: never | null;
      responses: {
        /** @description すべてのトッピングを返す */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            'application/json': components['schemas']['Topping'][];
          };
        };
      };
    };
    put?: never | null;
    post?: never | null;
    delete?: never | null;
    options?: never | null;
    head?: never | null;
    patch?: never | null;
    trace?: never | null;
  };
}
type webhooks = Record<string, never>;
interface components {
  schemas: {
    Don: {
      /** Format: int32 */
      id: number;
      /** Format: int32 */
      callNum: number;
      /** Format: int32 */
      status: number;
      /** Format: int32 */
      orderId: number;
      /** Format: int32 */
      size: number;
      /** Format: int32 */
      yasai: number;
      /** Format: int32 */
      ninniku: number;
      /** Format: int32 */
      karame: number;
      /** Format: int32 */
      abura: number;
      snsFollowed?: boolean | null;
      toppings?:
        | {
            /** Format: int32 */
            id: number;
            label: string;
            /** Format: int32 */
            amount: number;
          }[]
        | null;
    };
    Error: {
      /** @description エラーを簡潔に表現したコード */
      title: string;
      /** @description エラーの詳細ドキュメントを指すURL */
      type: string;
      /** @description HTTPステータスコード */
      status: number;
      /** @description 開発者向けの詳細文 */
      detail: string;
    };
    Option: {
      id: number;
      label: string;
    };
    Order: {
      /** Format: int32 */
      id: number;
      /** Format: int32 */
      callNum: number;
      /** Format: date-time */
      createdAt: Date;
      /** Format: int32 */
      donsCount: number;
      /** Format: int32 */
      cookingDonsCount: number;
      dons: components['schemas']['Don'][];
    };
    Topping: {
      /** Format: int32 */
      id?: number | null;
      label?: string | null;
      /** Format: int32 */
      price?: number | null;
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}
type $defs = Record<string, never>;
type operations = Record<string, never>;

export type { $defs, components, operations, paths, webhooks };
