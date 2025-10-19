import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { EnumLengthLabelNullableFilterObjectSchema as EnumLengthLabelNullableFilterObjectSchema } from './EnumLengthLabelNullableFilter.schema';
import { LengthLabelSchema } from '../enums/LengthLabel.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { EnumStrapFilterObjectSchema as EnumStrapFilterObjectSchema } from './EnumStrapFilter.schema';
import { StrapSchema } from '../enums/Strap.schema';
import { BoolNullableFilterObjectSchema as BoolNullableFilterObjectSchema } from './BoolNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { ProductVariantScalarRelationFilterObjectSchema as ProductVariantScalarRelationFilterObjectSchema } from './ProductVariantScalarRelationFilter.schema';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './ProductVariantWhereInput.schema'

const strapvariantspecwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => StrapVariantSpecWhereInputObjectSchema), z.lazy(() => StrapVariantSpecWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => StrapVariantSpecWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => StrapVariantSpecWhereInputObjectSchema), z.lazy(() => StrapVariantSpecWhereInputObjectSchema).array()]).optional(),
  variantId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  widthMM: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  lengthLabel: z.union([z.lazy(() => EnumLengthLabelNullableFilterObjectSchema), LengthLabelSchema]).optional().nullable(),
  color: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  material: z.union([z.lazy(() => EnumStrapFilterObjectSchema), StrapSchema]).optional(),
  quickRelease: z.union([z.lazy(() => BoolNullableFilterObjectSchema), z.boolean()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  variant: z.union([z.lazy(() => ProductVariantScalarRelationFilterObjectSchema), z.lazy(() => ProductVariantWhereInputObjectSchema)]).optional()
}).strict();
export const StrapVariantSpecWhereInputObjectSchema: z.ZodType<Prisma.StrapVariantSpecWhereInput> = strapvariantspecwhereinputSchema as unknown as z.ZodType<Prisma.StrapVariantSpecWhereInput>;
export const StrapVariantSpecWhereInputObjectZodSchema = strapvariantspecwhereinputSchema;
