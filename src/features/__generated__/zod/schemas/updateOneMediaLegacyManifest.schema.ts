import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaLegacyManifestSelectObjectSchema as MediaLegacyManifestSelectObjectSchema } from './objects/MediaLegacyManifestSelect.schema';
import { MediaLegacyManifestUpdateInputObjectSchema as MediaLegacyManifestUpdateInputObjectSchema } from './objects/MediaLegacyManifestUpdateInput.schema';
import { MediaLegacyManifestUncheckedUpdateInputObjectSchema as MediaLegacyManifestUncheckedUpdateInputObjectSchema } from './objects/MediaLegacyManifestUncheckedUpdateInput.schema';
import { MediaLegacyManifestWhereUniqueInputObjectSchema as MediaLegacyManifestWhereUniqueInputObjectSchema } from './objects/MediaLegacyManifestWhereUniqueInput.schema';

export const MediaLegacyManifestUpdateOneSchema: z.ZodType<Prisma.MediaLegacyManifestUpdateArgs> = z.object({ select: MediaLegacyManifestSelectObjectSchema.optional(),  data: z.union([MediaLegacyManifestUpdateInputObjectSchema, MediaLegacyManifestUncheckedUpdateInputObjectSchema]), where: MediaLegacyManifestWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.MediaLegacyManifestUpdateArgs>;

export const MediaLegacyManifestUpdateOneZodSchema = z.object({ select: MediaLegacyManifestSelectObjectSchema.optional(),  data: z.union([MediaLegacyManifestUpdateInputObjectSchema, MediaLegacyManifestUncheckedUpdateInputObjectSchema]), where: MediaLegacyManifestWhereUniqueInputObjectSchema }).strict();