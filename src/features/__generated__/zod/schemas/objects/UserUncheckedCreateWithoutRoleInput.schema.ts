import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerUncheckedCreateNestedOneWithoutUserInputObjectSchema as CustomerUncheckedCreateNestedOneWithoutUserInputObjectSchema } from './CustomerUncheckedCreateNestedOneWithoutUserInput.schema';
import { MaintenanceRecordUncheckedCreateNestedManyWithoutUserInputObjectSchema as MaintenanceRecordUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './MaintenanceRecordUncheckedCreateNestedManyWithoutUserInput.schema';
import { NotificationUncheckedCreateNestedManyWithoutUserInputObjectSchema as NotificationUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './NotificationUncheckedCreateNestedManyWithoutUserInput.schema';
import { ServiceRequestUncheckedCreateNestedManyWithoutUserInputObjectSchema as ServiceRequestUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './ServiceRequestUncheckedCreateNestedManyWithoutUserInput.schema';
import { TechnicalIssueUncheckedCreateNestedManyWithoutUserInputObjectSchema as TechnicalIssueUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './TechnicalIssueUncheckedCreateNestedManyWithoutUserInput.schema'

const makeSchema = () => z.object({
  id: z.string(),
  email: z.string(),
  passwordHash: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date(),
  roleId: z.string().optional().nullable(),
  Customer: z.lazy(() => CustomerUncheckedCreateNestedOneWithoutUserInputObjectSchema).optional(),
  MaintenanceRecord: z.lazy(() => MaintenanceRecordUncheckedCreateNestedManyWithoutUserInputObjectSchema).optional(),
  Notification: z.lazy(() => NotificationUncheckedCreateNestedManyWithoutUserInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestUncheckedCreateNestedManyWithoutUserInputObjectSchema).optional(),
  TechnicalIssue: z.lazy(() => TechnicalIssueUncheckedCreateNestedManyWithoutUserInputObjectSchema).optional()
}).strict();
export const UserUncheckedCreateWithoutRoleInputObjectSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutRoleInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUncheckedCreateWithoutRoleInput>;
export const UserUncheckedCreateWithoutRoleInputObjectZodSchema = makeSchema();
