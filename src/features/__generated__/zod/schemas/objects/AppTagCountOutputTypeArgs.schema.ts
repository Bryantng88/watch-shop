import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagCountOutputTypeSelectObjectSchema as AppTagCountOutputTypeSelectObjectSchema } from './AppTagCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => AppTagCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const AppTagCountOutputTypeArgsObjectSchema = makeSchema();
export const AppTagCountOutputTypeArgsObjectZodSchema = makeSchema();
