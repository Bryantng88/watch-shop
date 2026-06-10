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
import { TaskUncheckedUpdateManyWithoutCreatedByUserNestedInputObjectSchema as TaskUncheckedUpdateManyWithoutCreatedByUserNestedInputObjectSchema } from './TaskUncheckedUpdateManyWithoutCreatedByUserNestedInput.schema';
import { TaskUncheckedUpdateManyWithoutAssignedToUserNestedInputObjectSchema as TaskUncheckedUpdateManyWithoutAssignedToUserNestedInputObjectSchema } from './TaskUncheckedUpdateManyWithoutAssignedToUserNestedInput.schema';
import { TaskUncheckedUpdateManyWithoutCompletedByUserNestedInputObjectSchema as TaskUncheckedUpdateManyWithoutCompletedByUserNestedInputObjectSchema } from './TaskUncheckedUpdateManyWithoutCompletedByUserNestedInput.schema';
import { TaskUncheckedUpdateManyWithoutCancelledByUserNestedInputObjectSchema as TaskUncheckedUpdateManyWithoutCancelledByUserNestedInputObjectSchema } from './TaskUncheckedUpdateManyWithoutCancelledByUserNestedInput.schema';
import { WorkCaseUncheckedUpdateManyWithoutRaisedByUserNestedInputObjectSchema as WorkCaseUncheckedUpdateManyWithoutRaisedByUserNestedInputObjectSchema } from './WorkCaseUncheckedUpdateManyWithoutRaisedByUserNestedInput.schema';
import { WorkCaseUncheckedUpdateManyWithoutAssignedToUserNestedInputObjectSchema as WorkCaseUncheckedUpdateManyWithoutAssignedToUserNestedInputObjectSchema } from './WorkCaseUncheckedUpdateManyWithoutAssignedToUserNestedInput.schema';
import { WorkCaseActivityUncheckedUpdateManyWithoutActorNestedInputObjectSchema as WorkCaseActivityUncheckedUpdateManyWithoutActorNestedInputObjectSchema } from './WorkCaseActivityUncheckedUpdateManyWithoutActorNestedInput.schema'

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
  createdTasks: z.lazy(() => TaskUncheckedUpdateManyWithoutCreatedByUserNestedInputObjectSchema).optional(),
  assignedTasks: z.lazy(() => TaskUncheckedUpdateManyWithoutAssignedToUserNestedInputObjectSchema).optional(),
  completedTasks: z.lazy(() => TaskUncheckedUpdateManyWithoutCompletedByUserNestedInputObjectSchema).optional(),
  cancelledTasks: z.lazy(() => TaskUncheckedUpdateManyWithoutCancelledByUserNestedInputObjectSchema).optional(),
  raisedWorkCases: z.lazy(() => WorkCaseUncheckedUpdateManyWithoutRaisedByUserNestedInputObjectSchema).optional(),
  assignedWorkCases: z.lazy(() => WorkCaseUncheckedUpdateManyWithoutAssignedToUserNestedInputObjectSchema).optional(),
  workCaseActivities: z.lazy(() => WorkCaseActivityUncheckedUpdateManyWithoutActorNestedInputObjectSchema).optional()
}).strict();
export const UserUncheckedUpdateWithoutRolesInputObjectSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutRolesInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUncheckedUpdateWithoutRolesInput>;
export const UserUncheckedUpdateWithoutRolesInputObjectZodSchema = makeSchema();
