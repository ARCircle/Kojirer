interface paths {
    "/customizes": {
        parameters: {
            query?: never | null;
            header?: never | null;
            path?: never | null;
            cookie?: never | null;
        };
        /** すべてのCustomizeを返す */
        get: operations["getCustomizes"];
        put?: never | null;
        post?: never | null;
        delete?: never | null;
        options?: never | null;
        head?: never | null;
        patch?: never | null;
        trace?: never | null;
    };
    "/dons": {
        parameters: {
            query?: never | null;
            header?: never | null;
            path?: never | null;
            cookie?: never | null;
        };
        /** 現在アクティブな丼を取得 */
        get: operations["getActiveDons"];
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
        /**
         * 特定の丼の詳細を取得
         * @description 特定のidの丼の詳細を取得
         */
        get: operations["getDonById"];
        put?: never | null;
        post?: never | null;
        delete?: never | null;
        options?: never | null;
        head?: never | null;
        patch?: never | null;
        trace?: never | null;
    };
    "/price": {
        parameters: {
            query?: never | null;
            header?: never | null;
            path?: never | null;
            cookie?: never | null;
        };
        get?: never | null;
        put?: never | null;
        /**
         * 注文の値段を算出
         * @description 注文の値段の総計を取得
         */
        post: operations["calculatePrice"];
        delete?: never | null;
        options?: never | null;
        head?: never | null;
        patch?: never | null;
        trace?: never | null;
    };
    "/dons/cooking": {
        parameters: {
            query?: never | null;
            header?: never | null;
            path?: never | null;
            cookie?: never | null;
        };
        get?: never | null;
        put?: never | null;
        /**
         * 丼を調理中に変更
         * @description `Don`の`status`を`cooking`に変更
         */
        post: operations["setCookingDon"];
        delete?: never | null;
        options?: never | null;
        head?: never | null;
        patch?: never | null;
        trace?: never | null;
    };
    "/dons/cooked": {
        parameters: {
            query?: never | null;
            header?: never | null;
            path?: never | null;
            cookie?: never | null;
        };
        get?: never | null;
        put?: never | null;
        /**
         * 丼を調理完了に変更
         * @description `Don`の`status`を`cooked`に変更
         */
        post: operations["setCookedDon"];
        delete?: never | null;
        options?: never | null;
        head?: never | null;
        patch?: never | null;
        trace?: never | null;
    };
    "/dons/delivered": {
        parameters: {
            query?: never | null;
            header?: never | null;
            path?: never | null;
            cookie?: never | null;
        };
        get?: never | null;
        put?: never | null;
        /**
         * 丼を受け渡す
         * @description `Don`の`status`を`delivered`に変更
         */
        post: operations["deliverDon"];
        delete?: never | null;
        options?: never | null;
        head?: never | null;
        patch?: never | null;
        trace?: never | null;
    };
    "/dons/cancel": {
        parameters: {
            query?: never | null;
            header?: never | null;
            path?: never | null;
            cookie?: never | null;
        };
        get?: never | null;
        put?: never | null;
        /**
         * 丼をキャンセルする
         * @description `Don`の`status`を`cancel`に変更
         */
        post: operations["cancelDon"];
        delete?: never | null;
        options?: never | null;
        head?: never | null;
        patch?: never | null;
        trace?: never | null;
    };
    "/orders/{id}": {
        parameters: {
            query?: never | null;
            header?: never | null;
            path?: never | null;
            cookie?: never | null;
        };
        /**
         * 特定の注文の詳細を取得
         * @description 特定の注文の詳細を取得
         */
        get: operations["getOrderById"];
        put?: never | null;
        post?: never | null;
        delete?: never | null;
        options?: never | null;
        head?: never | null;
        patch?: never | null;
        trace?: never | null;
    };
    "/orders": {
        parameters: {
            query?: never | null;
            header?: never | null;
            path?: never | null;
            cookie?: never | null;
        };
        get?: never | null;
        put?: never | null;
        /**
         * 注文を作成
         * @description 新しい注文を作成する
         */
        post: operations["createOrder"];
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
        Customizes: components["schemas"]["Customize"];
        Dons: components["schemas"]["Don"];
        Orders: components["schemas"]["Order"];
        CustomizeKind: {
            /** Format: uuid */
            id: string;
            label: string;
            available: boolean;
        };
        Customize: {
            /** Format: uuid */
            id: string;
            label: string;
            available: boolean;
            isDiscount: boolean;
        };
        ActiveDon: {
            /** Format: uuid */
            id: string;
            /** @enum {string} */
            status: "ordered" | "cooking" | "cooked";
            /** Format: uuid */
            orderId: string;
            /** Format: date-time */
            createDatetime: Date;
            /** Format: date-time */
            updateDatetime: Date;
            customizes?: components["schemas"]["Customize"][] | null;
        };
        Don: {
            /** Format: uuid */
            id: string;
            /** @enum {string} */
            status: "ordered" | "cooking" | "cooked" | "delivered" | "cancelled";
            /** Format: uuid */
            orderId: string;
            /** Format: date-time */
            createDatetime: Date;
            /** Format: date-time */
            updateDatetime: Date;
            customizes?: components["schemas"]["Customize"][] | null;
        };
        Order: {
            /** Format: uuid */
            id: string;
            /** Format: date-time */
            createDatetime: Date;
            callNum: number;
            /** @enum {string} */
            status?: ("ordered" | "ready" | "delivered" | "cancelled") | null;
            dons: components["schemas"]["Don"][];
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
type $defs = Record<string, never>;
interface operations {
    getCustomizes: {
        parameters: {
            query?: never | null;
            header?: never | null;
            path?: never | null;
            cookie?: never | null;
        };
        requestBody?: never | null;
        responses: {
            /** @description すべてのCustomizeを返す */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CustomizeKind"][];
                };
            };
            /** @description 不正なリクエスト */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Invalid request */
                        error?: string | null;
                    };
                };
            };
        };
    };
    getActiveDons: {
        parameters: {
            query?: never | null;
            header?: never | null;
            path?: never | null;
            cookie?: never | null;
        };
        requestBody?: never | null;
        responses: {
            /** @description アクティブな丼の一覧を返す */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ActiveDon"][];
                };
            };
            /** @description 不正なリクエスト */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Invalid request */
                        error?: string | null;
                    };
                };
            };
        };
    };
    getDonById: {
        parameters: {
            query?: never | null;
            header?: never | null;
            path: {
                id: string;
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
            /** @description 不正なリクエスト */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Invalid request */
                        error?: string | null;
                    };
                };
            };
        };
    };
    calculatePrice: {
        parameters: {
            query?: never | null;
            header?: never | null;
            path?: never | null;
            cookie?: never | null;
        };
        requestBody: {
            content: {
                "application/json": {
                    customize: [
                        components["schemas"]["Customize"]
                    ];
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
            /** @description 不正なリクエスト */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Invalid request */
                        error?: string | null;
                    };
                };
            };
        };
    };
    setCookingDon: {
        parameters: {
            query?: never | null;
            header?: never | null;
            path?: never | null;
            cookie?: never | null;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** Format: uuid */
                    donId: string;
                };
            };
        };
        responses: {
            /** @description 当該`Don`を返す */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Don"];
                };
            };
            /** @description 不正なリクエスト */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Invalid request */
                        error?: string | null;
                    };
                };
            };
        };
    };
    setCookedDon: {
        parameters: {
            query?: never | null;
            header?: never | null;
            path?: never | null;
            cookie?: never | null;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** Format: uuid */
                    donId: string;
                };
            };
        };
        responses: {
            /** @description 当該`Don`を返す */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Don"];
                };
            };
            /** @description 不正なリクエスト */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Invalid request */
                        error?: string | null;
                    };
                };
            };
        };
    };
    deliverDon: {
        parameters: {
            query?: never | null;
            header?: never | null;
            path?: never | null;
            cookie?: never | null;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** Format: uuid */
                    donId: string;
                };
            };
        };
        responses: {
            /** @description 当該`Don`を返す */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Don"];
                };
            };
            /** @description 不正なリクエスト */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Invalid request */
                        error?: string | null;
                    };
                };
            };
        };
    };
    cancelDon: {
        parameters: {
            query?: never | null;
            header?: never | null;
            path?: never | null;
            cookie?: never | null;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** Format: uuid */
                    donId: string;
                };
            };
        };
        responses: {
            /** @description 当該`Don`を返す */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Don"];
                };
            };
            /** @description 不正なリクエスト */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Invalid request */
                        error?: string | null;
                    };
                };
            };
        };
    };
    getOrderById: {
        parameters: {
            query?: never | null;
            header?: never | null;
            path: {
                id: string;
            };
            cookie?: never | null;
        };
        requestBody?: never | null;
        responses: {
            /** @description 注文の詳細を返す */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Order"];
                };
            };
            /** @description 不正なリクエスト */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Invalid request */
                        error?: string | null;
                    };
                };
            };
        };
    };
    createOrder: {
        parameters: {
            query?: never | null;
            header?: never | null;
            path?: never | null;
            cookie?: never | null;
        };
        requestBody: {
            content: {
                "application/json": {
                    numSnsFollowed: number;
                    callNum: number;
                    dons: {
                        customizes?: [
                            components["schemas"]["Customize"]
                        ] | null;
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
                    "application/json": {
                        /** Format: int32 */
                        price?: number | null;
                    };
                };
            };
            /** @description 不正なリクエスト */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Invalid request */
                        error?: string | null;
                    };
                };
            };
        };
    };
}

export type { $defs, components, operations, paths, webhooks };
