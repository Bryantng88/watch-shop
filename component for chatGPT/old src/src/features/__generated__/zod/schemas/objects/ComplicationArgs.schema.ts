import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ComplicationSelectObjectSchema as ComplicationSelectObjectSchema } from './ComplicationSelect.schema';
import { ComplicationIncludeObjectSchema as ComplicationIncludeObjectSchema } from './ComplicationInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => ComplicationSelectObjectSchema).optional(),
  include: z.lazy(() => ComplicationIncludeObjectSchema).optional()
}).strict();
export const ComplicationArgsObjectSchema = makeSchema();
export const ComplicationArgsObjectZodSchema = makeSchema();
