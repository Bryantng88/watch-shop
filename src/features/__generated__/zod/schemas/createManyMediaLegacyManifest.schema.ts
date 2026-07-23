import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaLegacyManifestCreateManyInputObjectSchema as MediaLegacyManifestCreateManyInputObjectSchema } from './objects/MediaLegacyManifestCreateManyInput.schema';

export const MediaLegacyManifestCreateManySchema: z.ZodType<Prisma.MediaLegacyManifestCreateManyArgs> = z.object({ data: z.union([ MediaLegacyManifestCreateManyInputObjectSchema, z.array(MediaLegacyManifestCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.MediaLegacyManifestCreateManyArgs>;

export const MediaLegacyManifestCreateManyZodSchema = z.object({ data: z.union([ MediaLegacyManifestCreateManyInputObjectSchema, z.array(MediaLegacyManifestCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();