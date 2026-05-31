import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PostTargetCountOutputTypeSelectObjectSchema as PostTargetCountOutputTypeSelectObjectSchema } from './PostTargetCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => PostTargetCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const PostTargetCountOutputTypeArgsObjectSchema = makeSchema();
export const PostTargetCountOutputTypeArgsObjectZodSchema = makeSchema();
