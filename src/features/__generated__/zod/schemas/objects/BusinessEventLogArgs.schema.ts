import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { BusinessEventLogSelectObjectSchema as BusinessEventLogSelectObjectSchema } from './BusinessEventLogSelect.schema';
import { BusinessEventLogIncludeObjectSchema as BusinessEventLogIncludeObjectSchema } from './BusinessEventLogInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => BusinessEventLogSelectObjectSchema).optional(),
  include: z.lazy(() => BusinessEventLogIncludeObjectSchema).optional()
}).strict();
export const BusinessEventLogArgsObjectSchema = makeSchema();
export const BusinessEventLogArgsObjectZodSchema = makeSchema();
