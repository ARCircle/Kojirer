import { components, paths } from './schema.js';

type ErrorSchema = components["schemas"]["Error"];
declare class ApiError extends Error {
    private _schema;
    constructor(_schema?: ErrorSchema);
    invalidParams(detail?: string): ApiError;
    noUser(detail?: string): ApiError;
    expiredToken(detail?: string): ApiError;
    invalidToken(detail?: string): ApiError;
    noToken(detail?: string): ApiError;
    accessDenied(detail?: string): ApiError;
    internalProblems(): ApiError;
    get schema(): ErrorSchema;
    get title(): string;
    get type(): string;
    get status(): number;
    get detail(): string;
}

export { ApiError, paths as default };
