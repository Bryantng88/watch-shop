import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductTypeSchema } from '../enums/ProductType.schema'

const makeSchema = () => z.object({
  set: ProductTypeSchema.optional()
}).strict();
export const NullableEnumProductTypeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumProductTypeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumProductTypeFieldUpdateOperationsInput>;
export const NullableEnumProductTypeFieldUpdateOperationsInputObjectZodSchema = makeSchema();
