import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaLegacyManifestSelectObjectSchema as MediaLegacyManifestSelectObjectSchema } from './objects/MediaLegacyManifestSelect.schema';
import { MediaLegacyManifestWhereUniqueInputObjectSchema as MediaLegacyManifestWhereUniqueInputObjectSchema } from './objects/MediaLegacyManifestWhereUniqueInput.schema';
import { MediaLegacyManifestCreateInputObjectSchema as MediaLegacyManifestCreateInputObjectSchema } from './objects/MediaLegacyManifestCreateInput.schema';
import { MediaLegacyManifestUncheckedCreateInputObjectSchema as MediaLegacyManifestUncheckedCreateInputObjectSchema } from './objects/MediaLegacyManifestUncheckedCreateInput.schema';
import { MediaLegacyManifestUpdateInputObjectSchema as MediaLegacyManifestUpdateInputObjectSchema } from './objects/MediaLegacyManifestUpdateInput.schema';
import { MediaLegacyManifestUncheckedUpdateInputObjectSchema as MediaLegacyManifestUncheckedUpdateInputObjectSchema } from './objects/MediaLegacyManifestUncheckedUpdateInput.schema';

export const MediaLegacyManifestUpsertOneSchema: z.ZodType<Prisma.MediaLegacyManifestUpsertArgs> = z.object({ select: MediaLegacyManifestSelectObjectSchema.optional(),  where: MediaLegacyManifestWhereUniqueInputObjectSchema, create: z.union([ MediaLegacyManifestCreateInputObjectSchema, MediaLegacyManifestUncheckedCreateInputObjectSchema ]), update: z.union([ MediaLegacyManifestUpdateInputObjectSchema, MediaLegacyManifestUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.MediaLegacyManifestUpsertArgs>;

export const MediaLegacyManifestUpsertOneZodSchema = z.object({ select: MediaLegacyManifestSelectObjectSchema.optional(),  where: MediaLegacyManifestWhereUniqueInputObjectSchema, create: z.union([ MediaLegacyManifestCreateInputObjectSchema, MediaLegacyManifestUncheckedCreateInputObjectSchema ]), update: z.union([ MediaLegacyManifestUpdateInputObjectSchema, MediaLegacyManifestUncheckedUpdateInputObjectSchema ]) }).strict();