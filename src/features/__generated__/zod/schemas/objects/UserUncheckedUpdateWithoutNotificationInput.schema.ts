import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema as BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { CustomerUncheckedUpdateOneWithoutUserNestedInputObjectSchema as CustomerUncheckedUpdateOneWithoutUserNestedInputObjectSchema } from './CustomerUncheckedUpdateOneWithoutUserNestedInput.schema';
import { MaintenanceRecordUncheckedUpdateManyWithoutUserNestedInputObjectSchema as MaintenanceRecordUncheckedUpdateManyWithoutUserNestedInputObjectSchema } from './MaintenanceRecordUncheckedUpdateManyWithoutUserNestedInput.schema';
import { ServiceRequestUncheckedUpdateManyWithoutUserNestedInputObjectSchema as ServiceRequestUncheckedUpdateManyWithoutUserNestedInputObjectSchema } from './ServiceRequestUncheckedUpdateManyWithoutUserNestedInput.schema';
import { TechnicalIssueUncheckedUpdateManyWithoutUserNestedInputObjectSchema as TechnicalIssueUncheckedUpdateManyWithoutUserNestedInputObjectSchema } from './TechnicalIssueUncheckedUpdateManyWithoutUserNestedInput.schema';
import { RoleUncheckedUpdateManyWithoutUserNestedInputObjectSchema as RoleUncheckedUpdateManyWithoutUserNestedInputObjectSchema } from './RoleUncheckedUpdateManyWithoutUserNestedInput.schema'

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
  MaintenanceRecord: z.lazy(() => MaintenanceRecordUncheckedUpdateManyWithoutUserNestedInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestUncheckedUpdateManyWithoutUserNestedInputObjectSchema).optional(),
  TechnicalIssue: z.lazy(() => TechnicalIssueUncheckedUpdateManyWithoutUserNestedInputObjectSchema).optional(),
  roles: z.lazy(() => RoleUncheckedUpdateManyWithoutUserNestedInputObjectSchema).optional()
}).strict();
export const UserUncheckedUpdateWithoutNotificationInputObjectSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutNotificationInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUncheckedUpdateWithoutNotificationInput>;
export const UserUncheckedUpdateWithoutNotificationInputObjectZodSchema = makeSchema();
