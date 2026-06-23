import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerUncheckedCreateNestedOneWithoutUserInputObjectSchema as CustomerUncheckedCreateNestedOneWithoutUserInputObjectSchema } from './CustomerUncheckedCreateNestedOneWithoutUserInput.schema';
import { MaintenanceRecordUncheckedCreateNestedManyWithoutUserInputObjectSchema as MaintenanceRecordUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './MaintenanceRecordUncheckedCreateNestedManyWithoutUserInput.schema';
import { NotificationUncheckedCreateNestedManyWithoutUserInputObjectSchema as NotificationUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './NotificationUncheckedCreateNestedManyWithoutUserInput.schema';
import { ServiceRequestUncheckedCreateNestedManyWithoutUserInputObjectSchema as ServiceRequestUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './ServiceRequestUncheckedCreateNestedManyWithoutUserInput.schema';
import { RoleUncheckedCreateNestedManyWithoutUsersInputObjectSchema as RoleUncheckedCreateNestedManyWithoutUsersInputObjectSchema } from './RoleUncheckedCreateNestedManyWithoutUsersInput.schema';
import { TaskUncheckedCreateNestedManyWithoutCreatedByUserInputObjectSchema as TaskUncheckedCreateNestedManyWithoutCreatedByUserInputObjectSchema } from './TaskUncheckedCreateNestedManyWithoutCreatedByUserInput.schema';
import { TaskUncheckedCreateNestedManyWithoutAssignedToUserInputObjectSchema as TaskUncheckedCreateNestedManyWithoutAssignedToUserInputObjectSchema } from './TaskUncheckedCreateNestedManyWithoutAssignedToUserInput.schema';
import { TaskUncheckedCreateNestedManyWithoutCompletedByUserInputObjectSchema as TaskUncheckedCreateNestedManyWithoutCompletedByUserInputObjectSchema } from './TaskUncheckedCreateNestedManyWithoutCompletedByUserInput.schema';
import { TaskUncheckedCreateNestedManyWithoutCancelledByUserInputObjectSchema as TaskUncheckedCreateNestedManyWithoutCancelledByUserInputObjectSchema } from './TaskUncheckedCreateNestedManyWithoutCancelledByUserInput.schema';
import { WorkCaseUncheckedCreateNestedManyWithoutRaisedByUserInputObjectSchema as WorkCaseUncheckedCreateNestedManyWithoutRaisedByUserInputObjectSchema } from './WorkCaseUncheckedCreateNestedManyWithoutRaisedByUserInput.schema';
import { WorkCaseUncheckedCreateNestedManyWithoutAssignedToUserInputObjectSchema as WorkCaseUncheckedCreateNestedManyWithoutAssignedToUserInputObjectSchema } from './WorkCaseUncheckedCreateNestedManyWithoutAssignedToUserInput.schema';
import { WorkCaseActivityUncheckedCreateNestedManyWithoutActorInputObjectSchema as WorkCaseActivityUncheckedCreateNestedManyWithoutActorInputObjectSchema } from './WorkCaseActivityUncheckedCreateNestedManyWithoutActorInput.schema';
import { TaskExecutionUncheckedCreateNestedManyWithoutCreatedByUserInputObjectSchema as TaskExecutionUncheckedCreateNestedManyWithoutCreatedByUserInputObjectSchema } from './TaskExecutionUncheckedCreateNestedManyWithoutCreatedByUserInput.schema';
import { TaskItemUncheckedCreateNestedManyWithoutAssignedToUserInputObjectSchema as TaskItemUncheckedCreateNestedManyWithoutAssignedToUserInputObjectSchema } from './TaskItemUncheckedCreateNestedManyWithoutAssignedToUserInput.schema';
import { TaskItemUncheckedCreateNestedManyWithoutUserInputObjectSchema as TaskItemUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './TaskItemUncheckedCreateNestedManyWithoutUserInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  email: z.string(),
  passwordHash: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  roleId: z.string().optional().nullable(),
  customer: z.lazy(() => CustomerUncheckedCreateNestedOneWithoutUserInputObjectSchema).optional(),
  maintenanceRecord: z.lazy(() => MaintenanceRecordUncheckedCreateNestedManyWithoutUserInputObjectSchema).optional(),
  notification: z.lazy(() => NotificationUncheckedCreateNestedManyWithoutUserInputObjectSchema).optional(),
  serviceRequest: z.lazy(() => ServiceRequestUncheckedCreateNestedManyWithoutUserInputObjectSchema).optional(),
  roles: z.lazy(() => RoleUncheckedCreateNestedManyWithoutUsersInputObjectSchema).optional(),
  createdTasks: z.lazy(() => TaskUncheckedCreateNestedManyWithoutCreatedByUserInputObjectSchema).optional(),
  assignedTasks: z.lazy(() => TaskUncheckedCreateNestedManyWithoutAssignedToUserInputObjectSchema).optional(),
  completedTasks: z.lazy(() => TaskUncheckedCreateNestedManyWithoutCompletedByUserInputObjectSchema).optional(),
  cancelledTasks: z.lazy(() => TaskUncheckedCreateNestedManyWithoutCancelledByUserInputObjectSchema).optional(),
  raisedWorkCases: z.lazy(() => WorkCaseUncheckedCreateNestedManyWithoutRaisedByUserInputObjectSchema).optional(),
  assignedWorkCases: z.lazy(() => WorkCaseUncheckedCreateNestedManyWithoutAssignedToUserInputObjectSchema).optional(),
  workCaseActivities: z.lazy(() => WorkCaseActivityUncheckedCreateNestedManyWithoutActorInputObjectSchema).optional(),
  taskExecution: z.lazy(() => TaskExecutionUncheckedCreateNestedManyWithoutCreatedByUserInputObjectSchema).optional(),
  assignedTaskItems: z.lazy(() => TaskItemUncheckedCreateNestedManyWithoutAssignedToUserInputObjectSchema).optional(),
  taskItems: z.lazy(() => TaskItemUncheckedCreateNestedManyWithoutUserInputObjectSchema).optional()
}).strict();
export const UserUncheckedCreateWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUncheckedCreateWithoutTechnicalIssueInput>;
export const UserUncheckedCreateWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
