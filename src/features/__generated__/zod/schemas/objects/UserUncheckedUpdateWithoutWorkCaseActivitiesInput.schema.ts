import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema as BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { CustomerUncheckedUpdateOneWithoutUserNestedInputObjectSchema as CustomerUncheckedUpdateOneWithoutUserNestedInputObjectSchema } from './CustomerUncheckedUpdateOneWithoutUserNestedInput.schema';
import { MaintenanceRecordUncheckedUpdateManyWithoutUserNestedInputObjectSchema as MaintenanceRecordUncheckedUpdateManyWithoutUserNestedInputObjectSchema } from './MaintenanceRecordUncheckedUpdateManyWithoutUserNestedInput.schema';
import { NotificationUncheckedUpdateManyWithoutUserNestedInputObjectSchema as NotificationUncheckedUpdateManyWithoutUserNestedInputObjectSchema } from './NotificationUncheckedUpdateManyWithoutUserNestedInput.schema';
import { ServiceRequestUncheckedUpdateManyWithoutUserNestedInputObjectSchema as ServiceRequestUncheckedUpdateManyWithoutUserNestedInputObjectSchema } from './ServiceRequestUncheckedUpdateManyWithoutUserNestedInput.schema';
import { TechnicalIssueUncheckedUpdateManyWithoutUserNestedInputObjectSchema as TechnicalIssueUncheckedUpdateManyWithoutUserNestedInputObjectSchema } from './TechnicalIssueUncheckedUpdateManyWithoutUserNestedInput.schema';
import { RoleUncheckedUpdateManyWithoutUsersNestedInputObjectSchema as RoleUncheckedUpdateManyWithoutUsersNestedInputObjectSchema } from './RoleUncheckedUpdateManyWithoutUsersNestedInput.schema';
import { TaskUncheckedUpdateManyWithoutCreatedByUserNestedInputObjectSchema as TaskUncheckedUpdateManyWithoutCreatedByUserNestedInputObjectSchema } from './TaskUncheckedUpdateManyWithoutCreatedByUserNestedInput.schema';
import { TaskUncheckedUpdateManyWithoutAssignedToUserNestedInputObjectSchema as TaskUncheckedUpdateManyWithoutAssignedToUserNestedInputObjectSchema } from './TaskUncheckedUpdateManyWithoutAssignedToUserNestedInput.schema';
import { TaskUncheckedUpdateManyWithoutCompletedByUserNestedInputObjectSchema as TaskUncheckedUpdateManyWithoutCompletedByUserNestedInputObjectSchema } from './TaskUncheckedUpdateManyWithoutCompletedByUserNestedInput.schema';
import { TaskUncheckedUpdateManyWithoutCancelledByUserNestedInputObjectSchema as TaskUncheckedUpdateManyWithoutCancelledByUserNestedInputObjectSchema } from './TaskUncheckedUpdateManyWithoutCancelledByUserNestedInput.schema';
import { WorkCaseUncheckedUpdateManyWithoutRaisedByUserNestedInputObjectSchema as WorkCaseUncheckedUpdateManyWithoutRaisedByUserNestedInputObjectSchema } from './WorkCaseUncheckedUpdateManyWithoutRaisedByUserNestedInput.schema';
import { WorkCaseUncheckedUpdateManyWithoutAssignedToUserNestedInputObjectSchema as WorkCaseUncheckedUpdateManyWithoutAssignedToUserNestedInputObjectSchema } from './WorkCaseUncheckedUpdateManyWithoutAssignedToUserNestedInput.schema';
import { TaskExecutionUncheckedUpdateManyWithoutCreatedByUserNestedInputObjectSchema as TaskExecutionUncheckedUpdateManyWithoutCreatedByUserNestedInputObjectSchema } from './TaskExecutionUncheckedUpdateManyWithoutCreatedByUserNestedInput.schema';
import { TaskItemUncheckedUpdateManyWithoutAssignedToUserNestedInputObjectSchema as TaskItemUncheckedUpdateManyWithoutAssignedToUserNestedInputObjectSchema } from './TaskItemUncheckedUpdateManyWithoutAssignedToUserNestedInput.schema';
import { TaskItemUncheckedUpdateManyWithoutUserNestedInputObjectSchema as TaskItemUncheckedUpdateManyWithoutUserNestedInputObjectSchema } from './TaskItemUncheckedUpdateManyWithoutUserNestedInput.schema';
import { TaskItemActivityUncheckedUpdateManyWithoutActorUserNestedInputObjectSchema as TaskItemActivityUncheckedUpdateManyWithoutActorUserNestedInputObjectSchema } from './TaskItemActivityUncheckedUpdateManyWithoutActorUserNestedInput.schema';
import { TaskItemActivityReplyUncheckedUpdateManyWithoutActorUserNestedInputObjectSchema as TaskItemActivityReplyUncheckedUpdateManyWithoutActorUserNestedInputObjectSchema } from './TaskItemActivityReplyUncheckedUpdateManyWithoutActorUserNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  passwordHash: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  name: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  avatarUrl: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  isActive: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  roleId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  customer: z.lazy(() => CustomerUncheckedUpdateOneWithoutUserNestedInputObjectSchema).optional(),
  maintenanceRecord: z.lazy(() => MaintenanceRecordUncheckedUpdateManyWithoutUserNestedInputObjectSchema).optional(),
  notification: z.lazy(() => NotificationUncheckedUpdateManyWithoutUserNestedInputObjectSchema).optional(),
  serviceRequest: z.lazy(() => ServiceRequestUncheckedUpdateManyWithoutUserNestedInputObjectSchema).optional(),
  technicalIssue: z.lazy(() => TechnicalIssueUncheckedUpdateManyWithoutUserNestedInputObjectSchema).optional(),
  roles: z.lazy(() => RoleUncheckedUpdateManyWithoutUsersNestedInputObjectSchema).optional(),
  createdTasks: z.lazy(() => TaskUncheckedUpdateManyWithoutCreatedByUserNestedInputObjectSchema).optional(),
  assignedTasks: z.lazy(() => TaskUncheckedUpdateManyWithoutAssignedToUserNestedInputObjectSchema).optional(),
  completedTasks: z.lazy(() => TaskUncheckedUpdateManyWithoutCompletedByUserNestedInputObjectSchema).optional(),
  cancelledTasks: z.lazy(() => TaskUncheckedUpdateManyWithoutCancelledByUserNestedInputObjectSchema).optional(),
  raisedWorkCases: z.lazy(() => WorkCaseUncheckedUpdateManyWithoutRaisedByUserNestedInputObjectSchema).optional(),
  assignedWorkCases: z.lazy(() => WorkCaseUncheckedUpdateManyWithoutAssignedToUserNestedInputObjectSchema).optional(),
  taskExecution: z.lazy(() => TaskExecutionUncheckedUpdateManyWithoutCreatedByUserNestedInputObjectSchema).optional(),
  assignedTaskItems: z.lazy(() => TaskItemUncheckedUpdateManyWithoutAssignedToUserNestedInputObjectSchema).optional(),
  taskItems: z.lazy(() => TaskItemUncheckedUpdateManyWithoutUserNestedInputObjectSchema).optional(),
  taskItemActivities: z.lazy(() => TaskItemActivityUncheckedUpdateManyWithoutActorUserNestedInputObjectSchema).optional(),
  activityReplies: z.lazy(() => TaskItemActivityReplyUncheckedUpdateManyWithoutActorUserNestedInputObjectSchema).optional()
}).strict();
export const UserUncheckedUpdateWithoutWorkCaseActivitiesInputObjectSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutWorkCaseActivitiesInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUncheckedUpdateWithoutWorkCaseActivitiesInput>;
export const UserUncheckedUpdateWithoutWorkCaseActivitiesInputObjectZodSchema = makeSchema();
