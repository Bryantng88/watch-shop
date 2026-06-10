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
import { WatchUpdateOneRequiredWithoutWorkCaseNestedInputObjectSchema as WatchUpdateOneRequiredWithoutWorkCaseNestedInputObjectSchema } from './WatchUpdateOneRequiredWithoutWorkCaseNestedInput.schema';
import { WorkCaseCategoryUpdateOneWithoutWorkCasesNestedInputObjectSchema as WorkCaseCategoryUpdateOneWithoutWorkCasesNestedInputObjectSchema } from './WorkCaseCategoryUpdateOneWithoutWorkCasesNestedInput.schema';
import { UserUpdateOneWithoutRaisedWorkCasesNestedInputObjectSchema as UserUpdateOneWithoutRaisedWorkCasesNestedInputObjectSchema } from './UserUpdateOneWithoutRaisedWorkCasesNestedInput.schema';
import { UserUpdateOneWithoutAssignedWorkCasesNestedInputObjectSchema as UserUpdateOneWithoutAssignedWorkCasesNestedInputObjectSchema } from './UserUpdateOneWithoutAssignedWorkCasesNestedInput.schema';
import { TaskUpdateManyWithoutWorkCaseNestedInputObjectSchema as TaskUpdateManyWithoutWorkCaseNestedInputObjectSchema } from './TaskUpdateManyWithoutWorkCaseNestedInput.schema';
import { ServiceRequestUpdateManyWithoutWorkCaseNestedInputObjectSchema as ServiceRequestUpdateManyWithoutWorkCaseNestedInputObjectSchema } from './ServiceRequestUpdateManyWithoutWorkCaseNestedInput.schema';
import { WorkCaseActivityUpdateManyWithoutWorkCaseNestedInputObjectSchema as WorkCaseActivityUpdateManyWithoutWorkCaseNestedInputObjectSchema } from './WorkCaseActivityUpdateManyWithoutWorkCaseNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  refNo: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  scope: z.union([WorkCaseScopeSchema, z.lazy(() => EnumWorkCaseScopeFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([WorkCaseStatusSchema, z.lazy(() => EnumWorkCaseStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  priority: z.union([TaskPrioritySchema, z.lazy(() => EnumTaskPriorityFieldUpdateOperationsInputObjectSchema)]).optional(),
  triagedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  resolvedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  cancelledAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  watch: z.lazy(() => WatchUpdateOneRequiredWithoutWorkCaseNestedInputObjectSchema).optional(),
  category: z.lazy(() => WorkCaseCategoryUpdateOneWithoutWorkCasesNestedInputObjectSchema).optional(),
  raisedByUser: z.lazy(() => UserUpdateOneWithoutRaisedWorkCasesNestedInputObjectSchema).optional(),
  assignedToUser: z.lazy(() => UserUpdateOneWithoutAssignedWorkCasesNestedInputObjectSchema).optional(),
  tasks: z.lazy(() => TaskUpdateManyWithoutWorkCaseNestedInputObjectSchema).optional(),
  serviceRequests: z.lazy(() => ServiceRequestUpdateManyWithoutWorkCaseNestedInputObjectSchema).optional(),
  activities: z.lazy(() => WorkCaseActivityUpdateManyWithoutWorkCaseNestedInputObjectSchema).optional()
}).strict();
export const WorkCaseUpdateInputObjectSchema: z.ZodType<Prisma.WorkCaseUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseUpdateInput>;
export const WorkCaseUpdateInputObjectZodSchema = makeSchema();
