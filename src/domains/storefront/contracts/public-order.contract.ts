import { z } from "zod";
import { storefrontAnalyticsContextSchema } from "@/domains/analytics/storefront/storefront-analytics.contract";

const optionalText = (maxLength: number) =>
  z.string().trim().min(1).max(maxLength).optional();

export const publicOrderRequestSchema = z
  .object({
    customerName: z.string().trim().min(1).max(120),
    phone: z.string().trim().min(8).max(30),
    contactPreference: z.enum(["PHONE", "ZALO", "WHATSAPP", "INSTAGRAM"]).default("PHONE"),
    contactHandle: optionalText(120),
    address: optionalText(500),
    city: optionalText(120),
    district: optionalText(120),
    ward: optionalText(120),
    note: optionalText(1_000),
    items: z
      .array(
        z.object({
          productId: z.string().trim().min(1).max(100),
          quantity: z.literal(1),
        }),
      )
      .min(1)
      .max(20),
    website: z.string().max(0).optional(),
    analytics: storefrontAnalyticsContextSchema.optional(),
  })
  .strict()
  .superRefine((value, context) => {
    const productIds = value.items.map((item) => item.productId);
    if (new Set(productIds).size !== productIds.length) {
      context.addIssue({ code: "custom", path: ["items"], message: "Mỗi Watch chỉ được xuất hiện một lần." });
    }
    const phoneDigits = value.phone.replace(/\D/g, "");
    if (phoneDigits.length < 8 || phoneDigits.length > 15) {
      context.addIssue({ code: "custom", path: ["phone"], message: "Số điện thoại không hợp lệ." });
    }
    if (value.contactPreference !== "PHONE" && !value.contactHandle) {
      context.addIssue({ code: "custom", path: ["contactHandle"], message: "Vui lòng nhập thông tin liên hệ cho kênh đã chọn." });
    }
  });

export const publicOrderIdempotencyKeySchema = z
  .string()
  .trim()
  .min(16)
  .max(128)
  .regex(/^[A-Za-z0-9._:-]+$/);

export type PublicOrderRequest = z.infer<typeof publicOrderRequestSchema>;

export type PublicOrderAccepted = {
  requestId: string;
  reference: string;
  status: "RECEIVED";
  disposition: "CREATED" | "MERGED";
  addedItemCount: number;
};

export const publicOrderChannelSchema = z.enum(["STOREFRONT", "ZALO"]);
export type PublicOrderChannel = z.infer<typeof publicOrderChannelSchema>;

export type SubmitPublicOrderCommand = {
  request: PublicOrderRequest;
  idempotencyKey: string;
  channel: PublicOrderChannel;
  externalRequestId?: string | null;
};
