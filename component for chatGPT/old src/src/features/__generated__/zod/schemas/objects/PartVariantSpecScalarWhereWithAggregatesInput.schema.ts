import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { EnumPartTypeWithAggregatesFilterObjectSchema as EnumPartTypeWithAggregatesFilterObjectSchema } from './EnumPartTypeWithAggregatesFilter.schema';
import { PartTypeSchema } from '../enums/PartType.schema'

const partvariantspecscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => PartVariantSpecScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => PartVariantSpecScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => PartVariantSpecScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => PartVariantSpecScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => PartVariantSpecScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  variantId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  partType: z.union([z.lazy(() => EnumPartTypeWithAggregatesFilterObjectSchema), PartTypeSchema]).optional()
}).strict();
export const PartVariantSpecScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.PartVariantSpecScalarWhereWithAggregatesInput> = partvariantspecscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.PartVariantSpecScalarWhereWithAggregatesInput>;
export const PartVariantSpecScalarWhereWithAggregatesInputObjectZodSchema = partvariantspecscalarwherewithaggregatesinputSchema;
