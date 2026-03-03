import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentDirectionSchema } from '../enums/PaymentDirection.schema'

const makeSchema = () => z.object({
  set: PaymentDirectionSchema.optional()
}).strict();
export const NullableEnumPaymentDirectionFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumPaymentDirectionFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumPaymentDirectionFieldUpdateOperationsInput>;
export const NullableEnumPaymentDirectionFieldUpdateOperationsInputObjectZodSchema = makeSchema();
