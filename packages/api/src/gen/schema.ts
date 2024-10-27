export interface paths {
    "/dons": {
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
                        "application/json": components["schemas"]["Don"][];
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
    "/dons/{id}": {
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
                        "application/json": components["schemas"]["Don"];
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
                    "application/json": {
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
                        "application/json": components["schemas"]["Don"];
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
    "/dons/price": {
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
                    "application/json": {
                        /** Format: int32 */
                        size: number;
                        toppings?: {
                            /** Format: int32 */
                            id: number;
                            /** Format: int32 */
                            amount: number;
                        }[] | null;
                        snsFollowed: boolean;
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
                        "application/json": {
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
    "/dons/status/": {
        parameters: {
            query?: never | null;
            header?: never | null;
            path?: never | null;
            cookie?: never | null;
        };
        /** @description 特定の状態の丼を取得する */
        get: {
            parameters: {
                query: {
                    status: number;
                    /** @description 取得件数上限 */
                    limit?: number | null;
                };
                header?: never | null;
                path?: never | null;
                cookie?: never | null;
            };
            requestBody?: never | null;
            responses: {
                /** @description 注文の一覧を正常に取得 */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Don"][];
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
    "/options": {
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
                        "application/json": components["schemas"]["Option"][];
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
    "/order": {
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
                    "application/json": {
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
                            toppings?: {
                                /** Format: int32 */
                                id: number;
                                label: string;
                                /** Format: int32 */
                                amount: number;
                            }[] | null;
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
                        "application/json": components["schemas"]["Order"];
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
    "/toppings": {
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
                        "application/json": components["schemas"]["Topping"][];
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
    "/toppings/available": {
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
                        "application/json": components["schemas"]["Topping"][];
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
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        Don: {
            /** Format: int32 */
            id: number;
            /** Format: int32 */
            callNum: number;
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
            toppings?: {
                /** Format: int32 */
                id: number;
                label: string;
                /** Format: int32 */
                amount: number;
            }[] | null;
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
            dons?: components["schemas"]["Don"][] | null;
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
export type $defs = Record<string, never>;
export type operations = Record<string, never>;