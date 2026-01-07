import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentPurposeSchema } from '../enums/PaymentPurpose.schema'

const makeSchema = () => z.object({
  set: PaymentPurposeSchema.optional()
}).strict();
export const EnumPaymentPurposeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumPaymentPurposeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumPaymentPurposeFieldUpdateOperationsInput>;
export const EnumPaymentPurposeFieldUpdateOperationsInputObjectZodSchema = makeSchema();
