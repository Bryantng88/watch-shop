import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.boolean().optional(),
  projectionKey: z.boolean().optional(),
  projectionVersion: z.boolean().optional(),
  rowKey: z.boolean().optional(),
  workspaceId: z.boolean().optional(),
  spaceId: z.boolean().optional(),
  entityType: z.boolean().optional(),
  entityId: z.boolean().optional(),
  status: z.boolean().optional(),
  searchText: z.boolean().optional(),
  sortAt: z.boolean().optional(),
  dataJson: z.boolean().optional(),
  sourceUpdatedAt: z.boolean().optional(),
  projectedAt: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional()
}).strict();
export const ProjectionRecordSelectObjectSchema: z.ZodType<Prisma.ProjectionRecordSelect> = makeSchema() as unknown as z.ZodType<Prisma.ProjectionRecordSelect>;
export const ProjectionRecordSelectObjectZodSchema = makeSchema();
