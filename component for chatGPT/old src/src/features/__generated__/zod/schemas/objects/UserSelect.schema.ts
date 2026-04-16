import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerArgsObjectSchema as CustomerArgsObjectSchema } from './CustomerArgs.schema';
import { MaintenanceRecordFindManySchema as MaintenanceRecordFindManySchema } from '../findManyMaintenanceRecord.schema';
import { NotificationFindManySchema as NotificationFindManySchema } from '../findManyNotification.schema';
import { ServiceRequestFindManySchema as ServiceRequestFindManySchema } from '../findManyServiceRequest.schema';
import { TechnicalIssueFindManySchema as TechnicalIssueFindManySchema } from '../findManyTechnicalIssue.schema';
import { RoleFindManySchema as RoleFindManySchema } from '../findManyRole.schema';
import { UserCountOutputTypeArgsObjectSchema as UserCountOutputTypeArgsObjectSchema } from './UserCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  email: z.boolean().optional(),
  passwordHash: z.boolean().optional(),
  name: z.boolean().optional(),
  avatarUrl: z.boolean().optional(),
  isActive: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  roleId: z.boolean().optional(),
  customer: z.union([z.boolean(), z.lazy(() => CustomerArgsObjectSchema)]).optional(),
  MaintenanceRecord: z.union([z.boolean(), z.lazy(() => MaintenanceRecordFindManySchema)]).optional(),
  Notification: z.union([z.boolean(), z.lazy(() => NotificationFindManySchema)]).optional(),
  ServiceRequest: z.union([z.boolean(), z.lazy(() => ServiceRequestFindManySchema)]).optional(),
  TechnicalIssue: z.union([z.boolean(), z.lazy(() => TechnicalIssueFindManySchema)]).optional(),
  roles: z.union([z.boolean(), z.lazy(() => RoleFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => UserCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const UserSelectObjectSchema: z.ZodType<Prisma.UserSelect> = makeSchema() as unknown as z.ZodType<Prisma.UserSelect>;
export const UserSelectObjectZodSchema = makeSchema();
