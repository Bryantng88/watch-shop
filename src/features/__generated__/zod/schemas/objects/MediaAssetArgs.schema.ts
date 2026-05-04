import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaAssetSelectObjectSchema as MediaAssetSelectObjectSchema } from './MediaAssetSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => MediaAssetSelectObjectSchema).optional()
}).strict();
export const MediaAssetArgsObjectSchema = makeSchema();
export const MediaAssetArgsObjectZodSchema = makeSchema();
