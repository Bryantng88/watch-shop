import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskTypeArgsObjectSchema as TaskTypeArgsObjectSchema } from './TaskTypeArgs.schema';
import { TaskFindManySchema as TaskFindManySchema } from '../findManyTask.schema';
import { ServiceCatalogArgsObjectSchema as ServiceCatalogArgsObjectSchema } from './ServiceCatalogArgs.schema';
import { TechnicalDetailCatalogArgsObjectSchema as TechnicalDetailCatalogArgsObjectSchema } from './TechnicalDetailCatalogArgs.schema';
import { SupplyCatalogArgsObjectSchema as SupplyCatalogArgsObjectSchema } from './SupplyCatalogArgs.schema';
import { MechanicalPartCatalogArgsObjectSchema as MechanicalPartCatalogArgsObjectSchema } from './MechanicalPartCatalogArgs.schema';
import { TaskActionCountOutputTypeArgsObjectSchema as TaskActionCountOutputTypeArgsObjectSchema } from './TaskActionCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  taskTypeId: z.boolean().optional(),
  code: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  completionMode: z.boolean().optional(),
  completionRuleKey: z.boolean().optional(),
  targetType: z.boolean().optional(),
  serviceCatalogId: z.boolean().optional(),
  technicalDetailCatalogId: z.boolean().optional(),
  supplyCatalogId: z.boolean().optional(),
  mechanicalPartCatalogId: z.boolean().optional(),
  technicalActionMode: z.boolean().optional(),
  defaultTitleTemplate: z.boolean().optional(),
  defaultDescriptionTemplate: z.boolean().optional(),
  metadataJson: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  taskType: z.union([z.boolean(), z.lazy(() => TaskTypeArgsObjectSchema)]).optional(),
  tasks: z.union([z.boolean(), z.lazy(() => TaskFindManySchema)]).optional(),
  serviceCatalog: z.union([z.boolean(), z.lazy(() => ServiceCatalogArgsObjectSchema)]).optional(),
  technicalDetailCatalog: z.union([z.boolean(), z.lazy(() => TechnicalDetailCatalogArgsObjectSchema)]).optional(),
  supplyCatalog: z.union([z.boolean(), z.lazy(() => SupplyCatalogArgsObjectSchema)]).optional(),
  mechanicalPartCatalog: z.union([z.boolean(), z.lazy(() => MechanicalPartCatalogArgsObjectSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => TaskActionCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const TaskActionSelectObjectSchema: z.ZodType<Prisma.TaskActionSelect> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionSelect>;
export const TaskActionSelectObjectZodSchema = makeSchema();
