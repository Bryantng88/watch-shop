import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DiscountTypeSchema } from '../enums/DiscountType.schema'

const makeSchema = () => z.object({
  set: DiscountTypeSchema.optional()
}).strict();
export const NullableEnumDiscountTypeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumDiscountTypeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumDiscountTypeFieldUpdateOperationsInput>;
export const NullableEnumDiscountTypeFieldUpdateOperationsInputObjectZodSchema = makeSchema();
