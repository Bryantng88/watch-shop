import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { VendorCountOrderByAggregateInputObjectSchema as VendorCountOrderByAggregateInputObjectSchema } from './VendorCountOrderByAggregateInput.schema';
import { VendorMaxOrderByAggregateInputObjectSchema as VendorMaxOrderByAggregateInputObjectSchema } from './VendorMaxOrderByAggregateInput.schema';
import { VendorMinOrderByAggregateInputObjectSchema as VendorMinOrderByAggregateInputObjectSchema } from './VendorMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  role: SortOrderSchema.optional(),
  isAuthorized: SortOrderSchema.optional(),
  email: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  phone: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  address: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  bankName: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  bankAcc: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => VendorCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => VendorMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => VendorMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const VendorOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.VendorOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorOrderByWithAggregationInput>;
export const VendorOrderByWithAggregationInputObjectZodSchema = makeSchema();
