import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductStatusSchema } from '../enums/ProductStatus.schema'

const makeSchema = () => z.object({
  set: ProductStatusSchema.optional()
}).strict();
export const NullableEnumProductStatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumProductStatusFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumProductStatusFieldUpdateOperationsInput>;
export const NullableEnumProductStatusFieldUpdateOperationsInputObjectZodSchema = makeSchema();
