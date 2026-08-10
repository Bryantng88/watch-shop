import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { DecimalWithAggregatesFilterObjectSchema as DecimalWithAggregatesFilterObjectSchema } from './DecimalWithAggregatesFilter.schema';
import { IntWithAggregatesFilterObjectSchema as IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { EnumPurchaseRequestItemDecisionWithAggregatesFilterObjectSchema as EnumPurchaseRequestItemDecisionWithAggregatesFilterObjectSchema } from './EnumPurchaseRequestItemDecisionWithAggregatesFilter.schema';
import { PurchaseRequestItemDecisionSchema } from '../enums/PurchaseRequestItemDecision.schema';
import { DecimalNullableWithAggregatesFilterObjectSchema as DecimalNullableWithAggregatesFilterObjectSchema } from './DecimalNullableWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const purchaserequestitemscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => PurchaseRequestItemScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => PurchaseRequestItemScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => PurchaseRequestItemScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => PurchaseRequestItemScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => PurchaseRequestItemScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  purchaseRequestId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  productId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  titleSnapshot: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  listPriceSnapshot: z.union([z.lazy(() => DecimalWithAggregatesFilterObjectSchema), z.number()]).optional(),
  quantity: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  decision: z.union([z.lazy(() => EnumPurchaseRequestItemDecisionWithAggregatesFilterObjectSchema), PurchaseRequestItemDecisionSchema]).optional(),
  agreedPrice: z.union([z.lazy(() => DecimalNullableWithAggregatesFilterObjectSchema), z.number()]).optional().nullable(),
  decisionReason: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const PurchaseRequestItemScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.PurchaseRequestItemScalarWhereWithAggregatesInput> = purchaserequestitemscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.PurchaseRequestItemScalarWhereWithAggregatesInput>;
export const PurchaseRequestItemScalarWhereWithAggregatesInputObjectZodSchema = purchaserequestitemscalarwherewithaggregatesinputSchema;
