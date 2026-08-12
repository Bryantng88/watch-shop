import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestIngressDispositionSchema } from '../enums/PurchaseRequestIngressDisposition.schema'

const makeSchema = () => z.object({
  set: PurchaseRequestIngressDispositionSchema.optional()
}).strict();
export const EnumPurchaseRequestIngressDispositionFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumPurchaseRequestIngressDispositionFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumPurchaseRequestIngressDispositionFieldUpdateOperationsInput>;
export const EnumPurchaseRequestIngressDispositionFieldUpdateOperationsInputObjectZodSchema = makeSchema();
