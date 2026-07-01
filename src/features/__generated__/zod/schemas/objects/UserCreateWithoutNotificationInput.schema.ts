import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerCreateNestedOneWithoutUserInputObjectSchema as CustomerCreateNestedOneWithoutUserInputObjectSchema } from './CustomerCreateNestedOneWithoutUserInput.schema';
import { MaintenanceRecordCreateNestedManyWithoutUserInputObjectSchema as MaintenanceRecordCreateNestedManyWithoutUserInputObjectSchema } from './MaintenanceRecordCreateNestedManyWithoutUserInput.schema';
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
import { TaskItemCreateNestedManyWithoutUserInputObjectSchema as TaskItemCreateNestedManyWithoutUserInputObjectSchema } from './TaskItemCreateNestedManyWithoutUserInput.schema';
import { TaskItemActivityCreateNestedManyWithoutActorUserInputObjectSchema as TaskItemActivityCreateNestedManyWithoutActorUserInputObjectSchema } from './TaskItemActivityCreateNestedManyWithoutActorUserInput.schema';
import { TaskItemActivityReplyCreateNestedManyWithoutActorUserInputObjectSchema as TaskItemActivityReplyCreateNestedManyWithoutActorUserInputObjectSchema } from './TaskItemActivityReplyCreateNestedManyWithoutActorUserInput.schema'

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
  customer: z.lazy(() => CustomerCreateNestedOneWithoutUserInputObjectSchema).optional(),
  maintenanceRecord: z.lazy(() => MaintenanceRecordCreateNestedManyWithoutUserInputObjectSchema).optional(),
  serviceRequest: z.lazy(() => ServiceRequestCreateNestedManyWithoutUserInputObjectSchema).optional(),
  technicalIssue: z.lazy(() => TechnicalIssueCreateNestedManyWithoutUserInputObjectSchema).optional(),
  roles: z.lazy(() => RoleCreateNestedManyWithoutUsersInputObjectSchema).optional(),
  createdTasks: z.lazy(() => TaskCreateNestedManyWithoutCreatedByUserInputObjectSchema).optional(),
  assignedTasks: z.lazy(() => TaskCreateNestedManyWithoutAssignedToUserInputObjectSchema).optional(),
  completedTasks: z.lazy(() => TaskCreateNestedManyWithoutCompletedByUserInputObjectSchema).optional(),
  cancelledTasks: z.lazy(() => TaskCreateNestedManyWithoutCancelledByUserInputObjectSchema).optional(),
  raisedWorkCases: z.lazy(() => WorkCaseCreateNestedManyWithoutRaisedByUserInputObjectSchema).optional(),
  assignedWorkCases: z.lazy(() => WorkCaseCreateNestedManyWithoutAssignedToUserInputObjectSchema).optional(),
  workCaseActivities: z.lazy(() => WorkCaseActivityCreateNestedManyWithoutActorInputObjectSchema).optional(),
  taskExecution: z.lazy(() => TaskExecutionCreateNestedManyWithoutCreatedByUserInputObjectSchema).optional(),
  assignedTaskItems: z.lazy(() => TaskItemCreateNestedManyWithoutAssignedToUserInputObjectSchema).optional(),
  taskItems: z.lazy(() => TaskItemCreateNestedManyWithoutUserInputObjectSchema).optional(),
  taskItemActivities: z.lazy(() => TaskItemActivityCreateNestedManyWithoutActorUserInputObjectSchema).optional(),
  activityReplies: z.lazy(() => TaskItemActivityReplyCreateNestedManyWithoutActorUserInputObjectSchema).optional()
}).strict();
export const UserCreateWithoutNotificationInputObjectSchema: z.ZodType<Prisma.UserCreateWithoutNotificationInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateWithoutNotificationInput>;
export const UserCreateWithoutNotificationInputObjectZodSchema = makeSchema();
