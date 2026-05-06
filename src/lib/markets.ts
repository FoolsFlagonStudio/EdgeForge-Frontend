export function formatMarketName(market: string): string {
  return market
    .replace(/_alternate$/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
