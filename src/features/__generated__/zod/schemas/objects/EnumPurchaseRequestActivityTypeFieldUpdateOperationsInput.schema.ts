import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestActivityTypeSchema } from '../enums/PurchaseRequestActivityType.schema'

const makeSchema = () => z.object({
  set: PurchaseRequestActivityTypeSchema.optional()
}).strict();
export const EnumPurchaseRequestActivityTypeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumPurchaseRequestActivityTypeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumPurchaseRequestActivityTypeFieldUpdateOperationsInput>;
export const EnumPurchaseRequestActivityTypeFieldUpdateOperationsInputObjectZodSchema = makeSchema();
