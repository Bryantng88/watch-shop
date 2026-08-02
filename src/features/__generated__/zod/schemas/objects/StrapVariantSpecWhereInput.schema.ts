import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { EnumStrapFilterObjectSchema as EnumStrapFilterObjectSchema } from './EnumStrapFilter.schema';
import { StrapSchema } from '../enums/Strap.schema';
import { BoolNullableFilterObjectSchema as BoolNullableFilterObjectSchema } from './BoolNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { IntNullableFilterObjectSchema as IntNullableFilterObjectSchema } from './IntNullableFilter.schema';
import { EnumStrapOriginTypeFilterObjectSchema as EnumStrapOriginTypeFilterObjectSchema } from './EnumStrapOriginTypeFilter.schema';
import { StrapOriginTypeSchema } from '../enums/StrapOriginType.schema';
import { EnumStrapSurfaceNullableFilterObjectSchema as EnumStrapSurfaceNullableFilterObjectSchema } from './EnumStrapSurfaceNullableFilter.schema';
import { StrapSurfaceSchema } from '../enums/StrapSurface.schema';
import { EnumStrapInventoryPolicyFilterObjectSchema as EnumStrapInventoryPolicyFilterObjectSchema } from './EnumStrapInventoryPolicyFilter.schema';
import { StrapInventoryPolicySchema } from '../enums/StrapInventoryPolicy.schema';
import { EnumStrapClaspTypeNullableFilterObjectSchema as EnumStrapClaspTypeNullableFilterObjectSchema } from './EnumStrapClaspTypeNullableFilter.schema';
import { StrapClaspTypeSchema } from '../enums/StrapClaspType.schema';
import { EnumStrapOriginTypeNullableFilterObjectSchema as EnumStrapOriginTypeNullableFilterObjectSchema } from './EnumStrapOriginTypeNullableFilter.schema';
import { EnumStrapLengthClassNullableFilterObjectSchema as EnumStrapLengthClassNullableFilterObjectSchema } from './EnumStrapLengthClassNullableFilter.schema';
import { StrapLengthClassSchema } from '../enums/StrapLengthClass.schema';
import { ProductVariantScalarRelationFilterObjectSchema as ProductVariantScalarRelationFilterObjectSchema } from './ProductVariantScalarRelationFilter.schema';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './ProductVariantWhereInput.schema'

const strapvariantspecwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => StrapVariantSpecWhereInputObjectSchema), z.lazy(() => StrapVariantSpecWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => StrapVariantSpecWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => StrapVariantSpecWhereInputObjectSchema), z.lazy(() => StrapVariantSpecWhereInputObjectSchema).array()]).optional(),
  variantId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  color: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  material: z.union([z.lazy(() => EnumStrapFilterObjectSchema), StrapSchema]).optional(),
  quickRelease: z.union([z.lazy(() => BoolNullableFilterObjectSchema), z.boolean()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  lugWidthMM: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  buckleWidthMM: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  originType: z.union([z.lazy(() => EnumStrapOriginTypeFilterObjectSchema), StrapOriginTypeSchema]).optional(),
  brandName: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  leatherType: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  surface: z.union([z.lazy(() => EnumStrapSurfaceNullableFilterObjectSchema), StrapSurfaceSchema]).optional().nullable(),
  inventoryPolicy: z.union([z.lazy(() => EnumStrapInventoryPolicyFilterObjectSchema), StrapInventoryPolicySchema]).optional(),
  claspType: z.union([z.lazy(() => EnumStrapClaspTypeNullableFilterObjectSchema), StrapClaspTypeSchema]).optional().nullable(),
  claspWidthMM: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  claspOriginType: z.union([z.lazy(() => EnumStrapOriginTypeNullableFilterObjectSchema), StrapOriginTypeSchema]).optional().nullable(),
  finish: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  lengthClass: z.union([z.lazy(() => EnumStrapLengthClassNullableFilterObjectSchema), StrapLengthClassSchema]).optional().nullable(),
  minStockQty: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  targetStockQty: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  braceletReference: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  defaultFullLinks: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  defaultHalfLinks: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  defaultEndLinks: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  ProductVariant: z.union([z.lazy(() => ProductVariantScalarRelationFilterObjectSchema), z.lazy(() => ProductVariantWhereInputObjectSchema)]).optional()
}).strict();
export const StrapVariantSpecWhereInputObjectSchema: z.ZodType<Prisma.StrapVariantSpecWhereInput> = strapvariantspecwhereinputSchema as unknown as z.ZodType<Prisma.StrapVariantSpecWhereInput>;
export const StrapVariantSpecWhereInputObjectZodSchema = strapvariantspecwhereinputSchema;
