import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaAssetSelectObjectSchema as MediaAssetSelectObjectSchema } from './objects/MediaAssetSelect.schema';
import { MediaAssetWhereUniqueInputObjectSchema as MediaAssetWhereUniqueInputObjectSchema } from './objects/MediaAssetWhereUniqueInput.schema';

export const MediaAssetDeleteOneSchema: z.ZodType<Prisma.MediaAssetDeleteArgs> = z.object({ select: MediaAssetSelectObjectSchema.optional(),  where: MediaAssetWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.MediaAssetDeleteArgs>;

export const MediaAssetDeleteOneZodSchema = z.object({ select: MediaAssetSelectObjectSchema.optional(),  where: MediaAssetWhereUniqueInputObjectSchema }).strict();