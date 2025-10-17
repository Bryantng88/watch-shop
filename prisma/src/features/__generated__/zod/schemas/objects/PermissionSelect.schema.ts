import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { RoleFindManySchema as RoleFindManySchema } from '../findManyRole.schema';
import { PermissionCountOutputTypeArgsObjectSchema as PermissionCountOutputTypeArgsObjectSchema } from './PermissionCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  code: z.boolean().optional(),
  description: z.boolean().optional(),
  roles: z.union([z.boolean(), z.lazy(() => RoleFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => PermissionCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const PermissionSelectObjectSchema: z.ZodType<Prisma.PermissionSelect> = makeSchema() as unknown as z.ZodType<Prisma.PermissionSelect>;
export const PermissionSelectObjectZodSchema = makeSchema();
