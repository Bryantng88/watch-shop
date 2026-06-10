import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { WorkCaseOrderByWithRelationInputObjectSchema as WorkCaseOrderByWithRelationInputObjectSchema } from './WorkCaseOrderByWithRelationInput.schema';
import { UserOrderByWithRelationInputObjectSchema as UserOrderByWithRelationInputObjectSchema } from './UserOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  workCaseId: SortOrderSchema.optional(),
  actorId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  action: SortOrderSchema.optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  metadata: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  workCase: z.lazy(() => WorkCaseOrderByWithRelationInputObjectSchema).optional(),
  actor: z.lazy(() => UserOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const WorkCaseActivityOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.WorkCaseActivityOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseActivityOrderByWithRelationInput>;
export const WorkCaseActivityOrderByWithRelationInputObjectZodSchema = makeSchema();
