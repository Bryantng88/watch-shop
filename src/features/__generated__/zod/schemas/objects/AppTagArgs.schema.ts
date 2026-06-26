import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagSelectObjectSchema as AppTagSelectObjectSchema } from './AppTagSelect.schema';
import { AppTagIncludeObjectSchema as AppTagIncludeObjectSchema } from './AppTagInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => AppTagSelectObjectSchema).optional(),
  include: z.lazy(() => AppTagIncludeObjectSchema).optional()
}).strict();
export const AppTagArgsObjectSchema = makeSchema();
export const AppTagArgsObjectZodSchema = makeSchema();
