import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaBindingSelectObjectSchema as MediaBindingSelectObjectSchema } from './MediaBindingSelect.schema';
import { MediaBindingIncludeObjectSchema as MediaBindingIncludeObjectSchema } from './MediaBindingInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => MediaBindingSelectObjectSchema).optional(),
  include: z.lazy(() => MediaBindingIncludeObjectSchema).optional()
}).strict();
export const MediaBindingArgsObjectSchema = makeSchema();
export const MediaBindingArgsObjectZodSchema = makeSchema();
