import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { EnumStrapInventoryMovementTypeWithAggregatesFilterObjectSchema as EnumStrapInventoryMovementTypeWithAggregatesFilterObjectSchema } from './EnumStrapInventoryMovementTypeWithAggregatesFilter.schema';
import { StrapInventoryMovementTypeSchema } from '../enums/StrapInventoryMovementType.schema';
import { IntWithAggregatesFilterObjectSchema as IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { IntNullableWithAggregatesFilterObjectSchema as IntNullableWithAggregatesFilterObjectSchema } from './IntNullableWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const strapinventorymovementscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => StrapInventoryMovementScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => StrapInventoryMovementScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => StrapInventoryMovementScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => StrapInventoryMovementScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => StrapInventoryMovementScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  strapVariantId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  movementType: z.union([z.lazy(() => EnumStrapInventoryMovementTypeWithAggregatesFilterObjectSchema), StrapInventoryMovementTypeSchema]).optional(),
  quantity: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  balanceAfter: z.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number().int()]).optional().nullable(),
  watchId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  orderId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  serviceRequestId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  actorUserId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  sourceType: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  sourceId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  note: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const StrapInventoryMovementScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.StrapInventoryMovementScalarWhereWithAggregatesInput> = strapinventorymovementscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.StrapInventoryMovementScalarWhereWithAggregatesInput>;
export const StrapInventoryMovementScalarWhereWithAggregatesInputObjectZodSchema = strapinventorymovementscalarwherewithaggregatesinputSchema;
