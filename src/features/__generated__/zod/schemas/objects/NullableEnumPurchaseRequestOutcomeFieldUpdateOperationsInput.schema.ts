import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestOutcomeSchema } from '../enums/PurchaseRequestOutcome.schema'

const makeSchema = () => z.object({
  set: PurchaseRequestOutcomeSchema.optional()
}).strict();
export const NullableEnumPurchaseRequestOutcomeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumPurchaseRequestOutcomeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumPurchaseRequestOutcomeFieldUpdateOperationsInput>;
export const NullableEnumPurchaseRequestOutcomeFieldUpdateOperationsInputObjectZodSchema = makeSchema();
