import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PermissionFindManySchema as PermissionFindManySchema } from '../findManyPermission.schema';
import { UserFindManySchema as UserFindManySchema } from '../findManyUser.schema';
import { RoleCountOutputTypeArgsObjectSchema as RoleCountOutputTypeArgsObjectSchema } from './RoleCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  permissions: z.union([z.boolean(), z.lazy(() => PermissionFindManySchema)]).optional(),
  users: z.union([z.boolean(), z.lazy(() => UserFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => RoleCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const RoleIncludeObjectSchema: z.ZodType<Prisma.RoleInclude> = makeSchema() as unknown as z.ZodType<Prisma.RoleInclude>;
export const RoleIncludeObjectZodSchema = makeSchema();
