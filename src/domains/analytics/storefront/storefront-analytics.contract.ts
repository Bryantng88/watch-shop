import { z } from "zod";

export const storefrontAnalyticsEventNameSchema = z.enum([
  "session_started",
  "product_viewed",
  "request_started",
  "request_page_viewed",
  "request_form_started",
  "cart_item_added",
  "cart_item_removed",
]);

export const storefrontAnalyticsContextSchema = z.object({
  anonymousId: z.string().uuid(),
  sessionId: z.string().uuid(),
  source: z.string().trim().max(100).optional(),
  medium: z.string().trim().max(100).optional(),
  campaign: z.string().trim().max(150).optional(),
  landingPath: z.string().trim().max(500).optional(),
}).strict();

const eventSchema = z.object({
  eventId: z.string().uuid(),
  eventName: storefrontAnalyticsEventNameSchema,
  occurredAt: z.string().datetime(),
  productId: z.string().trim().max(100).optional(),
  path: z.string().trim().min(1).max(500),
  referrer: z.string().trim().max(1_000).optional(),
  context: storefrontAnalyticsContextSchema,
}).strict().superRefine((event, ctx) => {
  if (event.eventName === "product_viewed" && !event.productId) {
    ctx.addIssue({ code: "custom", path: ["productId"], message: "productId is required" });
  }
});

export const storefrontAnalyticsBatchSchema = z.object({
  events: z.array(eventSchema).min(1).max(10),
}).strict();

export type StorefrontAnalyticsContext = z.infer<typeof storefrontAnalyticsContextSchema>;
export type StorefrontAnalyticsEventName = z.infer<typeof storefrontAnalyticsEventNameSchema>;
