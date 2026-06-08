import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskFindManySchema as TaskFindManySchema } from '../findManyTask.schema';
import { TaskTypeCountOutputTypeArgsObjectSchema as TaskTypeCountOutputTypeArgsObjectSchema } from './TaskTypeCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  code: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  domain: z.boolean().optional(),
  legacyKind: z.boolean().optional(),
  defaultPriority: z.boolean().optional(),
  completionMode: z.boolean().optional(),
  completionRuleKey: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  tasks: z.union([z.boolean(), z.lazy(() => TaskFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => TaskTypeCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const TaskTypeSelectObjectSchema: z.ZodType<Prisma.TaskTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.TaskTypeSelect>;
export const TaskTypeSelectObjectZodSchema = makeSchema();
