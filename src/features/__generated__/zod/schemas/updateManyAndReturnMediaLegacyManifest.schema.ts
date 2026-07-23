import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaLegacyManifestSelectObjectSchema as MediaLegacyManifestSelectObjectSchema } from './objects/MediaLegacyManifestSelect.schema';
import { MediaLegacyManifestUpdateManyMutationInputObjectSchema as MediaLegacyManifestUpdateManyMutationInputObjectSchema } from './objects/MediaLegacyManifestUpdateManyMutationInput.schema';
import { MediaLegacyManifestWhereInputObjectSchema as MediaLegacyManifestWhereInputObjectSchema } from './objects/MediaLegacyManifestWhereInput.schema';

export const MediaLegacyManifestUpdateManyAndReturnSchema: z.ZodType<Prisma.MediaLegacyManifestUpdateManyAndReturnArgs> = z.object({ select: MediaLegacyManifestSelectObjectSchema.optional(), data: MediaLegacyManifestUpdateManyMutationInputObjectSchema, where: MediaLegacyManifestWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.MediaLegacyManifestUpdateManyAndReturnArgs>;

export const MediaLegacyManifestUpdateManyAndReturnZodSchema = z.object({ select: MediaLegacyManifestSelectObjectSchema.optional(), data: MediaLegacyManifestUpdateManyMutationInputObjectSchema, where: MediaLegacyManifestWhereInputObjectSchema.optional() }).strict();