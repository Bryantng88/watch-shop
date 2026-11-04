import { z } from "zod";

export const editorialKey = z
  .string()
  .refine(
    (v) =>
      v === "" ||
      /^storefront\/(?:editorial\/[a-z0-9-]+\.webp|hero\/(?!.*(?:\.\.|\\))[^\x00-\x1f]+\.(?:jpe?g|png|webp))$/i.test(
        v,
      ),
    "Chọn ảnh từ thư viện Storefront.",
  );
export const safeLink = z
  .string()
  .max(500)
  .refine((v) => {
    if (/[\\\x00-\x20]/.test(v)) return false;
    if (v.startsWith("/") && !v.startsWith("//")) return true;
    try {
      const u = new URL(v);
      return u.protocol === "https:" && !u.username && !u.password;
    } catch {
      return false;
    }
  }, "Dùng đường dẫn /products… hoặc https://… hợp lệ.");
const text = (max: number) => z.string().trim().max(max);
export const imageSchema = z.object({
  key: editorialKey,
  alt: text(240),
  focalX: z.number().min(0).max(100),
  focalY: z.number().min(0).max(100),
});
export const sectionIds = [
  "hero",
  "featured",
  "about",
  "collections",
  "journal",
  "closing",
] as const;
export const sectionSchema = z.object({ id: z.enum(sectionIds), enabled: z.boolean() });
export const homeSchema = z.object({
  sections: z
    .array(sectionSchema)
    .length(6)
    .refine((v) => new Set(v.map((s) => s.id)).size === 6, "Mỗi khối chỉ xuất hiện một lần."),
  hero: z.object({
    title: text(120).min(1),
    description: text(500),
    button: text(80).min(1),
    href: safeLink,
    image: imageSchema,
    mobileImage: imageSchema,
    caption: text(140),
  }),
  featured: z.object({
    title: text(100),
    productIds: z
      .array(text(100).min(1))
      .max(12)
      .refine((v) => new Set(v).size === v.length, "Sản phẩm bị trùng."),
    href: safeLink,
  }),
  about: z.object({ title: text(140), body: text(4000), image: imageSchema }),
  collections: z
    .array(
      z.object({
        id: text(60).min(1),
        title: text(100),
        description: text(250),
        href: safeLink,
        image: imageSchema,
      }),
    )
    .max(6),
  journal: z.object({ title: text(100), articleId: text(100) }),
  closing: z.object({ title: text(140), button: text(80), href: safeLink }),
  general: z.object({
    logo: imageSchema,
    tagline: text(250),
    contact: text(2000),
    links: z.array(z.object({ label: text(80).min(1), href: safeLink })).max(12),
  }),
});
export const articleSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug chỉ gồm chữ thường, số và dấu gạch ngang."),
  title: text(160).min(1),
  excerpt: text(600),
  body: text(30000),
  cover: imageSchema,
  images: z.array(imageSchema).max(10),
  productIds: z.array(text(100).min(1)).max(12),
});
export type HomeContent = z.infer<typeof homeSchema>;
export type ArticleContent = z.infer<typeof articleSchema>;
export type EditorialImage = z.infer<typeof imageSchema>;
export type ContentKind = "HOME" | "ARTICLE";
export type ContentRecord = {
  id: string;
  kind: ContentKind;
  draft: HomeContent | ArticleContent;
  revision: number;
  publishedAt: string | null;
  updatedAt: string | null;
};
export const emptyImage = (): EditorialImage => ({ key: "", alt: "", focalX: 50, focalY: 50 });
export function defaultHome(): HomeContent {
  return {
    sections: sectionIds.map((id) => ({ id, enabled: true })),
    hero: {
      title: "Thiết kế vượt\nqua thời gian.",
      description:
        "Đồng hồ vintage & pre-owned được tuyển chọn.\nTừ thiết kế kinh điển đến những nét riêng ít gặp.",
      button: "Khám phá đồng hồ",
      href: "/products",
      image: emptyImage(),
      mobileImage: emptyImage(),
      caption: "",
    },
    featured: { title: "Đồng hồ nổi bật", productIds: [], href: "/products" },
    about: {
      title: "Một chiếc đồng hồ.\nMột góc nhìn riêng.",
      body: "Một mặt số chải tia, bộ vỏ có tỷ lệ đẹp, hay thiết kế mang dấu ấn của một thời kỳ. Vintic bắt đầu từ những chi tiết ấy.\n\nChúng mình chọn đồng hồ vì thiết kế, cá tính và niềm vui khi đeo hằng ngày.",
      image: emptyImage(),
    },
    collections: [
      {
        id: "dress",
        title: "Thanh lịch",
        description: "Thiết kế gọn, tỷ lệ tinh tế.",
        href: "/products?style=DRESS",
        image: emptyImage(),
      },
      {
        id: "sport",
        title: "Thể thao",
        description: "Diver, tool watch và tinh thần chuyển động.",
        href: "/products?style=SPORT",
        image: emptyImage(),
      },
      {
        id: "distinctive",
        title: "Khác biệt",
        description: "Những đường nét ngoài khuôn mẫu.",
        href: "/products?style=FUTURISTIC",
        image: emptyImage(),
      },
    ],
    journal: { title: "Chuyện đồng hồ", articleId: "" },
    closing: {
      title: "Tìm chiếc đồng hồ của bạn.",
      button: "Khám phá bộ sưu tập",
      href: "/products",
    },
    general: { logo: emptyImage(), tagline: "Vintage Watch & Accessories", contact: "", links: [] },
  };
}
export function defaultArticle(): ArticleContent {
  return {
    slug: "bai-viet-moi",
    title: "Bài viết mới",
    excerpt: "",
    body: "",
    cover: emptyImage(),
    images: [],
    productIds: [],
  };
}
export function contentImages(kind: string, content: unknown): Record<string, EditorialImage> {
  if (kind === "HOME") {
    const c = homeSchema.parse(content);
    return {
      logo: c.general.logo,
      hero: c.hero.image,
      mobile: c.hero.mobileImage,
      about: c.about.image,
      ...Object.fromEntries(c.collections.map((v, i) => [`collection-${i}`, v.image])),
    };
  }
  const c = articleSchema.parse(content);
  return { cover: c.cover, ...Object.fromEntries(c.images.map((v, i) => [`image-${i}`, v])) };
}
