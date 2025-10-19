import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSpecCountOutputTypeSelectObjectSchema as WatchSpecCountOutputTypeSelectObjectSchema } from './WatchSpecCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => WatchSpecCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const WatchSpecCountOutputTypeArgsObjectSchema = makeSchema();
export const WatchSpecCountOutputTypeArgsObjectZodSchema = makeSchema();
