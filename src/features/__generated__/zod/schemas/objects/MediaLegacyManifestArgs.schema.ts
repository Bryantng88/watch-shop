import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaLegacyManifestSelectObjectSchema as MediaLegacyManifestSelectObjectSchema } from './MediaLegacyManifestSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => MediaLegacyManifestSelectObjectSchema).optional()
}).strict();
export const MediaLegacyManifestArgsObjectSchema = makeSchema();
export const MediaLegacyManifestArgsObjectZodSchema = makeSchema();
