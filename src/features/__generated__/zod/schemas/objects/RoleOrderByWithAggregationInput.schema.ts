import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { RoleCountOrderByAggregateInputObjectSchema as RoleCountOrderByAggregateInputObjectSchema } from './RoleCountOrderByAggregateInput.schema';
import { RoleMaxOrderByAggregateInputObjectSchema as RoleMaxOrderByAggregateInputObjectSchema } from './RoleMaxOrderByAggregateInput.schema';
import { RoleMinOrderByAggregateInputObjectSchema as RoleMinOrderByAggregateInputObjectSchema } from './RoleMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => RoleCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => RoleMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => RoleMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const RoleOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.RoleOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleOrderByWithAggregationInput>;
export const RoleOrderByWithAggregationInputObjectZodSchema = makeSchema();
