import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  taskTypeId: z.literal(true).optional(),
  code: z.literal(true).optional(),
  name: z.literal(true).optional(),
  description: z.literal(true).optional(),
  completionMode: z.literal(true).optional(),
  completionRuleKey: z.literal(true).optional(),
  targetType: z.literal(true).optional(),
  serviceCatalogId: z.literal(true).optional(),
  technicalDetailCatalogId: z.literal(true).optional(),
  supplyCatalogId: z.literal(true).optional(),
  mechanicalPartCatalogId: z.literal(true).optional(),
  technicalActionMode: z.literal(true).optional(),
  defaultTitleTemplate: z.literal(true).optional(),
  defaultDescriptionTemplate: z.literal(true).optional(),
  isActive: z.literal(true).optional(),
  sortOrder: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const TaskActionMaxAggregateInputObjectSchema: z.ZodType<Prisma.TaskActionMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionMaxAggregateInputType>;
export const TaskActionMaxAggregateInputObjectZodSchema = makeSchema();
