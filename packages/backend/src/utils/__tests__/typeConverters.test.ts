import { describe, it, expect } from 'vitest';
import { bigint2number } from '../typeConverters';

describe('bigint2number', () => {
  it('converts bigint within safe range to number', () => {
    const value = BigInt(123);
    expect(bigint2number(value)).toBe(123);
  });

  it('throws error when bigint exceeds safe range', () => {
    const big = BigInt(Number.MAX_SAFE_INTEGER) + BigInt(1);
    expect(() => bigint2number(big)).toThrow('BigIntの値がNumberの安全な範囲を超えています');
  });
});
