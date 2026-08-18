import { z } from "zod";

export const PUBLIC_CATALOG_DEFAULT_PAGE_SIZE = 24;
export const PUBLIC_CATALOG_MAX_PAGE_SIZE = 48;

const optionalQueryText = (maxLength: number) =>
  z.preprocess(
    (value) => typeof value === "string" && value.trim() === "" ? undefined : value,
    z.string().trim().min(1).max(maxLength).optional(),
  );

const optionalMoney = z.preprocess(
  (value) => value === "" || value === null ? undefined : value,
  z.coerce.number().int().nonnegative().optional(),
);

export const publicCatalogQuerySchema = z
  .object({
    q: optionalQueryText(120),
    brand: optionalQueryText(80),
    audience: z.enum(["ALL", "MEN", "WOMEN"]).optional(),
    collection: z.enum(["STANDARD", "COLLECTIBLE"]).optional(),
    style: z.enum(["MILITARY", "DRESS", "SPORT", "TOOL", "CASUAL", "CLASSIC", "MINIMALIST", "LUXURY", "RETRO", "FUTURISTIC"]).optional(),
    size: z.enum(["SMALL", "MEDIUM", "LARGE"]).optional(),
    movement: z.enum(["AUTOMATIC", "HAND_WOUND", "QUARTZ", "SOLAR", "KINETIC", "MECHAQUARTZ", "SPRING_DRIVE", "HYBRID"]).optional(),
    caseMaterial: z.enum(["STAINLESS_STEEL", "TITANIUM", "CERAMIC", "CARBON", "GOLD", "PLATINUM", "SILVER", "BRASS", "OTHER"]).optional(),
    strapType: z.enum(["BRACELET", "LEATHER"]).optional(),
    priceMin: optionalMoney,
    priceMax: optionalMoney,
    sort: z.enum(["NEWEST", "PRICE_ASC", "PRICE_DESC"]).default("NEWEST"),
    cursor: optionalQueryText(200),
    limit: z.coerce
      .number()
      .int()
      .min(1)
      .max(PUBLIC_CATALOG_MAX_PAGE_SIZE)
      .default(PUBLIC_CATALOG_DEFAULT_PAGE_SIZE),
  })
  .superRefine((value, context) => {
    if (
      value.priceMin !== undefined &&
      value.priceMax !== undefined &&
      value.priceMin > value.priceMax
    ) {
      context.addIssue({
        code: "custom",
        path: ["priceMax"],
        message: "priceMax must be greater than or equal to priceMin",
      });
    }
  });

export type PublicCatalogQuery = z.infer<typeof publicCatalogQuerySchema>;

export type PublicCatalogFacets = {
  brands: Array<{ slug: string; name: string; count: number }>;
  styles: Array<{ value: "MILITARY" | "DRESS" | "SPORT" | "TOOL" | "CASUAL" | "CLASSIC" | "MINIMALIST" | "LUXURY" | "RETRO" | "FUTURISTIC"; count: number }>;
  sizes: Array<{ value: "SMALL" | "MEDIUM" | "LARGE"; count: number }>;
  movements: Array<{ value: string; count: number }>;
  caseMaterials: Array<{ value: string; count: number }>;
  strapTypes: Array<{ value: "BRACELET" | "LEATHER"; count: number }>;
  priceBounds: { min: number; max: number };
};

export const publicWatchSlugSchema = z
  .string()
  .trim()
  .min(1)
  .max(160)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export type PublicWatchImage = {
  url: string;
  alt: string;
  width: number | null;
  height: number | null;
};

export type PublicWatchPrice =
  | { mode: "SHOW"; amount: number; currency: "VND" }
  | { mode: "CONTACT"; amount: null; currency: "VND" };

export type PublicWatchCard = {
  productId: string;
  slug: string;
  title: string;
  brand: string | null;
  image: PublicWatchImage;
  hoverImage: PublicWatchImage | null;
  price: PublicWatchPrice;
  audience: "MEN" | "WOMEN" | "UNISEX";
  tag: string | null;
  condition: string | null;
  availability: "AVAILABLE" | "HOLD" | "SOLD";
  updatedAt: string;
  /** Development diagnostic populated for related-watch results. */
  relatedScore?: number;
};

export type PublicWatchSpec = {
  key: string;
  label: string;
  value: string;
};

export type PublicWatchDetail = PublicWatchCard & {
  summary: string | null;
  gallery: PublicWatchImage[];
  specs: PublicWatchSpec[];
  seo: {
    title: string;
    description: string | null;
  };
};

export type PublicCatalogPage = {
  items: PublicWatchCard[];
  pageInfo: {
    nextCursor: string | null;
    hasNextPage: boolean;
    limit: number;
  };
};
