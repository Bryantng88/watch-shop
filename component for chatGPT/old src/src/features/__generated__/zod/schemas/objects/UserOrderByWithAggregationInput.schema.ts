import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { UserCountOrderByAggregateInputObjectSchema as UserCountOrderByAggregateInputObjectSchema } from './UserCountOrderByAggregateInput.schema';
import { UserMaxOrderByAggregateInputObjectSchema as UserMaxOrderByAggregateInputObjectSchema } from './UserMaxOrderByAggregateInput.schema';
import { UserMinOrderByAggregateInputObjectSchema as UserMinOrderByAggregateInputObjectSchema } from './UserMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  email: SortOrderSchema.optional(),
  passwordHash: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  name: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  avatarUrl: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  isActive: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  roleId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const UserOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.UserOrderByWithAggregationInput>;
export const UserOrderByWithAggregationInputObjectZodSchema = makeSchema();
