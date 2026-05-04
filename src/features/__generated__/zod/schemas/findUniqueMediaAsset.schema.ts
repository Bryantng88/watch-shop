import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaAssetSelectObjectSchema as MediaAssetSelectObjectSchema } from './objects/MediaAssetSelect.schema';
import { MediaAssetWhereUniqueInputObjectSchema as MediaAssetWhereUniqueInputObjectSchema } from './objects/MediaAssetWhereUniqueInput.schema';

export const MediaAssetFindUniqueSchema: z.ZodType<Prisma.MediaAssetFindUniqueArgs> = z.object({ select: MediaAssetSelectObjectSchema.optional(),  where: MediaAssetWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.MediaAssetFindUniqueArgs>;

export const MediaAssetFindUniqueZodSchema = z.object({ select: MediaAssetSelectObjectSchema.optional(),  where: MediaAssetWhereUniqueInputObjectSchema }).strict();