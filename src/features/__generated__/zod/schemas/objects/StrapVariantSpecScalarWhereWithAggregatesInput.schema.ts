import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { IntWithAggregatesFilterObjectSchema as IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { EnumLengthLabelNullableWithAggregatesFilterObjectSchema as EnumLengthLabelNullableWithAggregatesFilterObjectSchema } from './EnumLengthLabelNullableWithAggregatesFilter.schema';
import { LengthLabelSchema } from '../enums/LengthLabel.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { EnumStrapWithAggregatesFilterObjectSchema as EnumStrapWithAggregatesFilterObjectSchema } from './EnumStrapWithAggregatesFilter.schema';
import { StrapSchema } from '../enums/Strap.schema';
import { BoolNullableWithAggregatesFilterObjectSchema as BoolNullableWithAggregatesFilterObjectSchema } from './BoolNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const strapvariantspecscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => StrapVariantSpecScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => StrapVariantSpecScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => StrapVariantSpecScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => StrapVariantSpecScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => StrapVariantSpecScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  variantId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  widthMM: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  lengthLabel: z.union([z.lazy(() => EnumLengthLabelNullableWithAggregatesFilterObjectSchema), LengthLabelSchema]).optional().nullable(),
  color: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  material: z.union([z.lazy(() => EnumStrapWithAggregatesFilterObjectSchema), StrapSchema]).optional(),
  quickRelease: z.union([z.lazy(() => BoolNullableWithAggregatesFilterObjectSchema), z.boolean()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const StrapVariantSpecScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.StrapVariantSpecScalarWhereWithAggregatesInput> = strapvariantspecscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.StrapVariantSpecScalarWhereWithAggregatesInput>;
export const StrapVariantSpecScalarWhereWithAggregatesInputObjectZodSchema = strapvariantspecscalarwherewithaggregatesinputSchema;
