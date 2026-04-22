import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SystemJobControlSelectObjectSchema as SystemJobControlSelectObjectSchema } from './SystemJobControlSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => SystemJobControlSelectObjectSchema).optional()
}).strict();
export const SystemJobControlArgsObjectSchema = makeSchema();
export const SystemJobControlArgsObjectZodSchema = makeSchema();
