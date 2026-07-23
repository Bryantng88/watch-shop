import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaObjectSelectObjectSchema as MediaObjectSelectObjectSchema } from './MediaObjectSelect.schema';
import { MediaObjectIncludeObjectSchema as MediaObjectIncludeObjectSchema } from './MediaObjectInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => MediaObjectSelectObjectSchema).optional(),
  include: z.lazy(() => MediaObjectIncludeObjectSchema).optional()
}).strict();
export const MediaObjectArgsObjectSchema = makeSchema();
export const MediaObjectArgsObjectZodSchema = makeSchema();
