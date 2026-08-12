import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { EnumPurchaseRequestIngressDispositionFilterObjectSchema as EnumPurchaseRequestIngressDispositionFilterObjectSchema } from './EnumPurchaseRequestIngressDispositionFilter.schema';
import { PurchaseRequestIngressDispositionSchema } from '../enums/PurchaseRequestIngressDisposition.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const purchaserequestingressreceiptscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => PurchaseRequestIngressReceiptScalarWhereInputObjectSchema), z.lazy(() => PurchaseRequestIngressReceiptScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => PurchaseRequestIngressReceiptScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => PurchaseRequestIngressReceiptScalarWhereInputObjectSchema), z.lazy(() => PurchaseRequestIngressReceiptScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  requestKey: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  requestHash: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  purchaseRequestId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  disposition: z.union([z.lazy(() => EnumPurchaseRequestIngressDispositionFilterObjectSchema), PurchaseRequestIngressDispositionSchema]).optional(),
  addedItemCount: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const PurchaseRequestIngressReceiptScalarWhereInputObjectSchema: z.ZodType<Prisma.PurchaseRequestIngressReceiptScalarWhereInput> = purchaserequestingressreceiptscalarwhereinputSchema as unknown as z.ZodType<Prisma.PurchaseRequestIngressReceiptScalarWhereInput>;
export const PurchaseRequestIngressReceiptScalarWhereInputObjectZodSchema = purchaserequestingressreceiptscalarwhereinputSchema;
