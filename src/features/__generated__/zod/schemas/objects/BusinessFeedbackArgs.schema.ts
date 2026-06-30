import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { BusinessFeedbackSelectObjectSchema as BusinessFeedbackSelectObjectSchema } from './BusinessFeedbackSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => BusinessFeedbackSelectObjectSchema).optional()
}).strict();
export const BusinessFeedbackArgsObjectSchema = makeSchema();
export const BusinessFeedbackArgsObjectZodSchema = makeSchema();
