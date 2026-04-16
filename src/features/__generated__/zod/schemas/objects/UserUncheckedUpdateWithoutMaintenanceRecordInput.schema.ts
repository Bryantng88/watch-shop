import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema as BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { CustomerUncheckedUpdateOneWithoutUserNestedInputObjectSchema as CustomerUncheckedUpdateOneWithoutUserNestedInputObjectSchema } from './CustomerUncheckedUpdateOneWithoutUserNestedInput.schema';
import { NotificationUncheckedUpdateManyWithoutUserNestedInputObjectSchema as NotificationUncheckedUpdateManyWithoutUserNestedInputObjectSchema } from './NotificationUncheckedUpdateManyWithoutUserNestedInput.schema';
import { ServiceRequestUncheckedUpdateManyWithoutUserNestedInputObjectSchema as ServiceRequestUncheckedUpdateManyWithoutUserNestedInputObjectSchema } from './ServiceRequestUncheckedUpdateManyWithoutUserNestedInput.schema';
import { TechnicalIssueUncheckedUpdateManyWithoutUserNestedInputObjectSchema as TechnicalIssueUncheckedUpdateManyWithoutUserNestedInputObjectSchema } from './TechnicalIssueUncheckedUpdateManyWithoutUserNestedInput.schema';
import { RoleUncheckedUpdateManyWithoutUsersNestedInputObjectSchema as RoleUncheckedUpdateManyWithoutUsersNestedInputObjectSchema } from './RoleUncheckedUpdateManyWithoutUsersNestedInput.schema'

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
  Customer: z.lazy(() => CustomerUncheckedUpdateOneWithoutUserNestedInputObjectSchema).optional(),
  Notification: z.lazy(() => NotificationUncheckedUpdateManyWithoutUserNestedInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestUncheckedUpdateManyWithoutUserNestedInputObjectSchema).optional(),
  TechnicalIssue: z.lazy(() => TechnicalIssueUncheckedUpdateManyWithoutUserNestedInputObjectSchema).optional(),
  roles: z.lazy(() => RoleUncheckedUpdateManyWithoutUsersNestedInputObjectSchema).optional()
}).strict();
export const UserUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUncheckedUpdateWithoutMaintenanceRecordInput>;
export const UserUncheckedUpdateWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
