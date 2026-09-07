"use server";

import sharp from "sharp";
import { z } from "zod";

import { PERMISSIONS } from "@/constants/permissions";
import { mediaStorage } from "@/domains/media/storage";
import { requirePermission } from "@/server/auth/requirePermission";

import type { WatchFormValues } from "./watch-form.types";

const nullableString = z.string().nullable();

const aiSpecSchema = z.object({
  brandName: nullableString,
  model: nullableString,
  referenceNumber: nullableString,
  nickname: nullableString,
  yearText: nullableString,
  movementType: nullableString,
  style: nullableString,
  caseShape: nullableString,
  caseSizeMM: nullableString,
  lugToLugMM: nullableString,
  thicknessMM: nullableString,
  crystal: nullableString,
  dialColor: nullableString,
  calibre: nullableString,
  materialProfile: nullableString,
  primaryCaseMaterial: nullableString,
  secondaryCaseMaterial: nullableString,
  goldTreatment: nullableString,
  goldColors: z.array(z.string()),
  goldKarat: nullableString,
  braceletType: nullableString,
  strapMaterialText: nullableString,
  waterResistance: nullableString,
  powerReserve: nullableString,
  dialFinish: nullableString,
  buckleType: nullableString,
  materialNote: nullableString,
  confidenceNotes: z.array(z.string()),
});

export type AiWatchSpecSuggestion = z.infer<typeof aiSpecSchema>;

const jsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    brandName: { type: ["string", "null"] },
    model: { type: ["string", "null"] },
    referenceNumber: { type: ["string", "null"] },
    nickname: { type: ["string", "null"] },
    yearText: { type: ["string", "null"] },
    movementType: { type: ["string", "null"] },
    style: { type: ["string", "null"] },
    caseShape: { type: ["string", "null"] },
    caseSizeMM: { type: ["string", "null"] },
    lugToLugMM: { type: ["string", "null"] },
    thicknessMM: { type: ["string", "null"] },
    crystal: { type: ["string", "null"] },
    dialColor: { type: ["string", "null"] },
    calibre: { type: ["string", "null"] },
    materialProfile: { type: ["string", "null"] },
    primaryCaseMaterial: { type: ["string", "null"] },
    secondaryCaseMaterial: { type: ["string", "null"] },
    goldTreatment: { type: ["string", "null"] },
    goldColors: { type: "array", items: { type: "string" } },
    goldKarat: { type: ["string", "null"] },
    braceletType: { type: ["string", "null"] },
    strapMaterialText: { type: ["string", "null"] },
    waterResistance: { type: ["string", "null"] },
    powerReserve: { type: ["string", "null"] },
    dialFinish: { type: ["string", "null"] },
    buckleType: { type: ["string", "null"] },
    materialNote: { type: ["string", "null"] },
    confidenceNotes: { type: "array", items: { type: "string" } },
  },
  required: [
    "brandName", "model", "referenceNumber", "nickname", "yearText", "movementType",
    "style", "caseShape", "caseSizeMM", "lugToLugMM", "thicknessMM",
    "crystal", "dialColor", "calibre", "materialProfile",
    "primaryCaseMaterial", "secondaryCaseMaterial", "goldTreatment",
    "goldColors", "goldKarat", "braceletType", "strapMaterialText",
    "waterResistance", "powerReserve", "dialFinish", "buckleType",
    "materialNote", "confidenceNotes",
  ],
} as const;

const ALLOWED_VALUES = {
  movementType: ["AUTOMATIC", "HAND_WOUND", "QUARTZ", "SOLAR", "KINETIC", "MECHAQUARTZ", "SPRING_DRIVE", "HYBRID"],
  style: ["MILITARY", "DRESS", "SPORT", "TOOL", "CASUAL", "CLASSIC", "MINIMALIST", "LUXURY", "RETRO", "FUTURISTIC"],
  caseShape: ["ROUND", "TANK", "SQUARE", "SPECIAL", "OTHER", "TONNEAU", "CUSHION", "OVAL", "ASYMMETRICAL", "OCTAGON", "POLYGON"],
  crystal: ["SAPPHIRE", "ACRYLIC", "MINERAL", "HARDLEX", "AR_COATED"],
  materialProfile: ["SINGLE_MATERIAL", "BIMETAL", "COATED", "OTHER"],
  caseMaterial: ["STAINLESS_STEEL", "TITANIUM", "CERAMIC", "CARBON", "GOLD", "PLATINUM", "SILVER", "BRASS", "OTHER"],
  goldTreatment: ["SOLID_GOLD", "CAPPED_GOLD", "GOLD_PLATED", "GOLD_VERMEIL", "GOLD_FILLED"],
  goldColor: ["YELLOW", "WHITE", "ROSE", "MIXED"],
  braceletType: ["LEATHER", "BRACELET", "RUBBER", "NATO", "CANVASS", "SPECIAL"],
};

function cleanKeys(keys: string[]) {
  return Array.from(new Set(keys.map((key) => String(key).trim()).filter(Boolean))).slice(0, 3);
}

async function imageDataUrl(key: string) {
  const media = await mediaStorage.read(key);
  const bytes = await sharp(Buffer.from(media.bytes))
    .rotate()
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82 })
    .toBuffer();
  return `data:image/jpeg;base64,${bytes.toString("base64")}`;
}

type OpenAIResponsePayload = {
  output_text?: unknown;
  output?: Array<{
    content?: Array<{ type?: unknown; text?: unknown }>;
    action?: { sources?: Array<{ title?: unknown; url?: unknown }> };
  }>;
  error?: { message?: unknown };
};

export type AiWatchSpecResearchSource = {
  title: string;
  url: string;
};

function extractOutputText(response: OpenAIResponsePayload | null) {
  if (typeof response?.output_text === "string") return response.output_text;
  for (const item of response?.output ?? []) {
    for (const content of item?.content ?? []) {
      if (content?.type === "output_text" && typeof content?.text === "string") {
        return content.text;
      }
    }
  }
  return "";
}

function extractResearchSources(response: OpenAIResponsePayload | null) {
  const byUrl = new Map<string, AiWatchSpecResearchSource>();
  for (const item of response?.output ?? []) {
    for (const source of item.action?.sources ?? []) {
      if (typeof source.url !== "string" || !source.url.startsWith("http")) continue;
      const title = typeof source.title === "string" && source.title.trim()
        ? source.title.trim()
        : new URL(source.url).hostname;
      byUrl.set(source.url, { title, url: source.url });
    }
  }
  return Array.from(byUrl.values()).slice(0, 5);
}

export async function suggestWatchSpecWithOpenAIAction(input: {
  current: Pick<WatchFormValues, "basic" | "spec">;
  brandName: string;
  availableBrandNames: string[];
  imageKeys: string[];
}) {
  await requirePermission(PERMISSIONS.PRODUCT_UPDATE);

  const apiKey = String(process.env.OPENAI_API_KEY ?? "").trim();
  const model = String(process.env.OPENAI_PRODUCT_CONTENT_MODEL ?? "").trim() || "gpt-4o-mini";
  if (!apiKey) throw new Error("OpenAI chưa được cấu hình (thiếu OPENAI_API_KEY).");

  const keys = cleanKeys(input.imageKeys);
  if (!keys.length) throw new Error("Cần ít nhất một ảnh của watch để AI đọc thông số.");

  const images = await Promise.all(keys.map(imageDataUrl));
  const currentFacts = {
    brandName: input.brandName,
    availableBrandNames: input.availableBrandNames
      .map((name) => String(name).trim())
      .filter(Boolean)
      .slice(0, 200),
    title: input.current.basic.title,
    yearText: input.current.basic.yearText,
    movementType: input.current.basic.movementType,
    style: input.current.basic.style,
    spec: input.current.spec,
  };

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      store: false,
      tools: [{ type: "web_search" }],
      tool_choice: "required",
      include: ["web_search_call.action.sources"],
      instructions: [
        "You extract watch specifications for an inventory reviewer.",
        "First inspect every supplied image for logos, dial text, case-back markings, reference fragments, calibre markings, and distinctive design features. Then search the web using those clues before producing the final JSON.",
        "Cross-check candidate identity and catalog specifications against at least two independent sources when possible. Prefer manufacturer, catalog, auction archive, and established watch database sources.",
        "Prioritize identifying brandName, model, referenceNumber, yearText, and caseSizeMM before secondary fields.",
        "Distinguish the manufacturer brand from a collection or dial name. For example, a collection name printed prominently on the dial must not replace its manufacturer brand.",
        "For brandName, return the closest exact name from availableBrandNames whenever a match exists. If no match exists, return the concise canonical brand name you identified so the user can review and create it; return null only when the brand cannot be identified.",
        "Use visible evidence, supplied current facts, and web research. You may use a catalog specification only when the matched reference or model variant is strong; add a Vietnamese confidenceNotes warning for every inferred, approximate, or conflicting value.",
        "Never fabricate a reference, calibre, year, or dimension. Return null when identification is insufficient or conflicting. Keep dimensions as numeric strings without units.",
        `Enum values must come from: ${JSON.stringify(ALLOWED_VALUES)}.`,
        "confidenceNotes must be short Vietnamese warnings for every uncertain or inferred value.",
      ].join(" "),
      input: [{
        role: "user",
        content: [
          { type: "input_text", text: `Current inventory facts:\n${JSON.stringify(currentFacts)}` },
          ...images.map((image_url) => ({ type: "input_image", image_url, detail: "high" })),
        ],
      }],
      text: {
        format: {
          type: "json_schema",
          name: "watch_spec_suggestion",
          strict: true,
          schema: jsonSchema,
        },
      },
    }),
  });

  const payload = await response.json().catch(() => null) as OpenAIResponsePayload | null;
  if (!response.ok) {
    const errorMessage = payload?.error?.message;
    throw new Error(
      typeof errorMessage === "string"
        ? errorMessage
        : `OpenAI trả về lỗi ${response.status}.`,
    );
  }

  const outputText = extractOutputText(payload);
  if (!outputText) throw new Error("OpenAI không trả về bản nháp thông số.");
  return {
    ...aiSpecSchema.parse(JSON.parse(outputText)),
    researchSources: extractResearchSources(payload),
  };
}
