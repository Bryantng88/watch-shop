import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerUncheckedCreateNestedOneWithoutUserInputObjectSchema as CustomerUncheckedCreateNestedOneWithoutUserInputObjectSchema } from './CustomerUncheckedCreateNestedOneWithoutUserInput.schema';
import { MaintenanceRecordUncheckedCreateNestedManyWithoutUserInputObjectSchema as MaintenanceRecordUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './MaintenanceRecordUncheckedCreateNestedManyWithoutUserInput.schema';
import { NotificationUncheckedCreateNestedManyWithoutUserInputObjectSchema as NotificationUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './NotificationUncheckedCreateNestedManyWithoutUserInput.schema';
import { TechnicalIssueUncheckedCreateNestedManyWithoutUserInputObjectSchema as TechnicalIssueUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './TechnicalIssueUncheckedCreateNestedManyWithoutUserInput.schema';
import { RoleUncheckedCreateNestedManyWithoutUsersInputObjectSchema as RoleUncheckedCreateNestedManyWithoutUsersInputObjectSchema } from './RoleUncheckedCreateNestedManyWithoutUsersInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  email: z.string(),
  passwordHash: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  roleId: z.string().optional().nullable(),
  customer: z.lazy(() => CustomerUncheckedCreateNestedOneWithoutUserInputObjectSchema).optional(),
  MaintenanceRecord: z.lazy(() => MaintenanceRecordUncheckedCreateNestedManyWithoutUserInputObjectSchema).optional(),
  Notification: z.lazy(() => NotificationUncheckedCreateNestedManyWithoutUserInputObjectSchema).optional(),
  TechnicalIssue: z.lazy(() => TechnicalIssueUncheckedCreateNestedManyWithoutUserInputObjectSchema).optional(),
  roles: z.lazy(() => RoleUncheckedCreateNestedManyWithoutUsersInputObjectSchema).optional()
}).strict();
export const UserUncheckedCreateWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUncheckedCreateWithoutServiceRequestInput>;
export const UserUncheckedCreateWithoutServiceRequestInputObjectZodSchema = makeSchema();
