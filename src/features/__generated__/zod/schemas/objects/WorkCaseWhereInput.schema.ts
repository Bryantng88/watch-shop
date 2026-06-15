import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { EnumWorkCaseScopeFilterObjectSchema as EnumWorkCaseScopeFilterObjectSchema } from './EnumWorkCaseScopeFilter.schema';
import { WorkCaseScopeSchema } from '../enums/WorkCaseScope.schema';
import { EnumWorkCaseStatusFilterObjectSchema as EnumWorkCaseStatusFilterObjectSchema } from './EnumWorkCaseStatusFilter.schema';
import { WorkCaseStatusSchema } from '../enums/WorkCaseStatus.schema';
import { EnumTaskPriorityFilterObjectSchema as EnumTaskPriorityFilterObjectSchema } from './EnumTaskPriorityFilter.schema';
import { TaskPrioritySchema } from '../enums/TaskPriority.schema';
import { UuidNullableFilterObjectSchema as UuidNullableFilterObjectSchema } from './UuidNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { WatchNullableScalarRelationFilterObjectSchema as WatchNullableScalarRelationFilterObjectSchema } from './WatchNullableScalarRelationFilter.schema';
import { WatchWhereInputObjectSchema as WatchWhereInputObjectSchema } from './WatchWhereInput.schema';
import { OrderNullableScalarRelationFilterObjectSchema as OrderNullableScalarRelationFilterObjectSchema } from './OrderNullableScalarRelationFilter.schema';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './OrderWhereInput.schema';
import { ShipmentNullableScalarRelationFilterObjectSchema as ShipmentNullableScalarRelationFilterObjectSchema } from './ShipmentNullableScalarRelationFilter.schema';
import { ShipmentWhereInputObjectSchema as ShipmentWhereInputObjectSchema } from './ShipmentWhereInput.schema';
import { WorkCaseCategoryNullableScalarRelationFilterObjectSchema as WorkCaseCategoryNullableScalarRelationFilterObjectSchema } from './WorkCaseCategoryNullableScalarRelationFilter.schema';
import { WorkCaseCategoryWhereInputObjectSchema as WorkCaseCategoryWhereInputObjectSchema } from './WorkCaseCategoryWhereInput.schema';
import { UserNullableScalarRelationFilterObjectSchema as UserNullableScalarRelationFilterObjectSchema } from './UserNullableScalarRelationFilter.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { TaskListRelationFilterObjectSchema as TaskListRelationFilterObjectSchema } from './TaskListRelationFilter.schema';
import { ServiceRequestListRelationFilterObjectSchema as ServiceRequestListRelationFilterObjectSchema } from './ServiceRequestListRelationFilter.schema';
import { WorkCaseActivityListRelationFilterObjectSchema as WorkCaseActivityListRelationFilterObjectSchema } from './WorkCaseActivityListRelationFilter.schema'

const workcasewhereinputSchema = z.object({
  AND: z.union([z.lazy(() => WorkCaseWhereInputObjectSchema), z.lazy(() => WorkCaseWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => WorkCaseWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => WorkCaseWhereInputObjectSchema), z.lazy(() => WorkCaseWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  refNo: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  scope: z.union([z.lazy(() => EnumWorkCaseScopeFilterObjectSchema), WorkCaseScopeSchema]).optional(),
  status: z.union([z.lazy(() => EnumWorkCaseStatusFilterObjectSchema), WorkCaseStatusSchema]).optional(),
  priority: z.union([z.lazy(() => EnumTaskPriorityFilterObjectSchema), TaskPrioritySchema]).optional(),
  watchId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  categoryId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  orderId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  shipmentId: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  raisedByUserId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  assignedToUserId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  triagedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  resolvedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  cancelledAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  watch: z.union([z.lazy(() => WatchNullableScalarRelationFilterObjectSchema), z.lazy(() => WatchWhereInputObjectSchema)]).optional(),
  order: z.union([z.lazy(() => OrderNullableScalarRelationFilterObjectSchema), z.lazy(() => OrderWhereInputObjectSchema)]).optional(),
  shipment: z.union([z.lazy(() => ShipmentNullableScalarRelationFilterObjectSchema), z.lazy(() => ShipmentWhereInputObjectSchema)]).optional(),
  category: z.union([z.lazy(() => WorkCaseCategoryNullableScalarRelationFilterObjectSchema), z.lazy(() => WorkCaseCategoryWhereInputObjectSchema)]).optional(),
  raisedByUser: z.union([z.lazy(() => UserNullableScalarRelationFilterObjectSchema), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  assignedToUser: z.union([z.lazy(() => UserNullableScalarRelationFilterObjectSchema), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  tasks: z.lazy(() => TaskListRelationFilterObjectSchema).optional(),
  serviceRequests: z.lazy(() => ServiceRequestListRelationFilterObjectSchema).optional(),
  activities: z.lazy(() => WorkCaseActivityListRelationFilterObjectSchema).optional()
}).strict();
export const WorkCaseWhereInputObjectSchema: z.ZodType<Prisma.WorkCaseWhereInput> = workcasewhereinputSchema as unknown as z.ZodType<Prisma.WorkCaseWhereInput>;
export const WorkCaseWhereInputObjectZodSchema = workcasewhereinputSchema;
