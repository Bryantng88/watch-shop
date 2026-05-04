import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaAssetCreateManyInputObjectSchema as MediaAssetCreateManyInputObjectSchema } from './objects/MediaAssetCreateManyInput.schema';

export const MediaAssetCreateManySchema: z.ZodType<Prisma.MediaAssetCreateManyArgs> = z.object({ data: z.union([ MediaAssetCreateManyInputObjectSchema, z.array(MediaAssetCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.MediaAssetCreateManyArgs>;

export const MediaAssetCreateManyZodSchema = z.object({ data: z.union([ MediaAssetCreateManyInputObjectSchema, z.array(MediaAssetCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();