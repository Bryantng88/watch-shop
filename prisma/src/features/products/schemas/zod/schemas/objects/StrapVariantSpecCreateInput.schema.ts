import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { LengthLabelSchema } from '../enums/LengthLabel.schema';
import { StrapSchema } from '../enums/Strap.schema';
import { ProductVariantCreateNestedOneWithoutStrapSpecInputObjectSchema as ProductVariantCreateNestedOneWithoutStrapSpecInputObjectSchema } from './ProductVariantCreateNestedOneWithoutStrapSpecInput.schema'

const makeSchema = () => z.object({
  widthMM: z.number().int(),
  lengthLabel: LengthLabelSchema.optional().nullable(),
  color: z.string().optional().nullable(),
  material: StrapSchema.optional(),
  quickRelease: z.boolean().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  variant: z.lazy(() => ProductVariantCreateNestedOneWithoutStrapSpecInputObjectSchema)
}).strict();
export const StrapVariantSpecCreateInputObjectSchema: z.ZodType<Prisma.StrapVariantSpecCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapVariantSpecCreateInput>;
export const StrapVariantSpecCreateInputObjectZodSchema = makeSchema();
