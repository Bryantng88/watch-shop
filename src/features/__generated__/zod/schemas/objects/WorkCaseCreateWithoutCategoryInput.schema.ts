import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseScopeSchema } from '../enums/WorkCaseScope.schema';
import { WorkCaseStatusSchema } from '../enums/WorkCaseStatus.schema';
import { TaskPrioritySchema } from '../enums/TaskPriority.schema';
import { WatchCreateNestedOneWithoutWorkCaseInputObjectSchema as WatchCreateNestedOneWithoutWorkCaseInputObjectSchema } from './WatchCreateNestedOneWithoutWorkCaseInput.schema';
import { UserCreateNestedOneWithoutRaisedWorkCasesInputObjectSchema as UserCreateNestedOneWithoutRaisedWorkCasesInputObjectSchema } from './UserCreateNestedOneWithoutRaisedWorkCasesInput.schema';
import { UserCreateNestedOneWithoutAssignedWorkCasesInputObjectSchema as UserCreateNestedOneWithoutAssignedWorkCasesInputObjectSchema } from './UserCreateNestedOneWithoutAssignedWorkCasesInput.schema';
import { TaskCreateNestedManyWithoutWorkCaseInputObjectSchema as TaskCreateNestedManyWithoutWorkCaseInputObjectSchema } from './TaskCreateNestedManyWithoutWorkCaseInput.schema';
import { ServiceRequestCreateNestedManyWithoutWorkCaseInputObjectSchema as ServiceRequestCreateNestedManyWithoutWorkCaseInputObjectSchema } from './ServiceRequestCreateNestedManyWithoutWorkCaseInput.schema';
import { WorkCaseActivityCreateNestedManyWithoutWorkCaseInputObjectSchema as WorkCaseActivityCreateNestedManyWithoutWorkCaseInputObjectSchema } from './WorkCaseActivityCreateNestedManyWithoutWorkCaseInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  refNo: z.string().optional().nullable(),
  title: z.string(),
  description: z.string().optional().nullable(),
  scope: WorkCaseScopeSchema.optional(),
  status: WorkCaseStatusSchema.optional(),
  priority: TaskPrioritySchema.optional(),
  triagedAt: z.coerce.date().optional().nullable(),
  resolvedAt: z.coerce.date().optional().nullable(),
  cancelledAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  watch: z.lazy(() => WatchCreateNestedOneWithoutWorkCaseInputObjectSchema),
  raisedByUser: z.lazy(() => UserCreateNestedOneWithoutRaisedWorkCasesInputObjectSchema).optional(),
  assignedToUser: z.lazy(() => UserCreateNestedOneWithoutAssignedWorkCasesInputObjectSchema).optional(),
  tasks: z.lazy(() => TaskCreateNestedManyWithoutWorkCaseInputObjectSchema).optional(),
  serviceRequests: z.lazy(() => ServiceRequestCreateNestedManyWithoutWorkCaseInputObjectSchema).optional(),
  activities: z.lazy(() => WorkCaseActivityCreateNestedManyWithoutWorkCaseInputObjectSchema).optional()
}).strict();
export const WorkCaseCreateWithoutCategoryInputObjectSchema: z.ZodType<Prisma.WorkCaseCreateWithoutCategoryInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCreateWithoutCategoryInput>;
export const WorkCaseCreateWithoutCategoryInputObjectZodSchema = makeSchema();
