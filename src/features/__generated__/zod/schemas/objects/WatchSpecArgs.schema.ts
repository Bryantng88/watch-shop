import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSpecSelectObjectSchema as WatchSpecSelectObjectSchema } from './WatchSpecSelect.schema';
import { WatchSpecIncludeObjectSchema as WatchSpecIncludeObjectSchema } from './WatchSpecInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => WatchSpecSelectObjectSchema).optional(),
  include: z.lazy(() => WatchSpecIncludeObjectSchema).optional()
}).strict();
export const WatchSpecArgsObjectSchema = makeSchema();
export const WatchSpecArgsObjectZodSchema = makeSchema();
