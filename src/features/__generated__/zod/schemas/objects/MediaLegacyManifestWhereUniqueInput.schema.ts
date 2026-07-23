import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  legacyMediaAssetId: z.string().optional()
}).strict();
export const MediaLegacyManifestWhereUniqueInputObjectSchema: z.ZodType<Prisma.MediaLegacyManifestWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaLegacyManifestWhereUniqueInput>;
export const MediaLegacyManifestWhereUniqueInputObjectZodSchema = makeSchema();
