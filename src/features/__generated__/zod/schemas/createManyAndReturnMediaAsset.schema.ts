import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaAssetSelectObjectSchema as MediaAssetSelectObjectSchema } from './objects/MediaAssetSelect.schema';
import { MediaAssetCreateManyInputObjectSchema as MediaAssetCreateManyInputObjectSchema } from './objects/MediaAssetCreateManyInput.schema';

export const MediaAssetCreateManyAndReturnSchema: z.ZodType<Prisma.MediaAssetCreateManyAndReturnArgs> = z.object({ select: MediaAssetSelectObjectSchema.optional(), data: z.union([ MediaAssetCreateManyInputObjectSchema, z.array(MediaAssetCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.MediaAssetCreateManyAndReturnArgs>;

export const MediaAssetCreateManyAndReturnZodSchema = z.object({ select: MediaAssetSelectObjectSchema.optional(), data: z.union([ MediaAssetCreateManyInputObjectSchema, z.array(MediaAssetCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();