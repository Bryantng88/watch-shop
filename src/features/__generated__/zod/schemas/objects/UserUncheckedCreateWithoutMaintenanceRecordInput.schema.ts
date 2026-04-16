import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerUncheckedCreateNestedOneWithoutUserInputObjectSchema as CustomerUncheckedCreateNestedOneWithoutUserInputObjectSchema } from './CustomerUncheckedCreateNestedOneWithoutUserInput.schema';
import { NotificationUncheckedCreateNestedManyWithoutUserInputObjectSchema as NotificationUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './NotificationUncheckedCreateNestedManyWithoutUserInput.schema';
import { ServiceRequestUncheckedCreateNestedManyWithoutUserInputObjectSchema as ServiceRequestUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './ServiceRequestUncheckedCreateNestedManyWithoutUserInput.schema';
import { TechnicalIssueUncheckedCreateNestedManyWithoutUserInputObjectSchema as TechnicalIssueUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './TechnicalIssueUncheckedCreateNestedManyWithoutUserInput.schema';
import { RoleUncheckedCreateNestedManyWithoutUserInputObjectSchema as RoleUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './RoleUncheckedCreateNestedManyWithoutUserInput.schema'

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
  Notification: z.lazy(() => NotificationUncheckedCreateNestedManyWithoutUserInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestUncheckedCreateNestedManyWithoutUserInputObjectSchema).optional(),
  TechnicalIssue: z.lazy(() => TechnicalIssueUncheckedCreateNestedManyWithoutUserInputObjectSchema).optional(),
  roles: z.lazy(() => RoleUncheckedCreateNestedManyWithoutUserInputObjectSchema).optional()
}).strict();
export const UserUncheckedCreateWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUncheckedCreateWithoutMaintenanceRecordInput>;
export const UserUncheckedCreateWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
