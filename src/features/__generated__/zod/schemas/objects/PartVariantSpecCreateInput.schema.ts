import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PartTypeSchema } from '../enums/PartType.schema';
import { ProductVariantCreateNestedOneWithoutPartVariantSpecInputObjectSchema as ProductVariantCreateNestedOneWithoutPartVariantSpecInputObjectSchema } from './ProductVariantCreateNestedOneWithoutPartVariantSpecInput.schema'

const makeSchema = () => z.object({
  partType: PartTypeSchema,
  ProductVariant: z.lazy(() => ProductVariantCreateNestedOneWithoutPartVariantSpecInputObjectSchema)
}).strict();
export const PartVariantSpecCreateInputObjectSchema: z.ZodType<Prisma.PartVariantSpecCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.PartVariantSpecCreateInput>;
export const PartVariantSpecCreateInputObjectZodSchema = makeSchema();
