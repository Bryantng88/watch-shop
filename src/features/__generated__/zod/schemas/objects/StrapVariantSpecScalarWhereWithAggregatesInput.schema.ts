import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { EnumStrapWithAggregatesFilterObjectSchema as EnumStrapWithAggregatesFilterObjectSchema } from './EnumStrapWithAggregatesFilter.schema';
import { StrapSchema } from '../enums/Strap.schema';
import { BoolNullableWithAggregatesFilterObjectSchema as BoolNullableWithAggregatesFilterObjectSchema } from './BoolNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema';
import { IntWithAggregatesFilterObjectSchema as IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { IntNullableWithAggregatesFilterObjectSchema as IntNullableWithAggregatesFilterObjectSchema } from './IntNullableWithAggregatesFilter.schema';
import { EnumStrapOriginTypeWithAggregatesFilterObjectSchema as EnumStrapOriginTypeWithAggregatesFilterObjectSchema } from './EnumStrapOriginTypeWithAggregatesFilter.schema';
import { StrapOriginTypeSchema } from '../enums/StrapOriginType.schema';
import { EnumStrapSurfaceNullableWithAggregatesFilterObjectSchema as EnumStrapSurfaceNullableWithAggregatesFilterObjectSchema } from './EnumStrapSurfaceNullableWithAggregatesFilter.schema';
import { StrapSurfaceSchema } from '../enums/StrapSurface.schema';
import { EnumStrapInventoryPolicyWithAggregatesFilterObjectSchema as EnumStrapInventoryPolicyWithAggregatesFilterObjectSchema } from './EnumStrapInventoryPolicyWithAggregatesFilter.schema';
import { StrapInventoryPolicySchema } from '../enums/StrapInventoryPolicy.schema';
import { EnumStrapClaspTypeNullableWithAggregatesFilterObjectSchema as EnumStrapClaspTypeNullableWithAggregatesFilterObjectSchema } from './EnumStrapClaspTypeNullableWithAggregatesFilter.schema';
import { StrapClaspTypeSchema } from '../enums/StrapClaspType.schema';
import { EnumStrapOriginTypeNullableWithAggregatesFilterObjectSchema as EnumStrapOriginTypeNullableWithAggregatesFilterObjectSchema } from './EnumStrapOriginTypeNullableWithAggregatesFilter.schema';
import { EnumStrapLengthClassNullableWithAggregatesFilterObjectSchema as EnumStrapLengthClassNullableWithAggregatesFilterObjectSchema } from './EnumStrapLengthClassNullableWithAggregatesFilter.schema';
import { StrapLengthClassSchema } from '../enums/StrapLengthClass.schema'

const strapvariantspecscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => StrapVariantSpecScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => StrapVariantSpecScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => StrapVariantSpecScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => StrapVariantSpecScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => StrapVariantSpecScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  variantId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  color: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  material: z.union([z.lazy(() => EnumStrapWithAggregatesFilterObjectSchema), StrapSchema]).optional(),
  quickRelease: z.union([z.lazy(() => BoolNullableWithAggregatesFilterObjectSchema), z.boolean()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  lugWidthMM: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  buckleWidthMM: z.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number().int()]).optional().nullable(),
  originType: z.union([z.lazy(() => EnumStrapOriginTypeWithAggregatesFilterObjectSchema), StrapOriginTypeSchema]).optional(),
  brandName: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  leatherType: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  surface: z.union([z.lazy(() => EnumStrapSurfaceNullableWithAggregatesFilterObjectSchema), StrapSurfaceSchema]).optional().nullable(),
  inventoryPolicy: z.union([z.lazy(() => EnumStrapInventoryPolicyWithAggregatesFilterObjectSchema), StrapInventoryPolicySchema]).optional(),
  claspType: z.union([z.lazy(() => EnumStrapClaspTypeNullableWithAggregatesFilterObjectSchema), StrapClaspTypeSchema]).optional().nullable(),
  claspWidthMM: z.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number().int()]).optional().nullable(),
  claspOriginType: z.union([z.lazy(() => EnumStrapOriginTypeNullableWithAggregatesFilterObjectSchema), StrapOriginTypeSchema]).optional().nullable(),
  finish: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  lengthClass: z.union([z.lazy(() => EnumStrapLengthClassNullableWithAggregatesFilterObjectSchema), StrapLengthClassSchema]).optional().nullable(),
  minStockQty: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  targetStockQty: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  braceletReference: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  defaultFullLinks: z.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number().int()]).optional().nullable(),
  defaultHalfLinks: z.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number().int()]).optional().nullable(),
  defaultEndLinks: z.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number().int()]).optional().nullable()
}).strict();
export const StrapVariantSpecScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.StrapVariantSpecScalarWhereWithAggregatesInput> = strapvariantspecscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.StrapVariantSpecScalarWhereWithAggregatesInput>;
export const StrapVariantSpecScalarWhereWithAggregatesInputObjectZodSchema = strapvariantspecscalarwherewithaggregatesinputSchema;
