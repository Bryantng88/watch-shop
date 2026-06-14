import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { TaskTypeOrderByWithRelationInputObjectSchema as TaskTypeOrderByWithRelationInputObjectSchema } from './TaskTypeOrderByWithRelationInput.schema';
import { TaskOrderByRelationAggregateInputObjectSchema as TaskOrderByRelationAggregateInputObjectSchema } from './TaskOrderByRelationAggregateInput.schema';
import { ServiceCatalogOrderByWithRelationInputObjectSchema as ServiceCatalogOrderByWithRelationInputObjectSchema } from './ServiceCatalogOrderByWithRelationInput.schema';
import { TechnicalDetailCatalogOrderByWithRelationInputObjectSchema as TechnicalDetailCatalogOrderByWithRelationInputObjectSchema } from './TechnicalDetailCatalogOrderByWithRelationInput.schema';
import { SupplyCatalogOrderByWithRelationInputObjectSchema as SupplyCatalogOrderByWithRelationInputObjectSchema } from './SupplyCatalogOrderByWithRelationInput.schema';
import { MechanicalPartCatalogOrderByWithRelationInputObjectSchema as MechanicalPartCatalogOrderByWithRelationInputObjectSchema } from './MechanicalPartCatalogOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  taskTypeId: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  completionMode: SortOrderSchema.optional(),
  completionRuleKey: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  targetType: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  serviceCatalogId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  technicalDetailCatalogId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  supplyCatalogId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  mechanicalPartCatalogId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  technicalActionMode: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  defaultTitleTemplate: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  defaultDescriptionTemplate: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  metadataJson: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  isActive: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  taskType: z.lazy(() => TaskTypeOrderByWithRelationInputObjectSchema).optional(),
  tasks: z.lazy(() => TaskOrderByRelationAggregateInputObjectSchema).optional(),
  serviceCatalog: z.lazy(() => ServiceCatalogOrderByWithRelationInputObjectSchema).optional(),
  technicalDetailCatalog: z.lazy(() => TechnicalDetailCatalogOrderByWithRelationInputObjectSchema).optional(),
  supplyCatalog: z.lazy(() => SupplyCatalogOrderByWithRelationInputObjectSchema).optional(),
  mechanicalPartCatalog: z.lazy(() => MechanicalPartCatalogOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const TaskActionOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.TaskActionOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionOrderByWithRelationInput>;
export const TaskActionOrderByWithRelationInputObjectZodSchema = makeSchema();
