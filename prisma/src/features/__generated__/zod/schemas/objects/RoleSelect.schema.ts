import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PermissionFindManySchema as PermissionFindManySchema } from '../findManyPermission.schema';
import { UserFindManySchema as UserFindManySchema } from '../findManyUser.schema';
import { RoleCountOutputTypeArgsObjectSchema as RoleCountOutputTypeArgsObjectSchema } from './RoleCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  permissions: z.union([z.boolean(), z.lazy(() => PermissionFindManySchema)]).optional(),
  users: z.union([z.boolean(), z.lazy(() => UserFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => RoleCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const RoleSelectObjectSchema: z.ZodType<Prisma.RoleSelect> = makeSchema() as unknown as z.ZodType<Prisma.RoleSelect>;
export const RoleSelectObjectZodSchema = makeSchema();
