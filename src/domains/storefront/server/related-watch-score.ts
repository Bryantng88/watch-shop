export type RelatedWatchSignal = {
  productId: string;
  siteChannel: string | null;
  price: number | null;
  audience: string | null;
  style: string | null;
  brandId: string | null;
  caseSizeMm: number | null;
  movement: string | null;
  yearText: string | null;
  updatedAt: Date;
};

export type ScoredRelatedWatch<T extends RelatedWatchSignal> = {
  item: T;
  score: number;
  priceDistance: number;
};

function decade(value: string | null) {
  const year = value?.match(/(?:18|19|20)\d{2}/)?.[0];
  return year ? Math.floor(Number(year) / 10) * 10 : null;
}

function proximityScore(a: number | null, b: number | null, maximum: number) {
  if (!a || !b) return 0;
  const ratio = Math.abs(a - b) / Math.max(a, b);
  return Math.max(0, maximum * (1 - Math.min(ratio, 1)));
}

function pairScore(candidate: RelatedWatchSignal, selected: RelatedWatchSignal) {
  let score = 0;
  if (candidate.siteChannel && candidate.siteChannel === selected.siteChannel) score += 30;
  score += proximityScore(candidate.price, selected.price, 25);
  if (candidate.audience && candidate.audience === selected.audience) score += 15;
  if (candidate.style && candidate.style === selected.style) score += 12;
  if (candidate.brandId && candidate.brandId === selected.brandId) score += 8;
  if (candidate.caseSizeMm !== null && selected.caseSizeMm !== null) {
    score += Math.max(0, 5 - Math.abs(candidate.caseSizeMm - selected.caseSizeMm));
  }
  if (candidate.movement && candidate.movement === selected.movement) score += 3;
  const candidateDecade = decade(candidate.yearText);
  if (candidateDecade !== null && candidateDecade === decade(selected.yearText)) score += 2;
  return score;
}

function closestPriceDistance(candidate: RelatedWatchSignal, selected: RelatedWatchSignal[]) {
  if (!candidate.price) return Number.POSITIVE_INFINITY;
  const distances = selected
    .map((item) => item.price ? Math.abs(candidate.price! - item.price) : Number.POSITIVE_INFINITY);
  return Math.min(...distances);
}

export function rankRelatedWatches<T extends RelatedWatchSignal>(
  candidates: T[],
  selected: RelatedWatchSignal[],
  limit = 4,
): ScoredRelatedWatch<T>[] {
  if (!selected.length || limit <= 0) return [];
  const excluded = new Set(selected.map((item) => item.productId));
  const remaining = candidates
    .filter((item) => !excluded.has(item.productId))
    .map((item) => ({
      item,
      score: Math.max(...selected.map((chosen) => pairScore(item, chosen))),
      priceDistance: closestPriceDistance(item, selected),
    }));
  const result: ScoredRelatedWatch<T>[] = [];

  while (remaining.length && result.length < limit) {
    remaining.sort((a, b) => {
      const diversityPenalty = (entry: ScoredRelatedWatch<T>) => result.reduce((penalty, chosen) => {
        if (entry.item.brandId && entry.item.brandId === chosen.item.brandId) penalty += 12;
        if (entry.item.style && entry.item.style === chosen.item.style) penalty += 6;
        return penalty;
      }, 0);
      const scoreDifference = (b.score - diversityPenalty(b)) - (a.score - diversityPenalty(a));
      if (scoreDifference !== 0) return scoreDifference;
      if (a.priceDistance !== b.priceDistance) return a.priceDistance - b.priceDistance;
      const updatedDifference = b.item.updatedAt.getTime() - a.item.updatedAt.getTime();
      return updatedDifference || a.item.productId.localeCompare(b.item.productId);
    });
    result.push(remaining.shift()!);
  }
  return result;
}
