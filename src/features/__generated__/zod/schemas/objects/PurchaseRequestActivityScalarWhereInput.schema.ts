import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { EnumPurchaseRequestActivityTypeFilterObjectSchema as EnumPurchaseRequestActivityTypeFilterObjectSchema } from './EnumPurchaseRequestActivityTypeFilter.schema';
import { PurchaseRequestActivityTypeSchema } from '../enums/PurchaseRequestActivityType.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const purchaserequestactivityscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => PurchaseRequestActivityScalarWhereInputObjectSchema), z.lazy(() => PurchaseRequestActivityScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => PurchaseRequestActivityScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => PurchaseRequestActivityScalarWhereInputObjectSchema), z.lazy(() => PurchaseRequestActivityScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  purchaseRequestId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  type: z.union([z.lazy(() => EnumPurchaseRequestActivityTypeFilterObjectSchema), PurchaseRequestActivityTypeSchema]).optional(),
  note: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  actorUserId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  followUpAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const PurchaseRequestActivityScalarWhereInputObjectSchema: z.ZodType<Prisma.PurchaseRequestActivityScalarWhereInput> = purchaserequestactivityscalarwhereinputSchema as unknown as z.ZodType<Prisma.PurchaseRequestActivityScalarWhereInput>;
export const PurchaseRequestActivityScalarWhereInputObjectZodSchema = purchaserequestactivityscalarwhereinputSchema;
