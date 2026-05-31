import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PostTargetSelectObjectSchema as PostTargetSelectObjectSchema } from './PostTargetSelect.schema';
import { PostTargetIncludeObjectSchema as PostTargetIncludeObjectSchema } from './PostTargetInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => PostTargetSelectObjectSchema).optional(),
  include: z.lazy(() => PostTargetIncludeObjectSchema).optional()
}).strict();
export const PostTargetArgsObjectSchema = makeSchema();
export const PostTargetArgsObjectZodSchema = makeSchema();
