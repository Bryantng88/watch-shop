import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordCreateNestedManyWithoutUserInputObjectSchema as MaintenanceRecordCreateNestedManyWithoutUserInputObjectSchema } from './MaintenanceRecordCreateNestedManyWithoutUserInput.schema';
import { NotificationCreateNestedManyWithoutUserInputObjectSchema as NotificationCreateNestedManyWithoutUserInputObjectSchema } from './NotificationCreateNestedManyWithoutUserInput.schema';
import { ServiceRequestCreateNestedManyWithoutUserInputObjectSchema as ServiceRequestCreateNestedManyWithoutUserInputObjectSchema } from './ServiceRequestCreateNestedManyWithoutUserInput.schema';
import { TechnicalIssueCreateNestedManyWithoutUserInputObjectSchema as TechnicalIssueCreateNestedManyWithoutUserInputObjectSchema } from './TechnicalIssueCreateNestedManyWithoutUserInput.schema';
import { RoleCreateNestedManyWithoutUsersInputObjectSchema as RoleCreateNestedManyWithoutUsersInputObjectSchema } from './RoleCreateNestedManyWithoutUsersInput.schema'

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
  MaintenanceRecord: z.lazy(() => MaintenanceRecordCreateNestedManyWithoutUserInputObjectSchema).optional(),
  Notification: z.lazy(() => NotificationCreateNestedManyWithoutUserInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestCreateNestedManyWithoutUserInputObjectSchema).optional(),
  TechnicalIssue: z.lazy(() => TechnicalIssueCreateNestedManyWithoutUserInputObjectSchema).optional(),
  roles: z.lazy(() => RoleCreateNestedManyWithoutUsersInputObjectSchema).optional()
}).strict();
export const UserCreateWithoutCustomerInputObjectSchema: z.ZodType<Prisma.UserCreateWithoutCustomerInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateWithoutCustomerInput>;
export const UserCreateWithoutCustomerInputObjectZodSchema = makeSchema();
