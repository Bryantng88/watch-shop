import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestActivityTypeSchema } from '../enums/PurchaseRequestActivityType.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  purchaseRequestId: z.string(),
  type: PurchaseRequestActivityTypeSchema,
  note: z.string().optional().nullable(),
  followUpAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();
export const PurchaseRequestActivityCreateManyActorInputObjectSchema: z.ZodType<Prisma.PurchaseRequestActivityCreateManyActorInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestActivityCreateManyActorInput>;
export const PurchaseRequestActivityCreateManyActorInputObjectZodSchema = makeSchema();
