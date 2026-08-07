import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { DecimalFilterObjectSchema as DecimalFilterObjectSchema } from './DecimalFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { PurchaseRequestScalarRelationFilterObjectSchema as PurchaseRequestScalarRelationFilterObjectSchema } from './PurchaseRequestScalarRelationFilter.schema';
import { PurchaseRequestWhereInputObjectSchema as PurchaseRequestWhereInputObjectSchema } from './PurchaseRequestWhereInput.schema';
import { ProductScalarRelationFilterObjectSchema as ProductScalarRelationFilterObjectSchema } from './ProductScalarRelationFilter.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema'

const purchaserequestitemwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => PurchaseRequestItemWhereInputObjectSchema), z.lazy(() => PurchaseRequestItemWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => PurchaseRequestItemWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => PurchaseRequestItemWhereInputObjectSchema), z.lazy(() => PurchaseRequestItemWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  purchaseRequestId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  productId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  titleSnapshot: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  listPriceSnapshot: z.union([z.lazy(() => DecimalFilterObjectSchema), z.number()]).optional(),
  quantity: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  purchaseRequest: z.union([z.lazy(() => PurchaseRequestScalarRelationFilterObjectSchema), z.lazy(() => PurchaseRequestWhereInputObjectSchema)]).optional(),
  product: z.union([z.lazy(() => ProductScalarRelationFilterObjectSchema), z.lazy(() => ProductWhereInputObjectSchema)]).optional()
}).strict();
export const PurchaseRequestItemWhereInputObjectSchema: z.ZodType<Prisma.PurchaseRequestItemWhereInput> = purchaserequestitemwhereinputSchema as unknown as z.ZodType<Prisma.PurchaseRequestItemWhereInput>;
export const PurchaseRequestItemWhereInputObjectZodSchema = purchaserequestitemwhereinputSchema;
