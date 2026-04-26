import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerUncheckedCreateNestedOneWithoutUserInputObjectSchema as CustomerUncheckedCreateNestedOneWithoutUserInputObjectSchema } from './CustomerUncheckedCreateNestedOneWithoutUserInput.schema';
import { MaintenanceRecordUncheckedCreateNestedManyWithoutUserInputObjectSchema as MaintenanceRecordUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './MaintenanceRecordUncheckedCreateNestedManyWithoutUserInput.schema';
import { NotificationUncheckedCreateNestedManyWithoutUserInputObjectSchema as NotificationUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './NotificationUncheckedCreateNestedManyWithoutUserInput.schema';
import { ServiceRequestUncheckedCreateNestedManyWithoutUserInputObjectSchema as ServiceRequestUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './ServiceRequestUncheckedCreateNestedManyWithoutUserInput.schema';
import { RoleUncheckedCreateNestedManyWithoutUsersInputObjectSchema as RoleUncheckedCreateNestedManyWithoutUsersInputObjectSchema } from './RoleUncheckedCreateNestedManyWithoutUsersInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  email: z.string(),
  passwordHash: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date(),
  roleId: z.string().optional().nullable(),
  customer: z.lazy(() => CustomerUncheckedCreateNestedOneWithoutUserInputObjectSchema).optional(),
  maintenanceRecord: z.lazy(() => MaintenanceRecordUncheckedCreateNestedManyWithoutUserInputObjectSchema).optional(),
  notification: z.lazy(() => NotificationUncheckedCreateNestedManyWithoutUserInputObjectSchema).optional(),
  serviceRequest: z.lazy(() => ServiceRequestUncheckedCreateNestedManyWithoutUserInputObjectSchema).optional(),
  roles: z.lazy(() => RoleUncheckedCreateNestedManyWithoutUsersInputObjectSchema).optional()
}).strict();
export const UserUncheckedCreateWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUncheckedCreateWithoutTechnicalIssueInput>;
export const UserUncheckedCreateWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
