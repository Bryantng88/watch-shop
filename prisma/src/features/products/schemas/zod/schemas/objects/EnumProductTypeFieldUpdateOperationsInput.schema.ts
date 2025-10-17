import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductTypeSchema } from '../enums/ProductType.schema'

const makeSchema = () => z.object({
  set: ProductTypeSchema.optional()
}).strict();
export const EnumProductTypeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumProductTypeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumProductTypeFieldUpdateOperationsInput>;
export const EnumProductTypeFieldUpdateOperationsInputObjectZodSchema = makeSchema();
