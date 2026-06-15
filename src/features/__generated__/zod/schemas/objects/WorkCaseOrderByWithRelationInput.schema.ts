import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { WatchOrderByWithRelationInputObjectSchema as WatchOrderByWithRelationInputObjectSchema } from './WatchOrderByWithRelationInput.schema';
import { OrderOrderByWithRelationInputObjectSchema as OrderOrderByWithRelationInputObjectSchema } from './OrderOrderByWithRelationInput.schema';
import { ShipmentOrderByWithRelationInputObjectSchema as ShipmentOrderByWithRelationInputObjectSchema } from './ShipmentOrderByWithRelationInput.schema';
import { WorkCaseCategoryOrderByWithRelationInputObjectSchema as WorkCaseCategoryOrderByWithRelationInputObjectSchema } from './WorkCaseCategoryOrderByWithRelationInput.schema';
import { UserOrderByWithRelationInputObjectSchema as UserOrderByWithRelationInputObjectSchema } from './UserOrderByWithRelationInput.schema';
import { TaskOrderByRelationAggregateInputObjectSchema as TaskOrderByRelationAggregateInputObjectSchema } from './TaskOrderByRelationAggregateInput.schema';
import { ServiceRequestOrderByRelationAggregateInputObjectSchema as ServiceRequestOrderByRelationAggregateInputObjectSchema } from './ServiceRequestOrderByRelationAggregateInput.schema';
import { WorkCaseActivityOrderByRelationAggregateInputObjectSchema as WorkCaseActivityOrderByRelationAggregateInputObjectSchema } from './WorkCaseActivityOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  refNo: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  title: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  scope: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  priority: SortOrderSchema.optional(),
  watchId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  categoryId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  orderId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  shipmentId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  raisedByUserId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  assignedToUserId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  triagedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  resolvedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  cancelledAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  watch: z.lazy(() => WatchOrderByWithRelationInputObjectSchema).optional(),
  order: z.lazy(() => OrderOrderByWithRelationInputObjectSchema).optional(),
  shipment: z.lazy(() => ShipmentOrderByWithRelationInputObjectSchema).optional(),
  category: z.lazy(() => WorkCaseCategoryOrderByWithRelationInputObjectSchema).optional(),
  raisedByUser: z.lazy(() => UserOrderByWithRelationInputObjectSchema).optional(),
  assignedToUser: z.lazy(() => UserOrderByWithRelationInputObjectSchema).optional(),
  tasks: z.lazy(() => TaskOrderByRelationAggregateInputObjectSchema).optional(),
  serviceRequests: z.lazy(() => ServiceRequestOrderByRelationAggregateInputObjectSchema).optional(),
  activities: z.lazy(() => WorkCaseActivityOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const WorkCaseOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.WorkCaseOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseOrderByWithRelationInput>;
export const WorkCaseOrderByWithRelationInputObjectZodSchema = makeSchema();
