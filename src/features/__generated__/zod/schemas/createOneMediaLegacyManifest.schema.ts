import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaLegacyManifestSelectObjectSchema as MediaLegacyManifestSelectObjectSchema } from './objects/MediaLegacyManifestSelect.schema';
import { MediaLegacyManifestCreateInputObjectSchema as MediaLegacyManifestCreateInputObjectSchema } from './objects/MediaLegacyManifestCreateInput.schema';
import { MediaLegacyManifestUncheckedCreateInputObjectSchema as MediaLegacyManifestUncheckedCreateInputObjectSchema } from './objects/MediaLegacyManifestUncheckedCreateInput.schema';

export const MediaLegacyManifestCreateOneSchema: z.ZodType<Prisma.MediaLegacyManifestCreateArgs> = z.object({ select: MediaLegacyManifestSelectObjectSchema.optional(),  data: z.union([MediaLegacyManifestCreateInputObjectSchema, MediaLegacyManifestUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.MediaLegacyManifestCreateArgs>;

export const MediaLegacyManifestCreateOneZodSchema = z.object({ select: MediaLegacyManifestSelectObjectSchema.optional(),  data: z.union([MediaLegacyManifestCreateInputObjectSchema, MediaLegacyManifestUncheckedCreateInputObjectSchema]) }).strict();