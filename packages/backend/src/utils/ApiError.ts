type ErrorSchema = {
  title: string,
  type: string,
  status: number,
  detail: string,
}

export class ApiError extends Error {
  private _schema: ErrorSchema;

  constructor(_schema?: ErrorSchema) {
    super(_schema?.title);
    this.name = new.target.name;
    this._schema = _schema || {
      title: "INTERNAL_PROBLEMS",
      type: "about:blank",
      status: 500,
      detail: "Something problems occured in server.",
    }

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  public static invalidParams(detail?: string) {
    return new ApiError({
      title: "INVAILD_PARAMS",
      type: "about:blank",
      status: 400,
      detail: detail || "This request contains invaild parameter. Please correct to the right ones.",
    });
  }

  public static internalProblems() {
    return new ApiError({
      title: "INTERNAL_PROBLEMS",
      type: "about:blank",
      status: 500,
      detail: "Something problems occured in server.",
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