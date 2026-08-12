import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { EnumPurchaseRequestIngressDispositionFilterObjectSchema as EnumPurchaseRequestIngressDispositionFilterObjectSchema } from './EnumPurchaseRequestIngressDispositionFilter.schema';
import { PurchaseRequestIngressDispositionSchema } from '../enums/PurchaseRequestIngressDisposition.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { PurchaseRequestScalarRelationFilterObjectSchema as PurchaseRequestScalarRelationFilterObjectSchema } from './PurchaseRequestScalarRelationFilter.schema';
import { PurchaseRequestWhereInputObjectSchema as PurchaseRequestWhereInputObjectSchema } from './PurchaseRequestWhereInput.schema'

const purchaserequestingressreceiptwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => PurchaseRequestIngressReceiptWhereInputObjectSchema), z.lazy(() => PurchaseRequestIngressReceiptWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => PurchaseRequestIngressReceiptWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => PurchaseRequestIngressReceiptWhereInputObjectSchema), z.lazy(() => PurchaseRequestIngressReceiptWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  requestKey: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  requestHash: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  purchaseRequestId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  disposition: z.union([z.lazy(() => EnumPurchaseRequestIngressDispositionFilterObjectSchema), PurchaseRequestIngressDispositionSchema]).optional(),
  addedItemCount: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  purchaseRequest: z.union([z.lazy(() => PurchaseRequestScalarRelationFilterObjectSchema), z.lazy(() => PurchaseRequestWhereInputObjectSchema)]).optional()
}).strict();
export const PurchaseRequestIngressReceiptWhereInputObjectSchema: z.ZodType<Prisma.PurchaseRequestIngressReceiptWhereInput> = purchaserequestingressreceiptwhereinputSchema as unknown as z.ZodType<Prisma.PurchaseRequestIngressReceiptWhereInput>;
export const PurchaseRequestIngressReceiptWhereInputObjectZodSchema = purchaserequestingressreceiptwhereinputSchema;
