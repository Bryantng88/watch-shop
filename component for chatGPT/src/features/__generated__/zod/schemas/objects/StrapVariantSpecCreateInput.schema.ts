import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapSchema } from '../enums/Strap.schema';
import { ProductVariantCreateNestedOneWithoutStrapSpecInputObjectSchema as ProductVariantCreateNestedOneWithoutStrapSpecInputObjectSchema } from './ProductVariantCreateNestedOneWithoutStrapSpecInput.schema'

const makeSchema = () => z.object({
  color: z.string().optional().nullable(),
  material: StrapSchema.optional(),
  quickRelease: z.boolean().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  lugWidthMM: z.number().int(),
  buckleWidthMM: z.number().int().optional().nullable(),
  variant: z.lazy(() => ProductVariantCreateNestedOneWithoutStrapSpecInputObjectSchema)
}).strict();
export const StrapVariantSpecCreateInputObjectSchema: z.ZodType<Prisma.StrapVariantSpecCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapVariantSpecCreateInput>;
export const StrapVariantSpecCreateInputObjectZodSchema = makeSchema();
