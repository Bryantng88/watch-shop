import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaOperationSelectObjectSchema as MediaOperationSelectObjectSchema } from './MediaOperationSelect.schema';
import { MediaOperationIncludeObjectSchema as MediaOperationIncludeObjectSchema } from './MediaOperationInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => MediaOperationSelectObjectSchema).optional(),
  include: z.lazy(() => MediaOperationIncludeObjectSchema).optional()
}).strict();
export const MediaOperationArgsObjectSchema = makeSchema();
export const MediaOperationArgsObjectZodSchema = makeSchema();
