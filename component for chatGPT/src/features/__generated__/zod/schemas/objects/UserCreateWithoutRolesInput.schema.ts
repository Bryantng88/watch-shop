import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerCreateNestedOneWithoutUserInputObjectSchema as CustomerCreateNestedOneWithoutUserInputObjectSchema } from './CustomerCreateNestedOneWithoutUserInput.schema';
import { MaintenanceRecordCreateNestedManyWithoutUserInputObjectSchema as MaintenanceRecordCreateNestedManyWithoutUserInputObjectSchema } from './MaintenanceRecordCreateNestedManyWithoutUserInput.schema';
import { NotificationCreateNestedManyWithoutUserInputObjectSchema as NotificationCreateNestedManyWithoutUserInputObjectSchema } from './NotificationCreateNestedManyWithoutUserInput.schema';
import { ServiceRequestCreateNestedManyWithoutUserInputObjectSchema as ServiceRequestCreateNestedManyWithoutUserInputObjectSchema } from './ServiceRequestCreateNestedManyWithoutUserInput.schema';
import { TechnicalIssueCreateNestedManyWithoutUserInputObjectSchema as TechnicalIssueCreateNestedManyWithoutUserInputObjectSchema } from './TechnicalIssueCreateNestedManyWithoutUserInput.schema'

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
  customer: z.lazy(() => CustomerCreateNestedOneWithoutUserInputObjectSchema).optional(),
  MaintenanceRecord: z.lazy(() => MaintenanceRecordCreateNestedManyWithoutUserInputObjectSchema).optional(),
  Notification: z.lazy(() => NotificationCreateNestedManyWithoutUserInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestCreateNestedManyWithoutUserInputObjectSchema).optional(),
  TechnicalIssue: z.lazy(() => TechnicalIssueCreateNestedManyWithoutUserInputObjectSchema).optional()
}).strict();
export const UserCreateWithoutRolesInputObjectSchema: z.ZodType<Prisma.UserCreateWithoutRolesInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateWithoutRolesInput>;
export const UserCreateWithoutRolesInputObjectZodSchema = makeSchema();
