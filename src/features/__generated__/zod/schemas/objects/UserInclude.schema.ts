import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerArgsObjectSchema as CustomerArgsObjectSchema } from './CustomerArgs.schema';
import { MaintenanceRecordFindManySchema as MaintenanceRecordFindManySchema } from '../findManyMaintenanceRecord.schema';
import { NotificationFindManySchema as NotificationFindManySchema } from '../findManyNotification.schema';
import { ServiceRequestFindManySchema as ServiceRequestFindManySchema } from '../findManyServiceRequest.schema';
import { TechnicalIssueFindManySchema as TechnicalIssueFindManySchema } from '../findManyTechnicalIssue.schema';
import { RoleFindManySchema as RoleFindManySchema } from '../findManyRole.schema';
import { TaskFindManySchema as TaskFindManySchema } from '../findManyTask.schema';
import { WorkCaseFindManySchema as WorkCaseFindManySchema } from '../findManyWorkCase.schema';
import { WorkCaseActivityFindManySchema as WorkCaseActivityFindManySchema } from '../findManyWorkCaseActivity.schema';
import { TaskExecutionFindManySchema as TaskExecutionFindManySchema } from '../findManyTaskExecution.schema';
import { UserCountOutputTypeArgsObjectSchema as UserCountOutputTypeArgsObjectSchema } from './UserCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  customer: z.union([z.boolean(), z.lazy(() => CustomerArgsObjectSchema)]).optional(),
  maintenanceRecord: z.union([z.boolean(), z.lazy(() => MaintenanceRecordFindManySchema)]).optional(),
  notification: z.union([z.boolean(), z.lazy(() => NotificationFindManySchema)]).optional(),
  serviceRequest: z.union([z.boolean(), z.lazy(() => ServiceRequestFindManySchema)]).optional(),
  technicalIssue: z.union([z.boolean(), z.lazy(() => TechnicalIssueFindManySchema)]).optional(),
  roles: z.union([z.boolean(), z.lazy(() => RoleFindManySchema)]).optional(),
  createdTasks: z.union([z.boolean(), z.lazy(() => TaskFindManySchema)]).optional(),
  assignedTasks: z.union([z.boolean(), z.lazy(() => TaskFindManySchema)]).optional(),
  completedTasks: z.union([z.boolean(), z.lazy(() => TaskFindManySchema)]).optional(),
  cancelledTasks: z.union([z.boolean(), z.lazy(() => TaskFindManySchema)]).optional(),
  raisedWorkCases: z.union([z.boolean(), z.lazy(() => WorkCaseFindManySchema)]).optional(),
  assignedWorkCases: z.union([z.boolean(), z.lazy(() => WorkCaseFindManySchema)]).optional(),
  workCaseActivities: z.union([z.boolean(), z.lazy(() => WorkCaseActivityFindManySchema)]).optional(),
  TaskExecution: z.union([z.boolean(), z.lazy(() => TaskExecutionFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => UserCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const UserIncludeObjectSchema: z.ZodType<Prisma.UserInclude> = makeSchema() as unknown as z.ZodType<Prisma.UserInclude>;
export const UserIncludeObjectZodSchema = makeSchema();
