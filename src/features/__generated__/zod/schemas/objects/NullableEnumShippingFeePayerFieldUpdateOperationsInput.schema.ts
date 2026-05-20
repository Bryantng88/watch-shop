import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShippingFeePayerSchema } from '../enums/ShippingFeePayer.schema'

const makeSchema = () => z.object({
  set: ShippingFeePayerSchema.optional()
}).strict();
export const NullableEnumShippingFeePayerFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumShippingFeePayerFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumShippingFeePayerFieldUpdateOperationsInput>;
export const NullableEnumShippingFeePayerFieldUpdateOperationsInputObjectZodSchema = makeSchema();
