import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  purchaseRequestId: z.literal(true).optional(),
  type: z.literal(true).optional(),
  note: z.literal(true).optional(),
  actorUserId: z.literal(true).optional(),
  followUpAt: z.literal(true).optional(),
  createdAt: z.literal(true).optional()
}).strict();
export const PurchaseRequestActivityMaxAggregateInputObjectSchema: z.ZodType<Prisma.PurchaseRequestActivityMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestActivityMaxAggregateInputType>;
export const PurchaseRequestActivityMaxAggregateInputObjectZodSchema = makeSchema();
