import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseScopeSchema } from '../enums/WorkCaseScope.schema';
import { WorkCaseStatusSchema } from '../enums/WorkCaseStatus.schema';
import { TaskPrioritySchema } from '../enums/TaskPriority.schema';
import { TaskUncheckedCreateNestedManyWithoutWorkCaseInputObjectSchema as TaskUncheckedCreateNestedManyWithoutWorkCaseInputObjectSchema } from './TaskUncheckedCreateNestedManyWithoutWorkCaseInput.schema';
import { ServiceRequestUncheckedCreateNestedManyWithoutWorkCaseInputObjectSchema as ServiceRequestUncheckedCreateNestedManyWithoutWorkCaseInputObjectSchema } from './ServiceRequestUncheckedCreateNestedManyWithoutWorkCaseInput.schema';
import { WorkCaseActivityUncheckedCreateNestedManyWithoutWorkCaseInputObjectSchema as WorkCaseActivityUncheckedCreateNestedManyWithoutWorkCaseInputObjectSchema } from './WorkCaseActivityUncheckedCreateNestedManyWithoutWorkCaseInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  refNo: z.string().optional().nullable(),
  title: z.string(),
  description: z.string().optional().nullable(),
  scope: WorkCaseScopeSchema.optional(),
  status: WorkCaseStatusSchema.optional(),
  priority: TaskPrioritySchema.optional(),
  watchId: z.string(),
  categoryId: z.string().optional().nullable(),
  raisedByUserId: z.string().optional().nullable(),
  assignedToUserId: z.string().optional().nullable(),
  triagedAt: z.coerce.date().optional().nullable(),
  resolvedAt: z.coerce.date().optional().nullable(),
  cancelledAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  tasks: z.lazy(() => TaskUncheckedCreateNestedManyWithoutWorkCaseInputObjectSchema),
  serviceRequests: z.lazy(() => ServiceRequestUncheckedCreateNestedManyWithoutWorkCaseInputObjectSchema),
  activities: z.lazy(() => WorkCaseActivityUncheckedCreateNestedManyWithoutWorkCaseInputObjectSchema)
}).strict();
export const WorkCaseUncheckedCreateInputObjectSchema: z.ZodType<Prisma.WorkCaseUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseUncheckedCreateInput>;
export const WorkCaseUncheckedCreateInputObjectZodSchema = makeSchema();
