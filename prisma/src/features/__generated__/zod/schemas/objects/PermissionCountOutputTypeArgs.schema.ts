import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PermissionCountOutputTypeSelectObjectSchema as PermissionCountOutputTypeSelectObjectSchema } from './PermissionCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => PermissionCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const PermissionCountOutputTypeArgsObjectSchema = makeSchema();
export const PermissionCountOutputTypeArgsObjectZodSchema = makeSchema();
