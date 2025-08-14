// OpenAPIにErrorスキーマが存在しないため、独自に定義
type ErrorSchema = {
  title: string;
  type: string;
  status: number;
  detail: string;
};

export default class ApiError extends Error {
  private _schema: ErrorSchema;

  constructor(_schema?: ErrorSchema) {
    super(_schema?.title);
    this.name = new.target.name;
    this._schema = _schema || this.internalProblems().schema;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  public invalidParams(detail?: string) {
    return new ApiError({
      title: 'INVAILD_PARAMS',
      type: 'about:blank',
      status: 400,
      detail: detail || 'This request contains invaild parameter. Please correct to the right ones.',
    });
  }

  public noUser(detail?: string) {
    return new ApiError({
      title: 'NO_USER',
      type: 'about:blank',
      status: 400,
      detail: detail || 'No user with such a user name and password.',
    });
  }

  public expiredToken(detail?: string) {
    return new ApiError({
      title: 'EXPIRED_TOKEN',
      type: 'about:blank',
      status: 401,
      detail: detail || 'This authorization token have expired. Please refetch token.',
    });
  }

  public invalidToken(detail?: string) {
    return new ApiError({
      title: 'INVAILD_TOKEN',
      type: 'about:blank',
      status: 401,
      detail: detail || 'This authorization token is invalid.',
    });
  }

  public noToken(detail?: string) {
    return new ApiError({
      title: 'NO_TOKEN',
      type: 'about:blank',
      status: 401,
      detail: detail || 'Authorization token was not found. Please set authorization header.',
    });
  }

  public accessDenied(detail?: string) {
    return new ApiError({
      title: 'ACCESS_DENIED',
      type: 'about:blank',
      status: 403,
      detail: detail || 'Access denied. Insufficient rights to access the resource.',
    });
  }

  public internalProblems() {
    return new ApiError({
      title: 'INTERNAL_PROBLEMS',
      type: 'about:blank',
      status: 500,
      detail: 'Something problems occured in server.',
    });
  }

  get schema(): ErrorSchema {
    return this._schema;
  }

  get title(): string {
    return this._schema.title;
  }

  get type(): string {
    return this._schema.title;
  }

  get status(): number {
    return this._schema.status;
  }

  get detail(): string {
    return this._schema.detail;
  }
}
