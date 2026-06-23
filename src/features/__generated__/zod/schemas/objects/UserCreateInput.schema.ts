import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerCreateNestedOneWithoutUserInputObjectSchema as CustomerCreateNestedOneWithoutUserInputObjectSchema } from './CustomerCreateNestedOneWithoutUserInput.schema';
import { MaintenanceRecordCreateNestedManyWithoutUserInputObjectSchema as MaintenanceRecordCreateNestedManyWithoutUserInputObjectSchema } from './MaintenanceRecordCreateNestedManyWithoutUserInput.schema';
import { NotificationCreateNestedManyWithoutUserInputObjectSchema as NotificationCreateNestedManyWithoutUserInputObjectSchema } from './NotificationCreateNestedManyWithoutUserInput.schema';
import { ServiceRequestCreateNestedManyWithoutUserInputObjectSchema as ServiceRequestCreateNestedManyWithoutUserInputObjectSchema } from './ServiceRequestCreateNestedManyWithoutUserInput.schema';
import { TechnicalIssueCreateNestedManyWithoutUserInputObjectSchema as TechnicalIssueCreateNestedManyWithoutUserInputObjectSchema } from './TechnicalIssueCreateNestedManyWithoutUserInput.schema';
import { RoleCreateNestedManyWithoutUsersInputObjectSchema as RoleCreateNestedManyWithoutUsersInputObjectSchema } from './RoleCreateNestedManyWithoutUsersInput.schema';
import { TaskCreateNestedManyWithoutCreatedByUserInputObjectSchema as TaskCreateNestedManyWithoutCreatedByUserInputObjectSchema } from './TaskCreateNestedManyWithoutCreatedByUserInput.schema';
import { TaskCreateNestedManyWithoutAssignedToUserInputObjectSchema as TaskCreateNestedManyWithoutAssignedToUserInputObjectSchema } from './TaskCreateNestedManyWithoutAssignedToUserInput.schema';
import { TaskCreateNestedManyWithoutCompletedByUserInputObjectSchema as TaskCreateNestedManyWithoutCompletedByUserInputObjectSchema } from './TaskCreateNestedManyWithoutCompletedByUserInput.schema';
import { TaskCreateNestedManyWithoutCancelledByUserInputObjectSchema as TaskCreateNestedManyWithoutCancelledByUserInputObjectSchema } from './TaskCreateNestedManyWithoutCancelledByUserInput.schema';
import { WorkCaseCreateNestedManyWithoutRaisedByUserInputObjectSchema as WorkCaseCreateNestedManyWithoutRaisedByUserInputObjectSchema } from './WorkCaseCreateNestedManyWithoutRaisedByUserInput.schema';
import { WorkCaseCreateNestedManyWithoutAssignedToUserInputObjectSchema as WorkCaseCreateNestedManyWithoutAssignedToUserInputObjectSchema } from './WorkCaseCreateNestedManyWithoutAssignedToUserInput.schema';
import { WorkCaseActivityCreateNestedManyWithoutActorInputObjectSchema as WorkCaseActivityCreateNestedManyWithoutActorInputObjectSchema } from './WorkCaseActivityCreateNestedManyWithoutActorInput.schema';
import { TaskExecutionCreateNestedManyWithoutCreatedByUserInputObjectSchema as TaskExecutionCreateNestedManyWithoutCreatedByUserInputObjectSchema } from './TaskExecutionCreateNestedManyWithoutCreatedByUserInput.schema';
import { TaskItemCreateNestedManyWithoutAssignedToUserInputObjectSchema as TaskItemCreateNestedManyWithoutAssignedToUserInputObjectSchema } from './TaskItemCreateNestedManyWithoutAssignedToUserInput.schema';
import { TaskItemCreateNestedManyWithoutUserInputObjectSchema as TaskItemCreateNestedManyWithoutUserInputObjectSchema } from './TaskItemCreateNestedManyWithoutUserInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  email: z.string(),
  passwordHash: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  roleId: z.string().optional().nullable(),
  customer: z.lazy(() => CustomerCreateNestedOneWithoutUserInputObjectSchema).optional(),
  maintenanceRecord: z.lazy(() => MaintenanceRecordCreateNestedManyWithoutUserInputObjectSchema),
  notification: z.lazy(() => NotificationCreateNestedManyWithoutUserInputObjectSchema),
  serviceRequest: z.lazy(() => ServiceRequestCreateNestedManyWithoutUserInputObjectSchema),
  technicalIssue: z.lazy(() => TechnicalIssueCreateNestedManyWithoutUserInputObjectSchema),
  roles: z.lazy(() => RoleCreateNestedManyWithoutUsersInputObjectSchema),
  createdTasks: z.lazy(() => TaskCreateNestedManyWithoutCreatedByUserInputObjectSchema),
  assignedTasks: z.lazy(() => TaskCreateNestedManyWithoutAssignedToUserInputObjectSchema),
  completedTasks: z.lazy(() => TaskCreateNestedManyWithoutCompletedByUserInputObjectSchema),
  cancelledTasks: z.lazy(() => TaskCreateNestedManyWithoutCancelledByUserInputObjectSchema),
  raisedWorkCases: z.lazy(() => WorkCaseCreateNestedManyWithoutRaisedByUserInputObjectSchema),
  assignedWorkCases: z.lazy(() => WorkCaseCreateNestedManyWithoutAssignedToUserInputObjectSchema),
  workCaseActivities: z.lazy(() => WorkCaseActivityCreateNestedManyWithoutActorInputObjectSchema),
  taskExecution: z.lazy(() => TaskExecutionCreateNestedManyWithoutCreatedByUserInputObjectSchema),
  assignedTaskItems: z.lazy(() => TaskItemCreateNestedManyWithoutAssignedToUserInputObjectSchema),
  taskItems: z.lazy(() => TaskItemCreateNestedManyWithoutUserInputObjectSchema)
}).strict();
export const UserCreateInputObjectSchema: z.ZodType<Prisma.UserCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateInput>;
export const UserCreateInputObjectZodSchema = makeSchema();
