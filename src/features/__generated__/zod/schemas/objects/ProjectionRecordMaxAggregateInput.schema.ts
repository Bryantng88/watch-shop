import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  projectionKey: z.literal(true).optional(),
  projectionVersion: z.literal(true).optional(),
  rowKey: z.literal(true).optional(),
  workspaceId: z.literal(true).optional(),
  spaceId: z.literal(true).optional(),
  entityType: z.literal(true).optional(),
  entityId: z.literal(true).optional(),
  status: z.literal(true).optional(),
  searchText: z.literal(true).optional(),
  sortAt: z.literal(true).optional(),
  sourceUpdatedAt: z.literal(true).optional(),
  projectedAt: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const ProjectionRecordMaxAggregateInputObjectSchema: z.ZodType<Prisma.ProjectionRecordMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ProjectionRecordMaxAggregateInputType>;
export const ProjectionRecordMaxAggregateInputObjectZodSchema = makeSchema();
