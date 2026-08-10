import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { DecimalFilterObjectSchema as DecimalFilterObjectSchema } from './DecimalFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { EnumPurchaseRequestItemDecisionFilterObjectSchema as EnumPurchaseRequestItemDecisionFilterObjectSchema } from './EnumPurchaseRequestItemDecisionFilter.schema';
import { PurchaseRequestItemDecisionSchema } from '../enums/PurchaseRequestItemDecision.schema';
import { DecimalNullableFilterObjectSchema as DecimalNullableFilterObjectSchema } from './DecimalNullableFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const purchaserequestitemscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => PurchaseRequestItemScalarWhereInputObjectSchema), z.lazy(() => PurchaseRequestItemScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => PurchaseRequestItemScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => PurchaseRequestItemScalarWhereInputObjectSchema), z.lazy(() => PurchaseRequestItemScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  purchaseRequestId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  productId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  titleSnapshot: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  listPriceSnapshot: z.union([z.lazy(() => DecimalFilterObjectSchema), z.number()]).optional(),
  quantity: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  decision: z.union([z.lazy(() => EnumPurchaseRequestItemDecisionFilterObjectSchema), PurchaseRequestItemDecisionSchema]).optional(),
  agreedPrice: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  decisionReason: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const PurchaseRequestItemScalarWhereInputObjectSchema: z.ZodType<Prisma.PurchaseRequestItemScalarWhereInput> = purchaserequestitemscalarwhereinputSchema as unknown as z.ZodType<Prisma.PurchaseRequestItemScalarWhereInput>;
export const PurchaseRequestItemScalarWhereInputObjectZodSchema = purchaserequestitemscalarwhereinputSchema;
