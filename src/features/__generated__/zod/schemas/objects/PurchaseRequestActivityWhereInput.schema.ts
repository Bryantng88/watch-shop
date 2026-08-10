import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { EnumPurchaseRequestActivityTypeFilterObjectSchema as EnumPurchaseRequestActivityTypeFilterObjectSchema } from './EnumPurchaseRequestActivityTypeFilter.schema';
import { PurchaseRequestActivityTypeSchema } from '../enums/PurchaseRequestActivityType.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { PurchaseRequestScalarRelationFilterObjectSchema as PurchaseRequestScalarRelationFilterObjectSchema } from './PurchaseRequestScalarRelationFilter.schema';
import { PurchaseRequestWhereInputObjectSchema as PurchaseRequestWhereInputObjectSchema } from './PurchaseRequestWhereInput.schema';
import { UserNullableScalarRelationFilterObjectSchema as UserNullableScalarRelationFilterObjectSchema } from './UserNullableScalarRelationFilter.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema'

const purchaserequestactivitywhereinputSchema = z.object({
  AND: z.union([z.lazy(() => PurchaseRequestActivityWhereInputObjectSchema), z.lazy(() => PurchaseRequestActivityWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => PurchaseRequestActivityWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => PurchaseRequestActivityWhereInputObjectSchema), z.lazy(() => PurchaseRequestActivityWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  purchaseRequestId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  type: z.union([z.lazy(() => EnumPurchaseRequestActivityTypeFilterObjectSchema), PurchaseRequestActivityTypeSchema]).optional(),
  note: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  actorUserId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  followUpAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  purchaseRequest: z.union([z.lazy(() => PurchaseRequestScalarRelationFilterObjectSchema), z.lazy(() => PurchaseRequestWhereInputObjectSchema)]).optional(),
  actor: z.union([z.lazy(() => UserNullableScalarRelationFilterObjectSchema), z.lazy(() => UserWhereInputObjectSchema)]).optional()
}).strict();
export const PurchaseRequestActivityWhereInputObjectSchema: z.ZodType<Prisma.PurchaseRequestActivityWhereInput> = purchaserequestactivitywhereinputSchema as unknown as z.ZodType<Prisma.PurchaseRequestActivityWhereInput>;
export const PurchaseRequestActivityWhereInputObjectZodSchema = purchaserequestactivitywhereinputSchema;
