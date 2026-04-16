import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCategoryScopeSchema } from '../enums/ProductCategoryScope.schema'

const makeSchema = () => z.object({
  set: ProductCategoryScopeSchema.optional()
}).strict();
export const EnumProductCategoryScopeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumProductCategoryScopeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumProductCategoryScopeFieldUpdateOperationsInput>;
export const EnumProductCategoryScopeFieldUpdateOperationsInputObjectZodSchema = makeSchema();
