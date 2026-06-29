import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { BusinessEventLogCountOutputTypeSelectObjectSchema as BusinessEventLogCountOutputTypeSelectObjectSchema } from './BusinessEventLogCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => BusinessEventLogCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const BusinessEventLogCountOutputTypeArgsObjectSchema = makeSchema();
export const BusinessEventLogCountOutputTypeArgsObjectZodSchema = makeSchema();
