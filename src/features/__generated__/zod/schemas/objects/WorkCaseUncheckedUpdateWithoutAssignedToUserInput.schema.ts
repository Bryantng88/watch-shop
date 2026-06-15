import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { WorkCaseScopeSchema } from '../enums/WorkCaseScope.schema';
import { EnumWorkCaseScopeFieldUpdateOperationsInputObjectSchema as EnumWorkCaseScopeFieldUpdateOperationsInputObjectSchema } from './EnumWorkCaseScopeFieldUpdateOperationsInput.schema';
import { WorkCaseStatusSchema } from '../enums/WorkCaseStatus.schema';
import { EnumWorkCaseStatusFieldUpdateOperationsInputObjectSchema as EnumWorkCaseStatusFieldUpdateOperationsInputObjectSchema } from './EnumWorkCaseStatusFieldUpdateOperationsInput.schema';
import { TaskPrioritySchema } from '../enums/TaskPriority.schema';
import { EnumTaskPriorityFieldUpdateOperationsInputObjectSchema as EnumTaskPriorityFieldUpdateOperationsInputObjectSchema } from './EnumTaskPriorityFieldUpdateOperationsInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema as NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { TaskUncheckedUpdateManyWithoutWorkCaseNestedInputObjectSchema as TaskUncheckedUpdateManyWithoutWorkCaseNestedInputObjectSchema } from './TaskUncheckedUpdateManyWithoutWorkCaseNestedInput.schema';
import { ServiceRequestUncheckedUpdateManyWithoutWorkCaseNestedInputObjectSchema as ServiceRequestUncheckedUpdateManyWithoutWorkCaseNestedInputObjectSchema } from './ServiceRequestUncheckedUpdateManyWithoutWorkCaseNestedInput.schema';
import { WorkCaseActivityUncheckedUpdateManyWithoutWorkCaseNestedInputObjectSchema as WorkCaseActivityUncheckedUpdateManyWithoutWorkCaseNestedInputObjectSchema } from './WorkCaseActivityUncheckedUpdateManyWithoutWorkCaseNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  refNo: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  scope: z.union([WorkCaseScopeSchema, z.lazy(() => EnumWorkCaseScopeFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([WorkCaseStatusSchema, z.lazy(() => EnumWorkCaseStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  priority: z.union([TaskPrioritySchema, z.lazy(() => EnumTaskPriorityFieldUpdateOperationsInputObjectSchema)]).optional(),
  watchId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  categoryId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  orderId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  shipmentId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  raisedByUserId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  triagedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  resolvedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  cancelledAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  tasks: z.lazy(() => TaskUncheckedUpdateManyWithoutWorkCaseNestedInputObjectSchema).optional(),
  serviceRequests: z.lazy(() => ServiceRequestUncheckedUpdateManyWithoutWorkCaseNestedInputObjectSchema).optional(),
  activities: z.lazy(() => WorkCaseActivityUncheckedUpdateManyWithoutWorkCaseNestedInputObjectSchema).optional()
}).strict();
export const WorkCaseUncheckedUpdateWithoutAssignedToUserInputObjectSchema: z.ZodType<Prisma.WorkCaseUncheckedUpdateWithoutAssignedToUserInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseUncheckedUpdateWithoutAssignedToUserInput>;
export const WorkCaseUncheckedUpdateWithoutAssignedToUserInputObjectZodSchema = makeSchema();
