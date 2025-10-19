import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { InvoiceItemCountOrderByAggregateInputObjectSchema as InvoiceItemCountOrderByAggregateInputObjectSchema } from './InvoiceItemCountOrderByAggregateInput.schema';
import { InvoiceItemAvgOrderByAggregateInputObjectSchema as InvoiceItemAvgOrderByAggregateInputObjectSchema } from './InvoiceItemAvgOrderByAggregateInput.schema';
import { InvoiceItemMaxOrderByAggregateInputObjectSchema as InvoiceItemMaxOrderByAggregateInputObjectSchema } from './InvoiceItemMaxOrderByAggregateInput.schema';
import { InvoiceItemMinOrderByAggregateInputObjectSchema as InvoiceItemMinOrderByAggregateInputObjectSchema } from './InvoiceItemMinOrderByAggregateInput.schema';
import { InvoiceItemSumOrderByAggregateInputObjectSchema as InvoiceItemSumOrderByAggregateInputObjectSchema } from './InvoiceItemSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  invoiceId: SortOrderSchema.optional(),
  productId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  variantId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  title: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  quantity: SortOrderSchema.optional(),
  unitPrice: SortOrderSchema.optional(),
  discount: SortOrderSchema.optional(),
  taxRate: SortOrderSchema.optional(),
  lineTotal: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => InvoiceItemCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => InvoiceItemAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => InvoiceItemMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => InvoiceItemMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => InvoiceItemSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const InvoiceItemOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.InvoiceItemOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemOrderByWithAggregationInput>;
export const InvoiceItemOrderByWithAggregationInputObjectZodSchema = makeSchema();
