import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCommentSelectObjectSchema as UserCommentSelectObjectSchema } from './UserCommentSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => UserCommentSelectObjectSchema).optional()
}).strict();
export const UserCommentArgsObjectSchema = makeSchema();
export const UserCommentArgsObjectZodSchema = makeSchema();
