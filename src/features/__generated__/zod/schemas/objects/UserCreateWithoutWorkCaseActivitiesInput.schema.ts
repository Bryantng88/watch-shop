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
import { WorkCaseCreateNestedManyWithoutAssignedToUserInputObjectSchema as WorkCaseCreateNestedManyWithoutAssignedToUserInputObjectSchema } from './WorkCaseCreateNestedManyWithoutAssignedToUserInput.schema'

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
  notification: z.lazy(() => NotificationCreateNestedManyWithoutUserInputObjectSchema).optional(),
  serviceRequest: z.lazy(() => ServiceRequestCreateNestedManyWithoutUserInputObjectSchema).optional(),
  technicalIssue: z.lazy(() => TechnicalIssueCreateNestedManyWithoutUserInputObjectSchema).optional(),
  roles: z.lazy(() => RoleCreateNestedManyWithoutUsersInputObjectSchema).optional(),
  createdTasks: z.lazy(() => TaskCreateNestedManyWithoutCreatedByUserInputObjectSchema).optional(),
  assignedTasks: z.lazy(() => TaskCreateNestedManyWithoutAssignedToUserInputObjectSchema).optional(),
  completedTasks: z.lazy(() => TaskCreateNestedManyWithoutCompletedByUserInputObjectSchema).optional(),
  cancelledTasks: z.lazy(() => TaskCreateNestedManyWithoutCancelledByUserInputObjectSchema).optional(),
  raisedWorkCases: z.lazy(() => WorkCaseCreateNestedManyWithoutRaisedByUserInputObjectSchema).optional(),
  assignedWorkCases: z.lazy(() => WorkCaseCreateNestedManyWithoutAssignedToUserInputObjectSchema).optional()
}).strict();
export const UserCreateWithoutWorkCaseActivitiesInputObjectSchema: z.ZodType<Prisma.UserCreateWithoutWorkCaseActivitiesInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateWithoutWorkCaseActivitiesInput>;
export const UserCreateWithoutWorkCaseActivitiesInputObjectZodSchema = makeSchema();
