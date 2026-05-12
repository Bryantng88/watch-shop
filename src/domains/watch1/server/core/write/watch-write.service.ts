import { prisma } from "@/server/db/client";
import {
  assertWatchWritable,
  validateWatchPricingInput,
} from "../../shared";
import type {
  CreateWatchDraftInput,
  UpdateWatchCoreInput,
  UpdateWatchPricingInput,
} from "../../shared";
import {
  createWatchDraftRepo,
  removeWatchRepo,
  updateWatchCoreRepo,
  upsertWatchPriceRepo,
  getWatchForDerivedRepo,
  listProductSkusByPrefixRepo,
  updateProductTitleSkuRepo,
} from "./watch-write.repo";

function cleanText(value?: string | null) {
  const text = String(value ?? "").trim();
  return text || null;
}

function normalizeMovementLabel(value?: string | null) {
  const text = cleanText(value)?.toUpperCase();

  switch (text) {
    case "AUTOMATIC":
      return "Automatic";
    case "HAND_WOUND":
      return "Hand-wound";
    case "QUARTZ":
      return "Quartz";
    case "SOLAR":
      return "Solar";
    case "KINETIC":
      return "Kinetic";
    case "MECHAQUARTZ":
      return "Mechaquartz";
    case "SPRING_DRIVE":
      return "Spring Drive";
    case "HYBRID":
      return "Hybrid";
    default:
      return cleanText(value);
  }
}

function buildWatchTitle(input: {
  brand?: string | null;
  model?: string | null;
  movement?: string | null;
  dialColor?: string | null;
}) {
  const brand = cleanText(input.brand) ?? "Unknown brand";
  const model = cleanText(input.model) ?? "model unknown";
  const movement = normalizeMovementLabel(input.movement) ?? "movement unknown";
  const dialColor = cleanText(input.dialColor);

  return [brand, model, movement, dialColor].filter(Boolean).join(" ");
}

function normalizeBrandText(value?: string | null) {
  return String(value ?? "")
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function buildWatchSkuPrefix(brandName?: string | null) {
  const normalized = normalizeBrandText(brandName);
  if (!normalized) return "UNK";

  const words = normalized
    .split(/\s+/)
    .map((w) => w.replace(/[^A-Z0-9]/g, ""))
    .filter(Boolean);

  if (!words.length) return "UNK";

  const known: Record<string, string> = {
    OMEGA: "OME",
    ROLEX: "RLX",
    LONGINES: "LNG",
    ORIS: "ORI",
    EXACTLY: "XCT",
    "RAYMOND WEIL": "RMW",
    SEIKO: "SEI",
    CITIZEN: "CTZ",
    CARTIER: "CAR",
    TISSOT: "TIS",
    BULOVA: "BLV",
  };

  const joined = words.join(" ");
  if (known[joined]) return known[joined];
  if (known[words[0]]) return known[words[0]];

  if (words.length >= 2) {
    return words.map((w) => w[0]).join("").slice(0, 3).padEnd(3, "X");
  }

  const single = words[0];
  if (single.length <= 3) return single.padEnd(3, "X");

  const consonants = single.replace(/[AEIOUY]/g, "");
  if (consonants.length >= 3) return consonants.slice(0, 3);

  return single.slice(0, 3).padEnd(3, "X");
}

function formatSkuDate(date = new Date()) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = String(date.getFullYear());
  return `${dd}${mm}${yyyy}`;
}

function padSkuSeq(value: number) {
  return String(value).padStart(3, "0");
}

function shouldRegenerateSku(currentSku?: string | null) {
  const sku = String(currentSku ?? "").trim();
  if (!sku) return true;

  // format mới chuẩn
  if (/^[A-Z0-9]{3}-\d{8}-\d{3}$/i.test(sku)) {
    return false;
  }

  // format cũ / lỗi / tạm
  if (
    /^W-\d{4}-\d{4}$/i.test(sku) ||
    /^WAT-\d{4}-\d{4}$/i.test(sku) ||
    /^PRD-\d{4}-\d{4}$/i.test(sku)
  ) {
    return true;
  }

  return true;
}

async function genUniqueWatchSku(
  tx: any,
  input: {
    brandName?: string | null;
    date?: Date;
  }
) {
  const prefix = buildWatchSkuPrefix(input.brandName);
  const datePart = formatSkuDate(input.date ?? new Date());
  const rows = await listProductSkusByPrefixRepo(tx, prefix, datePart);

  let maxSeq = 0;
  const base = `${prefix}-${datePart}`;

  for (const row of rows) {
    const match = row.sku?.match(new RegExp(`^${base}-(\\d{3})$`));
    if (!match) continue;

    const seq = Number(match[1]);
    if (Number.isFinite(seq) && seq > maxSeq) {
      maxSeq = seq;
    }
  }

  return `${base}-${padSkuSeq(maxSeq + 1)}`;
}

export async function createWatchDraft(input: CreateWatchDraftInput) {
  return createWatchDraftRepo(prisma as any, input as any);
}

export async function updateWatchCore(
  productId: string,
  input: UpdateWatchCoreInput
) {
  if ((input as any).status) {
    assertWatchWritable((input as any).status === "SOLD" ? "SOLD" : null);
  }

  return updateWatchCoreRepo(prisma as any, productId, input as any);
}

export async function updateWatchPricing(
  productId: string,
  input: UpdateWatchPricingInput
) {
  validateWatchPricingInput(input);
  return upsertWatchPriceRepo(prisma as any, productId, input as any);
}

export async function removeWatch(productId: string) {
  return removeWatchRepo(prisma as any, productId);
}

export async function regenerateWatchTitleAndSku(productId: string) {
  const watch = await getWatchForDerivedRepo(prisma as any, productId);

  if (!watch || !watch.product) {
    throw new Error("Watch not found");
  }

  return prisma.$transaction(async (tx) => {
    const brandName =
      watch.product.brand?.name ??
      watch.watchSpecV2?.brand ??
      null;

    const title = buildWatchTitle({
      brand: brandName,
      model: watch.watchSpecV2?.model ?? null,
      movement:
        (watch.watchSpecV2?.movementType
          ? String(watch.watchSpecV2.movementType)
          : null) ??
        (watch.movementType ? String(watch.movementType) : null),
      dialColor: watch.watchSpecV2?.dialColor ?? null,
    });

    const nextSku = shouldRegenerateSku(watch.product.sku)
      ? await genUniqueWatchSku(tx, {
        brandName,
        date: new Date(),
      })
      : undefined;

    await updateProductTitleSkuRepo(tx, {
      productId,
      title,
      sku: nextSku,
    });

    return {
      title,
      sku: nextSku ?? watch.product.sku ?? null,
    };
  });
}

export async function applyWatchTitleAndSkuForSpec(
  tx: any,
  input: {
    productId: string;
    currentSku?: string | null;
    currentBrandId?: string | null;
    resolvedBrandId?: string | null;
    brandName?: string | null;
    model?: string | null;
    movement?: string | null;
    dialColor?: string | null;
    acquiredAt?: Date | null;
  }
) {
  const title = buildWatchTitle({
    brand: input.brandName,
    model: input.model,
    movement: input.movement,
    dialColor: input.dialColor,
  });

  const nextSku = shouldRegenerateSku(input.currentSku)
    ? await genUniqueWatchSku(tx, {
      brandName: input.brandName,
      date: input.acquiredAt ?? new Date(),
    })
    : undefined;

  await updateProductTitleSkuRepo(tx, {
    productId: input.productId,
    title,
    sku: nextSku,
    brandId:
      !input.currentBrandId && input.resolvedBrandId
        ? input.resolvedBrandId
        : undefined,
  });

  return {
    title,
    sku: nextSku ?? input.currentSku ?? null,
  };
}