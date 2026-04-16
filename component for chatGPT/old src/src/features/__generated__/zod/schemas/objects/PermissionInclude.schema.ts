import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { RoleFindManySchema as RoleFindManySchema } from '../findManyRole.schema';
import { PermissionCountOutputTypeArgsObjectSchema as PermissionCountOutputTypeArgsObjectSchema } from './PermissionCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  roles: z.union([z.boolean(), z.lazy(() => RoleFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => PermissionCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const PermissionIncludeObjectSchema: z.ZodType<Prisma.PermissionInclude> = makeSchema() as unknown as z.ZodType<Prisma.PermissionInclude>;
export const PermissionIncludeObjectZodSchema = makeSchema();
