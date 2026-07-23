import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaLegacyManifestUpdateManyMutationInputObjectSchema as MediaLegacyManifestUpdateManyMutationInputObjectSchema } from './objects/MediaLegacyManifestUpdateManyMutationInput.schema';
import { MediaLegacyManifestWhereInputObjectSchema as MediaLegacyManifestWhereInputObjectSchema } from './objects/MediaLegacyManifestWhereInput.schema';

export const MediaLegacyManifestUpdateManySchema: z.ZodType<Prisma.MediaLegacyManifestUpdateManyArgs> = z.object({ data: MediaLegacyManifestUpdateManyMutationInputObjectSchema, where: MediaLegacyManifestWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.MediaLegacyManifestUpdateManyArgs>;

export const MediaLegacyManifestUpdateManyZodSchema = z.object({ data: MediaLegacyManifestUpdateManyMutationInputObjectSchema, where: MediaLegacyManifestWhereInputObjectSchema.optional() }).strict();