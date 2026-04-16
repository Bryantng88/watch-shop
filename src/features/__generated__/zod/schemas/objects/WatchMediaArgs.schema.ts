import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchMediaSelectObjectSchema as WatchMediaSelectObjectSchema } from './WatchMediaSelect.schema';
import { WatchMediaIncludeObjectSchema as WatchMediaIncludeObjectSchema } from './WatchMediaInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => WatchMediaSelectObjectSchema).optional(),
  include: z.lazy(() => WatchMediaIncludeObjectSchema).optional()
}).strict();
export const WatchMediaArgsObjectSchema = makeSchema();
export const WatchMediaArgsObjectZodSchema = makeSchema();
