import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerUncheckedCreateNestedOneWithoutUserInputObjectSchema as CustomerUncheckedCreateNestedOneWithoutUserInputObjectSchema } from './CustomerUncheckedCreateNestedOneWithoutUserInput.schema';
import { MaintenanceRecordUncheckedCreateNestedManyWithoutUserInputObjectSchema as MaintenanceRecordUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './MaintenanceRecordUncheckedCreateNestedManyWithoutUserInput.schema';
import { NotificationUncheckedCreateNestedManyWithoutUserInputObjectSchema as NotificationUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './NotificationUncheckedCreateNestedManyWithoutUserInput.schema';
import { ServiceRequestUncheckedCreateNestedManyWithoutUserInputObjectSchema as ServiceRequestUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './ServiceRequestUncheckedCreateNestedManyWithoutUserInput.schema';
import { TechnicalIssueUncheckedCreateNestedManyWithoutUserInputObjectSchema as TechnicalIssueUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './TechnicalIssueUncheckedCreateNestedManyWithoutUserInput.schema';
import { RoleUncheckedCreateNestedManyWithoutUsersInputObjectSchema as RoleUncheckedCreateNestedManyWithoutUsersInputObjectSchema } from './RoleUncheckedCreateNestedManyWithoutUsersInput.schema';
import { TaskUncheckedCreateNestedManyWithoutCreatedByUserInputObjectSchema as TaskUncheckedCreateNestedManyWithoutCreatedByUserInputObjectSchema } from './TaskUncheckedCreateNestedManyWithoutCreatedByUserInput.schema';
import { TaskUncheckedCreateNestedManyWithoutAssignedToUserInputObjectSchema as TaskUncheckedCreateNestedManyWithoutAssignedToUserInputObjectSchema } from './TaskUncheckedCreateNestedManyWithoutAssignedToUserInput.schema';
import { TaskUncheckedCreateNestedManyWithoutCompletedByUserInputObjectSchema as TaskUncheckedCreateNestedManyWithoutCompletedByUserInputObjectSchema } from './TaskUncheckedCreateNestedManyWithoutCompletedByUserInput.schema';
import { TaskUncheckedCreateNestedManyWithoutCancelledByUserInputObjectSchema as TaskUncheckedCreateNestedManyWithoutCancelledByUserInputObjectSchema } from './TaskUncheckedCreateNestedManyWithoutCancelledByUserInput.schema';
import { WorkCaseUncheckedCreateNestedManyWithoutRaisedByUserInputObjectSchema as WorkCaseUncheckedCreateNestedManyWithoutRaisedByUserInputObjectSchema } from './WorkCaseUncheckedCreateNestedManyWithoutRaisedByUserInput.schema';
import { WorkCaseUncheckedCreateNestedManyWithoutAssignedToUserInputObjectSchema as WorkCaseUncheckedCreateNestedManyWithoutAssignedToUserInputObjectSchema } from './WorkCaseUncheckedCreateNestedManyWithoutAssignedToUserInput.schema';
import { WorkCaseActivityUncheckedCreateNestedManyWithoutActorInputObjectSchema as WorkCaseActivityUncheckedCreateNestedManyWithoutActorInputObjectSchema } from './WorkCaseActivityUncheckedCreateNestedManyWithoutActorInput.schema';
import { TaskExecutionUncheckedCreateNestedManyWithoutCreatedByUserInputObjectSchema as TaskExecutionUncheckedCreateNestedManyWithoutCreatedByUserInputObjectSchema } from './TaskExecutionUncheckedCreateNestedManyWithoutCreatedByUserInput.schema';
import { TaskChecklistItemUncheckedCreateNestedManyWithoutAssignedToUserInputObjectSchema as TaskChecklistItemUncheckedCreateNestedManyWithoutAssignedToUserInputObjectSchema } from './TaskChecklistItemUncheckedCreateNestedManyWithoutAssignedToUserInput.schema';
import { TaskChecklistItemUncheckedCreateNestedManyWithoutUserInputObjectSchema as TaskChecklistItemUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './TaskChecklistItemUncheckedCreateNestedManyWithoutUserInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  email: z.string(),
  passwordHash: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  roleId: z.string().optional().nullable(),
  customer: z.lazy(() => CustomerUncheckedCreateNestedOneWithoutUserInputObjectSchema).optional(),
  maintenanceRecord: z.lazy(() => MaintenanceRecordUncheckedCreateNestedManyWithoutUserInputObjectSchema),
  notification: z.lazy(() => NotificationUncheckedCreateNestedManyWithoutUserInputObjectSchema),
  serviceRequest: z.lazy(() => ServiceRequestUncheckedCreateNestedManyWithoutUserInputObjectSchema),
  technicalIssue: z.lazy(() => TechnicalIssueUncheckedCreateNestedManyWithoutUserInputObjectSchema),
  roles: z.lazy(() => RoleUncheckedCreateNestedManyWithoutUsersInputObjectSchema),
  createdTasks: z.lazy(() => TaskUncheckedCreateNestedManyWithoutCreatedByUserInputObjectSchema),
  assignedTasks: z.lazy(() => TaskUncheckedCreateNestedManyWithoutAssignedToUserInputObjectSchema),
  completedTasks: z.lazy(() => TaskUncheckedCreateNestedManyWithoutCompletedByUserInputObjectSchema),
  cancelledTasks: z.lazy(() => TaskUncheckedCreateNestedManyWithoutCancelledByUserInputObjectSchema),
  raisedWorkCases: z.lazy(() => WorkCaseUncheckedCreateNestedManyWithoutRaisedByUserInputObjectSchema),
  assignedWorkCases: z.lazy(() => WorkCaseUncheckedCreateNestedManyWithoutAssignedToUserInputObjectSchema),
  workCaseActivities: z.lazy(() => WorkCaseActivityUncheckedCreateNestedManyWithoutActorInputObjectSchema),
  taskExecution: z.lazy(() => TaskExecutionUncheckedCreateNestedManyWithoutCreatedByUserInputObjectSchema),
  assignedChecklistItems: z.lazy(() => TaskChecklistItemUncheckedCreateNestedManyWithoutAssignedToUserInputObjectSchema),
  taskChecklistItem: z.lazy(() => TaskChecklistItemUncheckedCreateNestedManyWithoutUserInputObjectSchema)
}).strict();
export const UserUncheckedCreateInputObjectSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUncheckedCreateInput>;
export const UserUncheckedCreateInputObjectZodSchema = makeSchema();
