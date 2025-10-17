import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentMethodSchema } from '../enums/PaymentMethod.schema'

const makeSchema = () => z.object({
  set: PaymentMethodSchema.optional()
}).strict();
export const NullableEnumPaymentMethodFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumPaymentMethodFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumPaymentMethodFieldUpdateOperationsInput>;
export const NullableEnumPaymentMethodFieldUpdateOperationsInputObjectZodSchema = makeSchema();
