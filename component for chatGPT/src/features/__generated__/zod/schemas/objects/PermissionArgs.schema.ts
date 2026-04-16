import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PermissionSelectObjectSchema as PermissionSelectObjectSchema } from './PermissionSelect.schema';
import { PermissionIncludeObjectSchema as PermissionIncludeObjectSchema } from './PermissionInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => PermissionSelectObjectSchema).optional(),
  include: z.lazy(() => PermissionIncludeObjectSchema).optional()
}).strict();
export const PermissionArgsObjectSchema = makeSchema();
export const PermissionArgsObjectZodSchema = makeSchema();
