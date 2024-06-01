// bigint2number converts a bigint to a number if it is within the safe integer range, otherwise it returns null.
function bigint2number(value: bigint): number {
  const maxSafeInteger = BigInt(Number.MAX_SAFE_INTEGER);
  const minSafeInteger = BigInt(Number.MIN_SAFE_INTEGER);

  if (value <= maxSafeInteger && value >= minSafeInteger) {
    return Number(value);
  } else {
    throw new Error('BigIntの値がNumberの安全な範囲を超えています');
  }
}
