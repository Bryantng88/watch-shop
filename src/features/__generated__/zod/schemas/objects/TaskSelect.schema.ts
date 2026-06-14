import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserArgsObjectSchema as UserArgsObjectSchema } from './UserArgs.schema';
import { WatchArgsObjectSchema as WatchArgsObjectSchema } from './WatchArgs.schema';
import { OrderArgsObjectSchema as OrderArgsObjectSchema } from './OrderArgs.schema';
import { ShipmentArgsObjectSchema as ShipmentArgsObjectSchema } from './ShipmentArgs.schema';
import { AcquisitionArgsObjectSchema as AcquisitionArgsObjectSchema } from './AcquisitionArgs.schema';
import { ServiceRequestArgsObjectSchema as ServiceRequestArgsObjectSchema } from './ServiceRequestArgs.schema';
import { TechnicalIssueArgsObjectSchema as TechnicalIssueArgsObjectSchema } from './TechnicalIssueArgs.schema';
import { PaymentArgsObjectSchema as PaymentArgsObjectSchema } from './PaymentArgs.schema';
import { WorkCaseArgsObjectSchema as WorkCaseArgsObjectSchema } from './WorkCaseArgs.schema';
import { TaskTypeArgsObjectSchema as TaskTypeArgsObjectSchema } from './TaskTypeArgs.schema';
import { TaskExecutionFindManySchema as TaskExecutionFindManySchema } from '../findManyTaskExecution.schema';
import { NotificationFindManySchema as NotificationFindManySchema } from '../findManyNotification.schema';
import { TaskActionArgsObjectSchema as TaskActionArgsObjectSchema } from './TaskActionArgs.schema';
import { TaskCountOutputTypeArgsObjectSchema as TaskCountOutputTypeArgsObjectSchema } from './TaskCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  title: z.boolean().optional(),
  description: z.boolean().optional(),
  source: z.boolean().optional(),
  domain: z.boolean().optional(),
  taskTypeId: z.boolean().optional(),
  mode: z.boolean().optional(),
  status: z.boolean().optional(),
  priority: z.boolean().optional(),
  dueAt: z.boolean().optional(),
  startedAt: z.boolean().optional(),
  completedAt: z.boolean().optional(),
  cancelledAt: z.boolean().optional(),
  createdByUserId: z.boolean().optional(),
  assignedToUserId: z.boolean().optional(),
  completedByUserId: z.boolean().optional(),
  cancelledByUserId: z.boolean().optional(),
  watchId: z.boolean().optional(),
  orderId: z.boolean().optional(),
  shipmentId: z.boolean().optional(),
  acquisitionId: z.boolean().optional(),
  serviceRequestId: z.boolean().optional(),
  technicalIssueId: z.boolean().optional(),
  paymentId: z.boolean().optional(),
  workCaseId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  createdByUser: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  assignedToUser: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  completedByUser: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  cancelledByUser: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  watch: z.union([z.boolean(), z.lazy(() => WatchArgsObjectSchema)]).optional(),
  order: z.union([z.boolean(), z.lazy(() => OrderArgsObjectSchema)]).optional(),
  shipment: z.union([z.boolean(), z.lazy(() => ShipmentArgsObjectSchema)]).optional(),
  acquisition: z.union([z.boolean(), z.lazy(() => AcquisitionArgsObjectSchema)]).optional(),
  serviceRequest: z.union([z.boolean(), z.lazy(() => ServiceRequestArgsObjectSchema)]).optional(),
  technicalIssue: z.union([z.boolean(), z.lazy(() => TechnicalIssueArgsObjectSchema)]).optional(),
  payment: z.union([z.boolean(), z.lazy(() => PaymentArgsObjectSchema)]).optional(),
  workCase: z.union([z.boolean(), z.lazy(() => WorkCaseArgsObjectSchema)]).optional(),
  taskType: z.union([z.boolean(), z.lazy(() => TaskTypeArgsObjectSchema)]).optional(),
  executions: z.union([z.boolean(), z.lazy(() => TaskExecutionFindManySchema)]).optional(),
  notifications: z.union([z.boolean(), z.lazy(() => NotificationFindManySchema)]).optional(),
  taskAction: z.union([z.boolean(), z.lazy(() => TaskActionArgsObjectSchema)]).optional(),
  taskActionId: z.boolean().optional(),
  _count: z.union([z.boolean(), z.lazy(() => TaskCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const TaskSelectObjectSchema: z.ZodType<Prisma.TaskSelect> = makeSchema() as unknown as z.ZodType<Prisma.TaskSelect>;
export const TaskSelectObjectZodSchema = makeSchema();
