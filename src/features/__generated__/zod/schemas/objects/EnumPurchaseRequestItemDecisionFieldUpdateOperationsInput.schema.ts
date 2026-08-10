import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestItemDecisionSchema } from '../enums/PurchaseRequestItemDecision.schema'

const makeSchema = () => z.object({
  set: PurchaseRequestItemDecisionSchema.optional()
}).strict();
export const EnumPurchaseRequestItemDecisionFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumPurchaseRequestItemDecisionFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumPurchaseRequestItemDecisionFieldUpdateOperationsInput>;
export const EnumPurchaseRequestItemDecisionFieldUpdateOperationsInputObjectZodSchema = makeSchema();
