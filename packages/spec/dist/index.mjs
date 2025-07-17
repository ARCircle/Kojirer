// src/ApiError.ts
var ApiError = class _ApiError extends Error {
  constructor(_schema) {
    super(_schema?.title);
    this.name = new.target.name;
    this._schema = _schema || this.internalProblems().schema;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
  invalidParams(detail) {
    return new _ApiError({
      title: "INVAILD_PARAMS",
      type: "about:blank",
      status: 400,
      detail: detail || "This request contains invaild parameter. Please correct to the right ones."
    });
  }
  noUser(detail) {
    return new _ApiError({
      title: "NO_USER",
      type: "about:blank",
      status: 400,
      detail: detail || "No user with such a user name and password."
    });
  }
  expiredToken(detail) {
    return new _ApiError({
      title: "EXPIRED_TOKEN",
      type: "about:blank",
      status: 401,
      detail: detail || "This authorization token have expired. Please refetch token."
    });
  }
  invalidToken(detail) {
    return new _ApiError({
      title: "INVAILD_TOKEN",
      type: "about:blank",
      status: 401,
      detail: detail || "This authorization token is invalid."
    });
  }
  noToken(detail) {
    return new _ApiError({
      title: "NO_TOKEN",
      type: "about:blank",
      status: 401,
      detail: detail || "Authorization token was not found. Please set authorization header."
    });
  }
  accessDenied(detail) {
    return new _ApiError({
      title: "ACCESS_DENIED",
      type: "about:blank",
      status: 403,
      detail: detail || "Access denied. Insufficient rights to access the resource."
    });
  }
  internalProblems() {
    return new _ApiError({
      title: "INTERNAL_PROBLEMS",
      type: "about:blank",
      status: 500,
      detail: "Something problems occured in server."
    });
  }
  get schema() {
    return this._schema;
  }
  get title() {
    return this._schema.title;
  }
  get type() {
    return this._schema.title;
  }
  get status() {
    return this._schema.status;
  }
  get detail() {
    return this._schema.detail;
  }
};

// src/index.ts
var src_default = paths;
export {
  ApiError,
  src_default as default
};
