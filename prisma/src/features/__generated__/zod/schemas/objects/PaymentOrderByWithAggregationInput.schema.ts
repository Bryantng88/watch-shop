import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { PaymentCountOrderByAggregateInputObjectSchema as PaymentCountOrderByAggregateInputObjectSchema } from './PaymentCountOrderByAggregateInput.schema';
import { PaymentAvgOrderByAggregateInputObjectSchema as PaymentAvgOrderByAggregateInputObjectSchema } from './PaymentAvgOrderByAggregateInput.schema';
import { PaymentMaxOrderByAggregateInputObjectSchema as PaymentMaxOrderByAggregateInputObjectSchema } from './PaymentMaxOrderByAggregateInput.schema';
import { PaymentMinOrderByAggregateInputObjectSchema as PaymentMinOrderByAggregateInputObjectSchema } from './PaymentMinOrderByAggregateInput.schema';
import { PaymentSumOrderByAggregateInputObjectSchema as PaymentSumOrderByAggregateInputObjectSchema } from './PaymentSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  invoiceId: SortOrderSchema.optional(),
  method: SortOrderSchema.optional(),
  amount: SortOrderSchema.optional(),
  currency: SortOrderSchema.optional(),
  paidAt: SortOrderSchema.optional(),
  reference: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  _count: z.lazy(() => PaymentCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => PaymentAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => PaymentMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => PaymentMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => PaymentSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const PaymentOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.PaymentOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.PaymentOrderByWithAggregationInput>;
export const PaymentOrderByWithAggregationInputObjectZodSchema = makeSchema();
