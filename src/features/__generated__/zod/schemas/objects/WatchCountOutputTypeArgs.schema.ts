import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchCountOutputTypeSelectObjectSchema as WatchCountOutputTypeSelectObjectSchema } from './WatchCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => WatchCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const WatchCountOutputTypeArgsObjectSchema = makeSchema();
export const WatchCountOutputTypeArgsObjectZodSchema = makeSchema();
