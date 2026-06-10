import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { EnumTaskSourceFilterObjectSchema as EnumTaskSourceFilterObjectSchema } from './EnumTaskSourceFilter.schema';
import { TaskSourceSchema } from '../enums/TaskSource.schema';
import { EnumTaskKindFilterObjectSchema as EnumTaskKindFilterObjectSchema } from './EnumTaskKindFilter.schema';
import { TaskKindSchema } from '../enums/TaskKind.schema';
import { EnumTaskStatusFilterObjectSchema as EnumTaskStatusFilterObjectSchema } from './EnumTaskStatusFilter.schema';
import { TaskStatusSchema } from '../enums/TaskStatus.schema';
import { EnumTaskPriorityFilterObjectSchema as EnumTaskPriorityFilterObjectSchema } from './EnumTaskPriorityFilter.schema';
import { TaskPrioritySchema } from '../enums/TaskPriority.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { UuidNullableFilterObjectSchema as UuidNullableFilterObjectSchema } from './UuidNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { UserNullableScalarRelationFilterObjectSchema as UserNullableScalarRelationFilterObjectSchema } from './UserNullableScalarRelationFilter.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { WatchNullableScalarRelationFilterObjectSchema as WatchNullableScalarRelationFilterObjectSchema } from './WatchNullableScalarRelationFilter.schema';
import { WatchWhereInputObjectSchema as WatchWhereInputObjectSchema } from './WatchWhereInput.schema';
import { OrderNullableScalarRelationFilterObjectSchema as OrderNullableScalarRelationFilterObjectSchema } from './OrderNullableScalarRelationFilter.schema';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './OrderWhereInput.schema';
import { ShipmentNullableScalarRelationFilterObjectSchema as ShipmentNullableScalarRelationFilterObjectSchema } from './ShipmentNullableScalarRelationFilter.schema';
import { ShipmentWhereInputObjectSchema as ShipmentWhereInputObjectSchema } from './ShipmentWhereInput.schema';
import { AcquisitionNullableScalarRelationFilterObjectSchema as AcquisitionNullableScalarRelationFilterObjectSchema } from './AcquisitionNullableScalarRelationFilter.schema';
import { AcquisitionWhereInputObjectSchema as AcquisitionWhereInputObjectSchema } from './AcquisitionWhereInput.schema';
import { ServiceRequestNullableScalarRelationFilterObjectSchema as ServiceRequestNullableScalarRelationFilterObjectSchema } from './ServiceRequestNullableScalarRelationFilter.schema';
import { ServiceRequestWhereInputObjectSchema as ServiceRequestWhereInputObjectSchema } from './ServiceRequestWhereInput.schema';
import { TechnicalIssueNullableScalarRelationFilterObjectSchema as TechnicalIssueNullableScalarRelationFilterObjectSchema } from './TechnicalIssueNullableScalarRelationFilter.schema';
import { TechnicalIssueWhereInputObjectSchema as TechnicalIssueWhereInputObjectSchema } from './TechnicalIssueWhereInput.schema';
import { PaymentNullableScalarRelationFilterObjectSchema as PaymentNullableScalarRelationFilterObjectSchema } from './PaymentNullableScalarRelationFilter.schema';
import { PaymentWhereInputObjectSchema as PaymentWhereInputObjectSchema } from './PaymentWhereInput.schema';
import { WorkCaseNullableScalarRelationFilterObjectSchema as WorkCaseNullableScalarRelationFilterObjectSchema } from './WorkCaseNullableScalarRelationFilter.schema';
import { WorkCaseWhereInputObjectSchema as WorkCaseWhereInputObjectSchema } from './WorkCaseWhereInput.schema';
import { NotificationListRelationFilterObjectSchema as NotificationListRelationFilterObjectSchema } from './NotificationListRelationFilter.schema'

const taskwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => TaskWhereInputObjectSchema), z.lazy(() => TaskWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TaskWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TaskWhereInputObjectSchema), z.lazy(() => TaskWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  source: z.union([z.lazy(() => EnumTaskSourceFilterObjectSchema), TaskSourceSchema]).optional(),
  kind: z.union([z.lazy(() => EnumTaskKindFilterObjectSchema), TaskKindSchema]).optional(),
  status: z.union([z.lazy(() => EnumTaskStatusFilterObjectSchema), TaskStatusSchema]).optional(),
  priority: z.union([z.lazy(() => EnumTaskPriorityFilterObjectSchema), TaskPrioritySchema]).optional(),
  dueAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  startedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  completedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  cancelledAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  createdByUserId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  assignedToUserId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  completedByUserId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  cancelledByUserId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  watchId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  orderId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  shipmentId: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  acquisitionId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  serviceRequestId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  technicalIssueId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  paymentId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  workCaseId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  createdByUser: z.union([z.lazy(() => UserNullableScalarRelationFilterObjectSchema), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  assignedToUser: z.union([z.lazy(() => UserNullableScalarRelationFilterObjectSchema), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  completedByUser: z.union([z.lazy(() => UserNullableScalarRelationFilterObjectSchema), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  cancelledByUser: z.union([z.lazy(() => UserNullableScalarRelationFilterObjectSchema), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  watch: z.union([z.lazy(() => WatchNullableScalarRelationFilterObjectSchema), z.lazy(() => WatchWhereInputObjectSchema)]).optional(),
  order: z.union([z.lazy(() => OrderNullableScalarRelationFilterObjectSchema), z.lazy(() => OrderWhereInputObjectSchema)]).optional(),
  shipment: z.union([z.lazy(() => ShipmentNullableScalarRelationFilterObjectSchema), z.lazy(() => ShipmentWhereInputObjectSchema)]).optional(),
  acquisition: z.union([z.lazy(() => AcquisitionNullableScalarRelationFilterObjectSchema), z.lazy(() => AcquisitionWhereInputObjectSchema)]).optional(),
  serviceRequest: z.union([z.lazy(() => ServiceRequestNullableScalarRelationFilterObjectSchema), z.lazy(() => ServiceRequestWhereInputObjectSchema)]).optional(),
  technicalIssue: z.union([z.lazy(() => TechnicalIssueNullableScalarRelationFilterObjectSchema), z.lazy(() => TechnicalIssueWhereInputObjectSchema)]).optional(),
  payment: z.union([z.lazy(() => PaymentNullableScalarRelationFilterObjectSchema), z.lazy(() => PaymentWhereInputObjectSchema)]).optional(),
  workCase: z.union([z.lazy(() => WorkCaseNullableScalarRelationFilterObjectSchema), z.lazy(() => WorkCaseWhereInputObjectSchema)]).optional(),
  notifications: z.lazy(() => NotificationListRelationFilterObjectSchema).optional()
}).strict();
export const TaskWhereInputObjectSchema: z.ZodType<Prisma.TaskWhereInput> = taskwhereinputSchema as unknown as z.ZodType<Prisma.TaskWhereInput>;
export const TaskWhereInputObjectZodSchema = taskwhereinputSchema;
