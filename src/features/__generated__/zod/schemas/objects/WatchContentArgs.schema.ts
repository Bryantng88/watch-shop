import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchContentSelectObjectSchema as WatchContentSelectObjectSchema } from './WatchContentSelect.schema';
import { WatchContentIncludeObjectSchema as WatchContentIncludeObjectSchema } from './WatchContentInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => WatchContentSelectObjectSchema).optional(),
  include: z.lazy(() => WatchContentIncludeObjectSchema).optional()
}).strict();
export const WatchContentArgsObjectSchema = makeSchema();
export const WatchContentArgsObjectZodSchema = makeSchema();
