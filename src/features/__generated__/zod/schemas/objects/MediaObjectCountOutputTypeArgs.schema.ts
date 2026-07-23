import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaObjectCountOutputTypeSelectObjectSchema as MediaObjectCountOutputTypeSelectObjectSchema } from './MediaObjectCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => MediaObjectCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const MediaObjectCountOutputTypeArgsObjectSchema = makeSchema();
export const MediaObjectCountOutputTypeArgsObjectZodSchema = makeSchema();
