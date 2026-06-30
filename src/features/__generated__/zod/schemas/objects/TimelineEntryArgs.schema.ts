import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TimelineEntrySelectObjectSchema as TimelineEntrySelectObjectSchema } from './TimelineEntrySelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => TimelineEntrySelectObjectSchema).optional()
}).strict();
export const TimelineEntryArgsObjectSchema = makeSchema();
export const TimelineEntryArgsObjectZodSchema = makeSchema();
