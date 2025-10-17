import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PartTypeSchema } from '../enums/PartType.schema';
import { ProductVariantCreateNestedOneWithoutPartSpecInputObjectSchema as ProductVariantCreateNestedOneWithoutPartSpecInputObjectSchema } from './ProductVariantCreateNestedOneWithoutPartSpecInput.schema'

const makeSchema = () => z.object({
  partType: PartTypeSchema,
  variant: z.lazy(() => ProductVariantCreateNestedOneWithoutPartSpecInputObjectSchema)
}).strict();
export const PartVariantSpecCreateInputObjectSchema: z.ZodType<Prisma.PartVariantSpecCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.PartVariantSpecCreateInput>;
export const PartVariantSpecCreateInputObjectZodSchema = makeSchema();
