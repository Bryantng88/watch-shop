import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewStateCountOutputTypeSelectObjectSchema as WatchReviewStateCountOutputTypeSelectObjectSchema } from './WatchReviewStateCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => WatchReviewStateCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const WatchReviewStateCountOutputTypeArgsObjectSchema = makeSchema();
export const WatchReviewStateCountOutputTypeArgsObjectZodSchema = makeSchema();
