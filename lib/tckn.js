/**
 * Local TCKN checksum validation (NVI algoritması)
 * Runs before KPS call to avoid unnecessary network requests.
 * Returns true if the number passes all mathematical checks.
 */
export function validateTCKN(tc) {
  if (typeof tc !== 'string' || !/^\d{11}$/.test(tc)) return false;
  const d = tc.split('').map(Number);

  // Rule 1: first digit cannot be 0
  if (d[0] === 0) return false;

  // Rule 2: 10th digit = ((odd positions × 7) - even positions) mod 10
  const oddSum  = d[0] + d[2] + d[4] + d[6] + d[8];
  const evenSum = d[1] + d[3] + d[5] + d[7];
  if (((oddSum * 7) - evenSum) % 10 !== d[9]) return false;

  // Rule 3: 11th digit = sum of first 10 digits mod 10
  const sum10 = d.slice(0, 10).reduce((a, b) => a + b, 0);
  if (sum10 % 10 !== d[10]) return false;

  return true;
}
