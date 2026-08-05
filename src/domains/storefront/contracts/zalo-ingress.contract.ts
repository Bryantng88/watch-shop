import { z } from "zod";
import { publicCatalogQuerySchema } from "./public-catalog.contract";
import { publicOrderRequestSchema } from "./public-order.contract";

const envelope = {
  eventId: z.string().trim().min(16).max(128).regex(/^[A-Za-z0-9._:-]+$/),
  occurredAt: z.string().datetime({ offset: true }),
};

export const zaloIngressEventSchema = z.discriminatedUnion("type", [
  z.object({ ...envelope, type: z.literal("watch.lookup"), data: publicCatalogQuerySchema }).strict(),
  z.object({ ...envelope, type: z.literal("order.create"), data: publicOrderRequestSchema }).strict(),
]);

export type ZaloIngressEvent = z.infer<typeof zaloIngressEventSchema>;
