import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ComplicationCountOutputTypeSelectObjectSchema as ComplicationCountOutputTypeSelectObjectSchema } from './ComplicationCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => ComplicationCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const ComplicationCountOutputTypeArgsObjectSchema = makeSchema();
export const ComplicationCountOutputTypeArgsObjectZodSchema = makeSchema();
