import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchArgsObjectSchema as WatchArgsObjectSchema } from './WatchArgs.schema';
import { WorkCaseCategoryArgsObjectSchema as WorkCaseCategoryArgsObjectSchema } from './WorkCaseCategoryArgs.schema';
import { UserArgsObjectSchema as UserArgsObjectSchema } from './UserArgs.schema';
import { TaskFindManySchema as TaskFindManySchema } from '../findManyTask.schema';
import { ServiceRequestFindManySchema as ServiceRequestFindManySchema } from '../findManyServiceRequest.schema';
import { WorkCaseActivityFindManySchema as WorkCaseActivityFindManySchema } from '../findManyWorkCaseActivity.schema';
import { WorkCaseCountOutputTypeArgsObjectSchema as WorkCaseCountOutputTypeArgsObjectSchema } from './WorkCaseCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  refNo: z.boolean().optional(),
  title: z.boolean().optional(),
  description: z.boolean().optional(),
  scope: z.boolean().optional(),
  status: z.boolean().optional(),
  priority: z.boolean().optional(),
  watchId: z.boolean().optional(),
  categoryId: z.boolean().optional(),
  raisedByUserId: z.boolean().optional(),
  assignedToUserId: z.boolean().optional(),
  triagedAt: z.boolean().optional(),
  resolvedAt: z.boolean().optional(),
  cancelledAt: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  watch: z.union([z.boolean(), z.lazy(() => WatchArgsObjectSchema)]).optional(),
  category: z.union([z.boolean(), z.lazy(() => WorkCaseCategoryArgsObjectSchema)]).optional(),
  raisedByUser: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  assignedToUser: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  tasks: z.union([z.boolean(), z.lazy(() => TaskFindManySchema)]).optional(),
  serviceRequests: z.union([z.boolean(), z.lazy(() => ServiceRequestFindManySchema)]).optional(),
  activities: z.union([z.boolean(), z.lazy(() => WorkCaseActivityFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => WorkCaseCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const WorkCaseSelectObjectSchema: z.ZodType<Prisma.WorkCaseSelect> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseSelect>;
export const WorkCaseSelectObjectZodSchema = makeSchema();
