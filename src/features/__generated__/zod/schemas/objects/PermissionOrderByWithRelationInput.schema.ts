import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { RoleOrderByRelationAggregateInputObjectSchema as RoleOrderByRelationAggregateInputObjectSchema } from './RoleOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  roles: z.lazy(() => RoleOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const PermissionOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.PermissionOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.PermissionOrderByWithRelationInput>;
export const PermissionOrderByWithRelationInputObjectZodSchema = makeSchema();
