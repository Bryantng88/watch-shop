import { z } from "zod";

const optionalText = (maxLength: number) =>
  z.string().trim().min(1).max(maxLength).optional();

export const publicOrderRequestSchema = z
  .object({
    customerName: z.string().trim().min(1).max(120),
    phone: z.string().trim().min(8).max(30),
    contactPreference: z.enum(["PHONE", "ZALO"]).default("PHONE"),
    address: optionalText(500),
    city: optionalText(120),
    district: optionalText(120),
    ward: optionalText(120),
    note: optionalText(1_000),
    items: z
      .array(
        z.object({
          productId: z.string().trim().min(1).max(100),
          quantity: z.number().int().min(1).max(20),
        }),
      )
      .min(1)
      .max(20),
    website: z.string().max(0).optional(),
  })
  .strict();

export const publicOrderIdempotencyKeySchema = z
  .string()
  .trim()
  .min(16)
  .max(128)
  .regex(/^[A-Za-z0-9._:-]+$/);

export type PublicOrderRequest = z.infer<typeof publicOrderRequestSchema>;

export type PublicOrderAccepted = {
  orderId: string;
  reference: string | null;
  status: "PENDING_VERIFICATION";
};

export const publicOrderChannelSchema = z.enum(["STOREFRONT", "ZALO"]);
export type PublicOrderChannel = z.infer<typeof publicOrderChannelSchema>;

export type SubmitPublicOrderCommand = {
  request: PublicOrderRequest;
  idempotencyKey: string;
  channel: PublicOrderChannel;
  externalRequestId?: string | null;
};

