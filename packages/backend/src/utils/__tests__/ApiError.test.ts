import { describe, it, expect } from 'vitest';
import { ApiError } from '../ApiError';

describe('ApiError', () => {
  it('has default internal error when no schema provided', () => {
    const err = new ApiError();
    expect(err.title).toBe('INTERNAL_PROBLEMS');
    expect(err.status).toBe(500);
  });

  it('invalidParams returns ApiError with 400 status', () => {
    const err = ApiError.invalidParams('invalid');
    expect(err.title).toBe('INVAILD_PARAMS');
    expect(err.status).toBe(400);
    expect(err.detail).toBe('invalid');
  });
});
