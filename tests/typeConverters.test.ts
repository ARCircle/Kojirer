import test from 'node:test';
import assert from 'node:assert/strict';
import { bigint2number } from '../packages/backend/src/utils/typeConverters';

test('bigint2number returns number within safe range', () => {
  const result = bigint2number(123n);
  assert.strictEqual(result, 123);
});

test('bigint2number throws when value exceeds safe range', () => {
  const value = BigInt(Number.MAX_SAFE_INTEGER) + 1n;
  assert.throws(() => bigint2number(value));
});
