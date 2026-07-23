import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaLegacyManifestWhereInputObjectSchema as MediaLegacyManifestWhereInputObjectSchema } from './objects/MediaLegacyManifestWhereInput.schema';

export const MediaLegacyManifestDeleteManySchema: z.ZodType<Prisma.MediaLegacyManifestDeleteManyArgs> = z.object({ where: MediaLegacyManifestWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.MediaLegacyManifestDeleteManyArgs>;

export const MediaLegacyManifestDeleteManyZodSchema = z.object({ where: MediaLegacyManifestWhereInputObjectSchema.optional() }).strict();