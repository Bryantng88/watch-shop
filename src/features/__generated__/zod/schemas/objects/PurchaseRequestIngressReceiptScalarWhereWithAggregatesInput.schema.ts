import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { EnumPurchaseRequestIngressDispositionWithAggregatesFilterObjectSchema as EnumPurchaseRequestIngressDispositionWithAggregatesFilterObjectSchema } from './EnumPurchaseRequestIngressDispositionWithAggregatesFilter.schema';
import { PurchaseRequestIngressDispositionSchema } from '../enums/PurchaseRequestIngressDisposition.schema';
import { IntWithAggregatesFilterObjectSchema as IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const purchaserequestingressreceiptscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => PurchaseRequestIngressReceiptScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => PurchaseRequestIngressReceiptScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => PurchaseRequestIngressReceiptScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => PurchaseRequestIngressReceiptScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => PurchaseRequestIngressReceiptScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  requestKey: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  requestHash: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  purchaseRequestId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  disposition: z.union([z.lazy(() => EnumPurchaseRequestIngressDispositionWithAggregatesFilterObjectSchema), PurchaseRequestIngressDispositionSchema]).optional(),
  addedItemCount: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const PurchaseRequestIngressReceiptScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.PurchaseRequestIngressReceiptScalarWhereWithAggregatesInput> = purchaserequestingressreceiptscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.PurchaseRequestIngressReceiptScalarWhereWithAggregatesInput>;
export const PurchaseRequestIngressReceiptScalarWhereWithAggregatesInputObjectZodSchema = purchaserequestingressreceiptscalarwherewithaggregatesinputSchema;
