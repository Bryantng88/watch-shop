import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSelectObjectSchema as WatchSelectObjectSchema } from './WatchSelect.schema';
import { WatchIncludeObjectSchema as WatchIncludeObjectSchema } from './WatchInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => WatchSelectObjectSchema).optional(),
  include: z.lazy(() => WatchIncludeObjectSchema).optional()
}).strict();
export const WatchArgsObjectSchema = makeSchema();
export const WatchArgsObjectZodSchema = makeSchema();
