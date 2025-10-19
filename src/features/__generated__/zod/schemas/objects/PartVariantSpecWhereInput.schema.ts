import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { EnumPartTypeFilterObjectSchema as EnumPartTypeFilterObjectSchema } from './EnumPartTypeFilter.schema';
import { PartTypeSchema } from '../enums/PartType.schema';
import { ProductVariantScalarRelationFilterObjectSchema as ProductVariantScalarRelationFilterObjectSchema } from './ProductVariantScalarRelationFilter.schema';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './ProductVariantWhereInput.schema'

const partvariantspecwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => PartVariantSpecWhereInputObjectSchema), z.lazy(() => PartVariantSpecWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => PartVariantSpecWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => PartVariantSpecWhereInputObjectSchema), z.lazy(() => PartVariantSpecWhereInputObjectSchema).array()]).optional(),
  variantId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  partType: z.union([z.lazy(() => EnumPartTypeFilterObjectSchema), PartTypeSchema]).optional(),
  variant: z.union([z.lazy(() => ProductVariantScalarRelationFilterObjectSchema), z.lazy(() => ProductVariantWhereInputObjectSchema)]).optional()
}).strict();
export const PartVariantSpecWhereInputObjectSchema: z.ZodType<Prisma.PartVariantSpecWhereInput> = partvariantspecwhereinputSchema as unknown as z.ZodType<Prisma.PartVariantSpecWhereInput>;
export const PartVariantSpecWhereInputObjectZodSchema = partvariantspecwhereinputSchema;
