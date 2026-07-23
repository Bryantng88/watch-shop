import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaLegacyManifestSelectObjectSchema as MediaLegacyManifestSelectObjectSchema } from './objects/MediaLegacyManifestSelect.schema';
import { MediaLegacyManifestWhereUniqueInputObjectSchema as MediaLegacyManifestWhereUniqueInputObjectSchema } from './objects/MediaLegacyManifestWhereUniqueInput.schema';

export const MediaLegacyManifestFindUniqueSchema: z.ZodType<Prisma.MediaLegacyManifestFindUniqueArgs> = z.object({ select: MediaLegacyManifestSelectObjectSchema.optional(),  where: MediaLegacyManifestWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.MediaLegacyManifestFindUniqueArgs>;

export const MediaLegacyManifestFindUniqueZodSchema = z.object({ select: MediaLegacyManifestSelectObjectSchema.optional(),  where: MediaLegacyManifestWhereUniqueInputObjectSchema }).strict();