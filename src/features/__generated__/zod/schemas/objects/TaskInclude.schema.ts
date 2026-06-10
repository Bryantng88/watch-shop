import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserArgsObjectSchema as UserArgsObjectSchema } from './UserArgs.schema';
import { TaskTypeArgsObjectSchema as TaskTypeArgsObjectSchema } from './TaskTypeArgs.schema';
import { WatchArgsObjectSchema as WatchArgsObjectSchema } from './WatchArgs.schema';
import { OrderArgsObjectSchema as OrderArgsObjectSchema } from './OrderArgs.schema';
import { ShipmentArgsObjectSchema as ShipmentArgsObjectSchema } from './ShipmentArgs.schema';
import { AcquisitionArgsObjectSchema as AcquisitionArgsObjectSchema } from './AcquisitionArgs.schema';
import { ServiceRequestArgsObjectSchema as ServiceRequestArgsObjectSchema } from './ServiceRequestArgs.schema';
import { TechnicalIssueArgsObjectSchema as TechnicalIssueArgsObjectSchema } from './TechnicalIssueArgs.schema';
import { PaymentArgsObjectSchema as PaymentArgsObjectSchema } from './PaymentArgs.schema';
import { WorkCaseArgsObjectSchema as WorkCaseArgsObjectSchema } from './WorkCaseArgs.schema';
import { NotificationFindManySchema as NotificationFindManySchema } from '../findManyNotification.schema';
import { TaskCountOutputTypeArgsObjectSchema as TaskCountOutputTypeArgsObjectSchema } from './TaskCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  createdByUser: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  assignedToUser: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  completedByUser: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  cancelledByUser: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  taskType: z.union([z.boolean(), z.lazy(() => TaskTypeArgsObjectSchema)]).optional(),
  watch: z.union([z.boolean(), z.lazy(() => WatchArgsObjectSchema)]).optional(),
  order: z.union([z.boolean(), z.lazy(() => OrderArgsObjectSchema)]).optional(),
  shipment: z.union([z.boolean(), z.lazy(() => ShipmentArgsObjectSchema)]).optional(),
  acquisition: z.union([z.boolean(), z.lazy(() => AcquisitionArgsObjectSchema)]).optional(),
  serviceRequest: z.union([z.boolean(), z.lazy(() => ServiceRequestArgsObjectSchema)]).optional(),
  technicalIssue: z.union([z.boolean(), z.lazy(() => TechnicalIssueArgsObjectSchema)]).optional(),
  payment: z.union([z.boolean(), z.lazy(() => PaymentArgsObjectSchema)]).optional(),
  workCase: z.union([z.boolean(), z.lazy(() => WorkCaseArgsObjectSchema)]).optional(),
  notifications: z.union([z.boolean(), z.lazy(() => NotificationFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => TaskCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const TaskIncludeObjectSchema: z.ZodType<Prisma.TaskInclude> = makeSchema() as unknown as z.ZodType<Prisma.TaskInclude>;
export const TaskIncludeObjectZodSchema = makeSchema();
