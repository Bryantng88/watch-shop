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
  taskType: z.union([z.boolean(), z.lazy(() => TaskTypeArgsObjectSchema)]).optional(),
  tasks: z.union([z.boolean(), z.lazy(() => TaskFindManySchema)]).optional(),
  serviceCatalog: z.union([z.boolean(), z.lazy(() => ServiceCatalogArgsObjectSchema)]).optional(),
  technicalDetailCatalog: z.union([z.boolean(), z.lazy(() => TechnicalDetailCatalogArgsObjectSchema)]).optional(),
  supplyCatalog: z.union([z.boolean(), z.lazy(() => SupplyCatalogArgsObjectSchema)]).optional(),
  mechanicalPartCatalog: z.union([z.boolean(), z.lazy(() => MechanicalPartCatalogArgsObjectSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => TaskActionCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const TaskActionIncludeObjectSchema: z.ZodType<Prisma.TaskActionInclude> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionInclude>;
export const TaskActionIncludeObjectZodSchema = makeSchema();
