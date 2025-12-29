import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DecimalFilterObjectSchema as DecimalFilterObjectSchema } from './DecimalFilter.schema';
import { Enumdiscount_typeNullableFilterObjectSchema as Enumdiscount_typeNullableFilterObjectSchema } from './Enumdiscount_typeNullableFilter.schema';
import { discount_typeSchema } from '../enums/discount_type.schema';
import { DecimalNullableFilterObjectSchema as DecimalNullableFilterObjectSchema } from './DecimalNullableFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { EnumProductTypeNullableFilterObjectSchema as EnumProductTypeNullableFilterObjectSchema } from './EnumProductTypeNullableFilter.schema';
import { ProductTypeSchema } from '../enums/ProductType.schema';
import { AcquisitionItemListRelationFilterObjectSchema as AcquisitionItemListRelationFilterObjectSchema } from './AcquisitionItemListRelationFilter.schema';
import { OrderScalarRelationFilterObjectSchema as OrderScalarRelationFilterObjectSchema } from './OrderScalarRelationFilter.schema';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './OrderWhereInput.schema';
import { ProductNullableScalarRelationFilterObjectSchema as ProductNullableScalarRelationFilterObjectSchema } from './ProductNullableScalarRelationFilter.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema';
import { ServiceRequestListRelationFilterObjectSchema as ServiceRequestListRelationFilterObjectSchema } from './ServiceRequestListRelationFilter.schema'

const orderitemwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => OrderItemWhereInputObjectSchema), z.lazy(() => OrderItemWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => OrderItemWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => OrderItemWhereInputObjectSchema), z.lazy(() => OrderItemWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  orderId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  productId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  variantId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  listPrice: z.union([z.lazy(() => DecimalFilterObjectSchema), z.number()]).optional(),
  discountType: z.union([z.lazy(() => Enumdiscount_typeNullableFilterObjectSchema), discount_typeSchema]).optional().nullable(),
  discountValue: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  unitPriceAgreed: z.union([z.lazy(() => DecimalFilterObjectSchema), z.number()]).optional(),
  taxRate: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  quantity: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  subtotal: z.union([z.lazy(() => DecimalFilterObjectSchema), z.number()]).optional(),
  img: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  productType: z.union([z.lazy(() => EnumProductTypeNullableFilterObjectSchema), ProductTypeSchema]).optional().nullable(),
  acquisitionItem: z.lazy(() => AcquisitionItemListRelationFilterObjectSchema).optional(),
  order: z.union([z.lazy(() => OrderScalarRelationFilterObjectSchema), z.lazy(() => OrderWhereInputObjectSchema)]).optional(),
  Product: z.union([z.lazy(() => ProductNullableScalarRelationFilterObjectSchema), z.lazy(() => ProductWhereInputObjectSchema)]).optional(),
  serviceRequest: z.lazy(() => ServiceRequestListRelationFilterObjectSchema).optional()
}).strict();
export const OrderItemWhereInputObjectSchema: z.ZodType<Prisma.OrderItemWhereInput> = orderitemwhereinputSchema as unknown as z.ZodType<Prisma.OrderItemWhereInput>;
export const OrderItemWhereInputObjectZodSchema = orderitemwhereinputSchema;
