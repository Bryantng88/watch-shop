import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestContactPreferenceSchema } from '../enums/PurchaseRequestContactPreference.schema'

const makeSchema = () => z.object({
  set: PurchaseRequestContactPreferenceSchema.optional()
}).strict();
export const EnumPurchaseRequestContactPreferenceFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumPurchaseRequestContactPreferenceFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumPurchaseRequestContactPreferenceFieldUpdateOperationsInput>;
export const EnumPurchaseRequestContactPreferenceFieldUpdateOperationsInputObjectZodSchema = makeSchema();
