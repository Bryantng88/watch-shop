import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { CustomerCountOrderByAggregateInputObjectSchema as CustomerCountOrderByAggregateInputObjectSchema } from './CustomerCountOrderByAggregateInput.schema';
import { CustomerMaxOrderByAggregateInputObjectSchema as CustomerMaxOrderByAggregateInputObjectSchema } from './CustomerMaxOrderByAggregateInput.schema';
import { CustomerMinOrderByAggregateInputObjectSchema as CustomerMinOrderByAggregateInputObjectSchema } from './CustomerMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  email: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  phone: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  ward: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  city: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  userId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  address: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  district: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => CustomerCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => CustomerMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => CustomerMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const CustomerOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.CustomerOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerOrderByWithAggregationInput>;
export const CustomerOrderByWithAggregationInputObjectZodSchema = makeSchema();
