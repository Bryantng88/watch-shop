import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { PermissionOrderByRelationAggregateInputObjectSchema as PermissionOrderByRelationAggregateInputObjectSchema } from './PermissionOrderByRelationAggregateInput.schema';
import { UserOrderByRelationAggregateInputObjectSchema as UserOrderByRelationAggregateInputObjectSchema } from './UserOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  permissions: z.lazy(() => PermissionOrderByRelationAggregateInputObjectSchema).optional(),
  users: z.lazy(() => UserOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const RoleOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.RoleOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleOrderByWithRelationInput>;
export const RoleOrderByWithRelationInputObjectZodSchema = makeSchema();
