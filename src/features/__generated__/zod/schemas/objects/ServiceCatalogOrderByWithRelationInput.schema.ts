import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { MaintenanceRecordOrderByRelationAggregateInputObjectSchema as MaintenanceRecordOrderByRelationAggregateInputObjectSchema } from './MaintenanceRecordOrderByRelationAggregateInput.schema';
import { OrderItemOrderByRelationAggregateInputObjectSchema as OrderItemOrderByRelationAggregateInputObjectSchema } from './OrderItemOrderByRelationAggregateInput.schema';
import { ServiceRequestOrderByRelationAggregateInputObjectSchema as ServiceRequestOrderByRelationAggregateInputObjectSchema } from './ServiceRequestOrderByRelationAggregateInput.schema';
import { TechnicalIssueOrderByRelationAggregateInputObjectSchema as TechnicalIssueOrderByRelationAggregateInputObjectSchema } from './TechnicalIssueOrderByRelationAggregateInput.schema';
import { TaskActionOrderByRelationAggregateInputObjectSchema as TaskActionOrderByRelationAggregateInputObjectSchema } from './TaskActionOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  defaultPrice: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  durationMin: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  isActive: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  detail: SortOrderSchema.optional(),
  vendorPrice: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  customerPrice: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  internalCost: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  categoryKey: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  sortOrder: SortOrderSchema.optional(),
  maintenanceRecord: z.lazy(() => MaintenanceRecordOrderByRelationAggregateInputObjectSchema).optional(),
  orderItem: z.lazy(() => OrderItemOrderByRelationAggregateInputObjectSchema).optional(),
  serviceRequest: z.lazy(() => ServiceRequestOrderByRelationAggregateInputObjectSchema).optional(),
  technicalIssue: z.lazy(() => TechnicalIssueOrderByRelationAggregateInputObjectSchema).optional(),
  taskAction: z.lazy(() => TaskActionOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const ServiceCatalogOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.ServiceCatalogOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogOrderByWithRelationInput>;
export const ServiceCatalogOrderByWithRelationInputObjectZodSchema = makeSchema();
