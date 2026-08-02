import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { EnumStrapInventoryMovementTypeFilterObjectSchema as EnumStrapInventoryMovementTypeFilterObjectSchema } from './EnumStrapInventoryMovementTypeFilter.schema';
import { StrapInventoryMovementTypeSchema } from '../enums/StrapInventoryMovementType.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { IntNullableFilterObjectSchema as IntNullableFilterObjectSchema } from './IntNullableFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { ProductVariantScalarRelationFilterObjectSchema as ProductVariantScalarRelationFilterObjectSchema } from './ProductVariantScalarRelationFilter.schema';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './ProductVariantWhereInput.schema'

const strapinventorymovementwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => StrapInventoryMovementWhereInputObjectSchema), z.lazy(() => StrapInventoryMovementWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => StrapInventoryMovementWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => StrapInventoryMovementWhereInputObjectSchema), z.lazy(() => StrapInventoryMovementWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  strapVariantId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  movementType: z.union([z.lazy(() => EnumStrapInventoryMovementTypeFilterObjectSchema), StrapInventoryMovementTypeSchema]).optional(),
  quantity: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  balanceAfter: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  watchId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  orderId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  serviceRequestId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  actorUserId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  sourceType: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  sourceId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  note: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  strapVariant: z.union([z.lazy(() => ProductVariantScalarRelationFilterObjectSchema), z.lazy(() => ProductVariantWhereInputObjectSchema)]).optional()
}).strict();
export const StrapInventoryMovementWhereInputObjectSchema: z.ZodType<Prisma.StrapInventoryMovementWhereInput> = strapinventorymovementwhereinputSchema as unknown as z.ZodType<Prisma.StrapInventoryMovementWhereInput>;
export const StrapInventoryMovementWhereInputObjectZodSchema = strapinventorymovementwhereinputSchema;
