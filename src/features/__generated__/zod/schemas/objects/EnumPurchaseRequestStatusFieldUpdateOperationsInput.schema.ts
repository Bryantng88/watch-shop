import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestStatusSchema } from '../enums/PurchaseRequestStatus.schema'

const makeSchema = () => z.object({
  set: PurchaseRequestStatusSchema.optional()
}).strict();
export const EnumPurchaseRequestStatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumPurchaseRequestStatusFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumPurchaseRequestStatusFieldUpdateOperationsInput>;
export const EnumPurchaseRequestStatusFieldUpdateOperationsInputObjectZodSchema = makeSchema();
