import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaLegacyManifestSelectObjectSchema as MediaLegacyManifestSelectObjectSchema } from './objects/MediaLegacyManifestSelect.schema';
import { MediaLegacyManifestCreateManyInputObjectSchema as MediaLegacyManifestCreateManyInputObjectSchema } from './objects/MediaLegacyManifestCreateManyInput.schema';

export const MediaLegacyManifestCreateManyAndReturnSchema: z.ZodType<Prisma.MediaLegacyManifestCreateManyAndReturnArgs> = z.object({ select: MediaLegacyManifestSelectObjectSchema.optional(), data: z.union([ MediaLegacyManifestCreateManyInputObjectSchema, z.array(MediaLegacyManifestCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.MediaLegacyManifestCreateManyAndReturnArgs>;

export const MediaLegacyManifestCreateManyAndReturnZodSchema = z.object({ select: MediaLegacyManifestSelectObjectSchema.optional(), data: z.union([ MediaLegacyManifestCreateManyInputObjectSchema, z.array(MediaLegacyManifestCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();