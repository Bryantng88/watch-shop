import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { UserOrderByWithRelationInputObjectSchema as UserOrderByWithRelationInputObjectSchema } from './UserOrderByWithRelationInput.schema';
import { WatchOrderByWithRelationInputObjectSchema as WatchOrderByWithRelationInputObjectSchema } from './WatchOrderByWithRelationInput.schema';
import { OrderOrderByWithRelationInputObjectSchema as OrderOrderByWithRelationInputObjectSchema } from './OrderOrderByWithRelationInput.schema';
import { ShipmentOrderByWithRelationInputObjectSchema as ShipmentOrderByWithRelationInputObjectSchema } from './ShipmentOrderByWithRelationInput.schema';
import { AcquisitionOrderByWithRelationInputObjectSchema as AcquisitionOrderByWithRelationInputObjectSchema } from './AcquisitionOrderByWithRelationInput.schema';
import { ServiceRequestOrderByWithRelationInputObjectSchema as ServiceRequestOrderByWithRelationInputObjectSchema } from './ServiceRequestOrderByWithRelationInput.schema';
import { TechnicalIssueOrderByWithRelationInputObjectSchema as TechnicalIssueOrderByWithRelationInputObjectSchema } from './TechnicalIssueOrderByWithRelationInput.schema';
import { PaymentOrderByWithRelationInputObjectSchema as PaymentOrderByWithRelationInputObjectSchema } from './PaymentOrderByWithRelationInput.schema';
import { WorkCaseOrderByWithRelationInputObjectSchema as WorkCaseOrderByWithRelationInputObjectSchema } from './WorkCaseOrderByWithRelationInput.schema';
import { TaskTypeOrderByWithRelationInputObjectSchema as TaskTypeOrderByWithRelationInputObjectSchema } from './TaskTypeOrderByWithRelationInput.schema';
import { TaskExecutionOrderByRelationAggregateInputObjectSchema as TaskExecutionOrderByRelationAggregateInputObjectSchema } from './TaskExecutionOrderByRelationAggregateInput.schema';
import { NotificationOrderByRelationAggregateInputObjectSchema as NotificationOrderByRelationAggregateInputObjectSchema } from './NotificationOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  source: SortOrderSchema.optional(),
  domain: SortOrderSchema.optional(),
  taskTypeId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  mode: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  priority: SortOrderSchema.optional(),
  dueAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  startedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  completedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  cancelledAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdByUserId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  assignedToUserId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  completedByUserId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  cancelledByUserId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  watchId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  orderId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  shipmentId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  acquisitionId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  serviceRequestId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  technicalIssueId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  paymentId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  workCaseId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  createdByUser: z.lazy(() => UserOrderByWithRelationInputObjectSchema).optional(),
  assignedToUser: z.lazy(() => UserOrderByWithRelationInputObjectSchema).optional(),
  completedByUser: z.lazy(() => UserOrderByWithRelationInputObjectSchema).optional(),
  cancelledByUser: z.lazy(() => UserOrderByWithRelationInputObjectSchema).optional(),
  watch: z.lazy(() => WatchOrderByWithRelationInputObjectSchema).optional(),
  order: z.lazy(() => OrderOrderByWithRelationInputObjectSchema).optional(),
  shipment: z.lazy(() => ShipmentOrderByWithRelationInputObjectSchema).optional(),
  acquisition: z.lazy(() => AcquisitionOrderByWithRelationInputObjectSchema).optional(),
  serviceRequest: z.lazy(() => ServiceRequestOrderByWithRelationInputObjectSchema).optional(),
  technicalIssue: z.lazy(() => TechnicalIssueOrderByWithRelationInputObjectSchema).optional(),
  payment: z.lazy(() => PaymentOrderByWithRelationInputObjectSchema).optional(),
  workCase: z.lazy(() => WorkCaseOrderByWithRelationInputObjectSchema).optional(),
  taskType: z.lazy(() => TaskTypeOrderByWithRelationInputObjectSchema).optional(),
  executions: z.lazy(() => TaskExecutionOrderByRelationAggregateInputObjectSchema).optional(),
  notifications: z.lazy(() => NotificationOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const TaskOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.TaskOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskOrderByWithRelationInput>;
export const TaskOrderByWithRelationInputObjectZodSchema = makeSchema();
