import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagLinkSelectObjectSchema as AppTagLinkSelectObjectSchema } from './AppTagLinkSelect.schema';
import { AppTagLinkIncludeObjectSchema as AppTagLinkIncludeObjectSchema } from './AppTagLinkInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => AppTagLinkSelectObjectSchema).optional(),
  include: z.lazy(() => AppTagLinkIncludeObjectSchema).optional()
}).strict();
export const AppTagLinkArgsObjectSchema = makeSchema();
export const AppTagLinkArgsObjectZodSchema = makeSchema();
