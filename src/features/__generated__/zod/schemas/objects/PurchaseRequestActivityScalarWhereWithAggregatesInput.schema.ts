import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { EnumPurchaseRequestActivityTypeWithAggregatesFilterObjectSchema as EnumPurchaseRequestActivityTypeWithAggregatesFilterObjectSchema } from './EnumPurchaseRequestActivityTypeWithAggregatesFilter.schema';
import { PurchaseRequestActivityTypeSchema } from '../enums/PurchaseRequestActivityType.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { DateTimeNullableWithAggregatesFilterObjectSchema as DateTimeNullableWithAggregatesFilterObjectSchema } from './DateTimeNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const purchaserequestactivityscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => PurchaseRequestActivityScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => PurchaseRequestActivityScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => PurchaseRequestActivityScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => PurchaseRequestActivityScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => PurchaseRequestActivityScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  purchaseRequestId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  type: z.union([z.lazy(() => EnumPurchaseRequestActivityTypeWithAggregatesFilterObjectSchema), PurchaseRequestActivityTypeSchema]).optional(),
  note: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  actorUserId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  followUpAt: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const PurchaseRequestActivityScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.PurchaseRequestActivityScalarWhereWithAggregatesInput> = purchaserequestactivityscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.PurchaseRequestActivityScalarWhereWithAggregatesInput>;
export const PurchaseRequestActivityScalarWhereWithAggregatesInputObjectZodSchema = purchaserequestactivityscalarwherewithaggregatesinputSchema;
