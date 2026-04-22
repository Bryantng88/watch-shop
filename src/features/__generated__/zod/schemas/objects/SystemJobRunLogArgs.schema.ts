import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SystemJobRunLogSelectObjectSchema as SystemJobRunLogSelectObjectSchema } from './SystemJobRunLogSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => SystemJobRunLogSelectObjectSchema).optional()
}).strict();
export const SystemJobRunLogArgsObjectSchema = makeSchema();
export const SystemJobRunLogArgsObjectZodSchema = makeSchema();
