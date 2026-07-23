import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaLegacyManifestSelectObjectSchema as MediaLegacyManifestSelectObjectSchema } from './objects/MediaLegacyManifestSelect.schema';
import { MediaLegacyManifestWhereUniqueInputObjectSchema as MediaLegacyManifestWhereUniqueInputObjectSchema } from './objects/MediaLegacyManifestWhereUniqueInput.schema';

export const MediaLegacyManifestDeleteOneSchema: z.ZodType<Prisma.MediaLegacyManifestDeleteArgs> = z.object({ select: MediaLegacyManifestSelectObjectSchema.optional(),  where: MediaLegacyManifestWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.MediaLegacyManifestDeleteArgs>;

export const MediaLegacyManifestDeleteOneZodSchema = z.object({ select: MediaLegacyManifestSelectObjectSchema.optional(),  where: MediaLegacyManifestWhereUniqueInputObjectSchema }).strict();