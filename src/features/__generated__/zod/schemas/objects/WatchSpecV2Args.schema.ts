import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSpecV2SelectObjectSchema as WatchSpecV2SelectObjectSchema } from './WatchSpecV2Select.schema';
import { WatchSpecV2IncludeObjectSchema as WatchSpecV2IncludeObjectSchema } from './WatchSpecV2Include.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => WatchSpecV2SelectObjectSchema).optional(),
  include: z.lazy(() => WatchSpecV2IncludeObjectSchema).optional()
}).strict();
export const WatchSpecV2ArgsObjectSchema = makeSchema();
export const WatchSpecV2ArgsObjectZodSchema = makeSchema();
