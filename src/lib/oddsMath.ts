/**
 * Shared odds math — American <-> decimal <-> implied probability <-> fractional,
 * plus parlay/hedge helpers. Mirrors the same formulas used server-side
 * (nba-sgp-engine's various _pnl/_implied helpers) so numbers shown here
 * agree with what the backend reports.
 */

export function americanToDecimal(odds: number): number {
  return odds > 0 ? 1 + odds / 100 : 1 + 100 / Math.abs(odds);
}

export function decimalToAmerican(decimal: number): number {
  if (decimal <= 1) return 0;
  const profit = decimal - 1;
  return profit >= 1 ? Math.round(profit * 100) : Math.round(-100 / profit);
}

export function americanToImplied(odds: number): number {
  return odds > 0 ? 100 / (odds + 100) : Math.abs(odds) / (Math.abs(odds) + 100);
}

export function impliedToAmerican(prob: number): number {
  if (prob <= 0 || prob >= 1) return 0;
  return prob > 0.5 ? Math.round(-100 * (prob / (1 - prob))) : Math.round((100 * (1 - prob)) / prob);
}

/** Reduces a decimal odds value to a simplified "n/d" fractional string. */
export function decimalToFractional(decimal: number): string {
  const profit = decimal - 1;
  if (profit <= 0) return "0/1";
  const precision = 1000;
  let num = Math.round(profit * precision);
  let den = precision;
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const g = gcd(num, den) || 1;
  num /= g;
  den /= g;
  return `${num}/${den}`;
}

/** P&L on a single bet for a given stake, at American odds, if it wins. */
export function profitIfWon(stake: number, odds: number): number {
  return odds > 0 ? stake * (odds / 100) : stake * (100 / Math.abs(odds));
}

/** Combined decimal odds for a parlay of American-odds legs. */
export function parlayDecimalOdds(legOdds: number[]): number {
  return legOdds.reduce((acc, o) => acc * americanToDecimal(o), 1);
}

export function fmtOdds(odds: number): string {
  return odds > 0 ? `+${odds}` : `${odds}`;
}

export function fmtPct(p: number): string {
  return `${(p * 100).toFixed(1)}%`;
}

export function fmtUsd(n: number): string {
  const sign = n < 0 ? "-" : "";
  return `${sign}$${Math.abs(n).toFixed(2)}`;
}
