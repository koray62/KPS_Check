/**
 * lib/tckn.js
 * NVI matematiksel checksum algoritması
 */
export function validateTCKN(tc) {
  if (typeof tc !== 'string' || !/^\d{11}$/.test(tc)) return false;
  const d = tc.split('').map(Number);
  if (d[0] === 0) return false;
  const oddSum  = d[0]+d[2]+d[4]+d[6]+d[8];
  const evenSum = d[1]+d[3]+d[5]+d[7];
  if (((oddSum * 7) - evenSum) % 10 !== d[9]) return false;
  if (d.slice(0,10).reduce((a,b)=>a+b,0) % 10 !== d[10]) return false;
  return true;
}

export function tcknDetails(tc) {
  const d = tc.split('').map(Number);
  const oddSum  = d[0]+d[2]+d[4]+d[6]+d[8];
  const evenSum = d[1]+d[3]+d[5]+d[7];
  const sum10   = d.slice(0,10).reduce((a,b)=>a+b,0);
  return {
    firstDigitOk: d[0] !== 0,
    oddSum, evenSum,
    d10Expected: ((oddSum*7)-evenSum)%10, d10Actual: d[9],
    d10Ok: ((oddSum*7)-evenSum)%10 === d[9],
    d11Expected: sum10%10, d11Actual: d[10],
    d11Ok: sum10%10 === d[10],
    sum10
  };
}
