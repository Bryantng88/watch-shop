import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapSchema } from '../enums/Strap.schema';
import { ProductVariantCreateNestedOneWithoutStrapVariantSpecInputObjectSchema as ProductVariantCreateNestedOneWithoutStrapVariantSpecInputObjectSchema } from './ProductVariantCreateNestedOneWithoutStrapVariantSpecInput.schema'

const makeSchema = () => z.object({
  color: z.string().optional().nullable(),
  material: StrapSchema.optional(),
  quickRelease: z.boolean().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date(),
  lugWidthMM: z.number().int(),
  buckleWidthMM: z.number().int().optional().nullable(),
  ProductVariant: z.lazy(() => ProductVariantCreateNestedOneWithoutStrapVariantSpecInputObjectSchema)
}).strict();
export const StrapVariantSpecCreateInputObjectSchema: z.ZodType<Prisma.StrapVariantSpecCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapVariantSpecCreateInput>;
export const StrapVariantSpecCreateInputObjectZodSchema = makeSchema();
