import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerArgsObjectSchema as CustomerArgsObjectSchema } from './CustomerArgs.schema';
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
  roles: z.union([z.boolean(), z.lazy(() => RoleFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => UserCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const UserSelectObjectSchema: z.ZodType<Prisma.UserSelect> = makeSchema() as unknown as z.ZodType<Prisma.UserSelect>;
export const UserSelectObjectZodSchema = makeSchema();
