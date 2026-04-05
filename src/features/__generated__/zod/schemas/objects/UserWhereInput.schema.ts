import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { CustomerNullableScalarRelationFilterObjectSchema as CustomerNullableScalarRelationFilterObjectSchema } from './CustomerNullableScalarRelationFilter.schema';
import { CustomerWhereInputObjectSchema as CustomerWhereInputObjectSchema } from './CustomerWhereInput.schema';
import { MaintenanceRecordListRelationFilterObjectSchema as MaintenanceRecordListRelationFilterObjectSchema } from './MaintenanceRecordListRelationFilter.schema';
import { ServiceRequestListRelationFilterObjectSchema as ServiceRequestListRelationFilterObjectSchema } from './ServiceRequestListRelationFilter.schema';
import { TechnicalIssueListRelationFilterObjectSchema as TechnicalIssueListRelationFilterObjectSchema } from './TechnicalIssueListRelationFilter.schema';
import { RoleListRelationFilterObjectSchema as RoleListRelationFilterObjectSchema } from './RoleListRelationFilter.schema'

const userwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => UserWhereInputObjectSchema), z.lazy(() => UserWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => UserWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => UserWhereInputObjectSchema), z.lazy(() => UserWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  email: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  passwordHash: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  name: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  avatarUrl: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  isActive: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  roleId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  customer: z.union([z.lazy(() => CustomerNullableScalarRelationFilterObjectSchema), z.lazy(() => CustomerWhereInputObjectSchema)]).optional(),
  MaintenanceRecord: z.lazy(() => MaintenanceRecordListRelationFilterObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestListRelationFilterObjectSchema).optional(),
  TechnicalIssue: z.lazy(() => TechnicalIssueListRelationFilterObjectSchema).optional(),
  roles: z.lazy(() => RoleListRelationFilterObjectSchema).optional()
}).strict();
export const UserWhereInputObjectSchema: z.ZodType<Prisma.UserWhereInput> = userwhereinputSchema as unknown as z.ZodType<Prisma.UserWhereInput>;
export const UserWhereInputObjectZodSchema = userwhereinputSchema;
