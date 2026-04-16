import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema as BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { CustomerUpdateOneWithoutUserNestedInputObjectSchema as CustomerUpdateOneWithoutUserNestedInputObjectSchema } from './CustomerUpdateOneWithoutUserNestedInput.schema';
import { NotificationUpdateManyWithoutUserNestedInputObjectSchema as NotificationUpdateManyWithoutUserNestedInputObjectSchema } from './NotificationUpdateManyWithoutUserNestedInput.schema';
import { ServiceRequestUpdateManyWithoutUserNestedInputObjectSchema as ServiceRequestUpdateManyWithoutUserNestedInputObjectSchema } from './ServiceRequestUpdateManyWithoutUserNestedInput.schema';
import { TechnicalIssueUpdateManyWithoutUserNestedInputObjectSchema as TechnicalIssueUpdateManyWithoutUserNestedInputObjectSchema } from './TechnicalIssueUpdateManyWithoutUserNestedInput.schema';
import { RoleUpdateManyWithoutUserNestedInputObjectSchema as RoleUpdateManyWithoutUserNestedInputObjectSchema } from './RoleUpdateManyWithoutUserNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  passwordHash: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  name: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  avatarUrl: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  isActive: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  roleId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  Customer: z.lazy(() => CustomerUpdateOneWithoutUserNestedInputObjectSchema).optional(),
  Notification: z.lazy(() => NotificationUpdateManyWithoutUserNestedInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestUpdateManyWithoutUserNestedInputObjectSchema).optional(),
  TechnicalIssue: z.lazy(() => TechnicalIssueUpdateManyWithoutUserNestedInputObjectSchema).optional(),
  Role: z.lazy(() => RoleUpdateManyWithoutUserNestedInputObjectSchema).optional()
}).strict();
export const UserUpdateWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.UserUpdateWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateWithoutMaintenanceRecordInput>;
export const UserUpdateWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
