import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaLegacyManifestSelectObjectSchema as MediaLegacyManifestSelectObjectSchema } from './objects/MediaLegacyManifestSelect.schema';
import { MediaLegacyManifestWhereUniqueInputObjectSchema as MediaLegacyManifestWhereUniqueInputObjectSchema } from './objects/MediaLegacyManifestWhereUniqueInput.schema';

export const MediaLegacyManifestFindUniqueOrThrowSchema: z.ZodType<Prisma.MediaLegacyManifestFindUniqueOrThrowArgs> = z.object({ select: MediaLegacyManifestSelectObjectSchema.optional(),  where: MediaLegacyManifestWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.MediaLegacyManifestFindUniqueOrThrowArgs>;

export const MediaLegacyManifestFindUniqueOrThrowZodSchema = z.object({ select: MediaLegacyManifestSelectObjectSchema.optional(),  where: MediaLegacyManifestWhereUniqueInputObjectSchema }).strict();