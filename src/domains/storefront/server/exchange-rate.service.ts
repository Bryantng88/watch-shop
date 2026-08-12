const VCB_XML_URL = "https://www.vietcombank.com.vn/ExchangeRates/ExrateXML.aspx";
const FALLBACK_USD_SELL_RATE = 26_500;

export type StorefrontExchangeRate = { vndPerUsd: number; source: "VIETCOMBANK" | "FALLBACK" };

export async function getStorefrontUsdRate(): Promise<StorefrontExchangeRate> {
  try {
    const response = await fetch(VCB_XML_URL, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error(`VCB ${response.status}`);
    const xml = await response.text();
    const usd = xml.match(/<Exrate[^>]*CurrencyCode="USD"[^>]*Sell="([^"]+)"/i);
    const rate = Number(usd?.[1]?.replaceAll(",", ""));
    if (!Number.isFinite(rate) || rate <= 0) throw new Error("Invalid VCB USD rate");
    return { vndPerUsd: rate, source: "VIETCOMBANK" };
  } catch {
    return { vndPerUsd: FALLBACK_USD_SELL_RATE, source: "FALLBACK" };
  }
}
