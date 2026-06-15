import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseScopeSchema } from '../enums/WorkCaseScope.schema';
import { WorkCaseStatusSchema } from '../enums/WorkCaseStatus.schema';
import { TaskPrioritySchema } from '../enums/TaskPriority.schema';
import { WatchCreateNestedOneWithoutWorkCasesInputObjectSchema as WatchCreateNestedOneWithoutWorkCasesInputObjectSchema } from './WatchCreateNestedOneWithoutWorkCasesInput.schema';
import { OrderCreateNestedOneWithoutWorkCaseInputObjectSchema as OrderCreateNestedOneWithoutWorkCaseInputObjectSchema } from './OrderCreateNestedOneWithoutWorkCaseInput.schema';
import { ShipmentCreateNestedOneWithoutWorkCaseInputObjectSchema as ShipmentCreateNestedOneWithoutWorkCaseInputObjectSchema } from './ShipmentCreateNestedOneWithoutWorkCaseInput.schema';
import { WorkCaseCategoryCreateNestedOneWithoutWorkCasesInputObjectSchema as WorkCaseCategoryCreateNestedOneWithoutWorkCasesInputObjectSchema } from './WorkCaseCategoryCreateNestedOneWithoutWorkCasesInput.schema';
import { UserCreateNestedOneWithoutRaisedWorkCasesInputObjectSchema as UserCreateNestedOneWithoutRaisedWorkCasesInputObjectSchema } from './UserCreateNestedOneWithoutRaisedWorkCasesInput.schema';
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
  watch: z.lazy(() => WatchCreateNestedOneWithoutWorkCasesInputObjectSchema).optional(),
  order: z.lazy(() => OrderCreateNestedOneWithoutWorkCaseInputObjectSchema).optional(),
  shipment: z.lazy(() => ShipmentCreateNestedOneWithoutWorkCaseInputObjectSchema).optional(),
  category: z.lazy(() => WorkCaseCategoryCreateNestedOneWithoutWorkCasesInputObjectSchema).optional(),
  raisedByUser: z.lazy(() => UserCreateNestedOneWithoutRaisedWorkCasesInputObjectSchema).optional(),
  tasks: z.lazy(() => TaskCreateNestedManyWithoutWorkCaseInputObjectSchema).optional(),
  serviceRequests: z.lazy(() => ServiceRequestCreateNestedManyWithoutWorkCaseInputObjectSchema).optional(),
  activities: z.lazy(() => WorkCaseActivityCreateNestedManyWithoutWorkCaseInputObjectSchema).optional()
}).strict();
export const WorkCaseCreateWithoutAssignedToUserInputObjectSchema: z.ZodType<Prisma.WorkCaseCreateWithoutAssignedToUserInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCreateWithoutAssignedToUserInput>;
export const WorkCaseCreateWithoutAssignedToUserInputObjectZodSchema = makeSchema();
