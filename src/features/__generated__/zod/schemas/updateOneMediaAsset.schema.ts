import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaAssetSelectObjectSchema as MediaAssetSelectObjectSchema } from './objects/MediaAssetSelect.schema';
import { MediaAssetUpdateInputObjectSchema as MediaAssetUpdateInputObjectSchema } from './objects/MediaAssetUpdateInput.schema';
import { MediaAssetUncheckedUpdateInputObjectSchema as MediaAssetUncheckedUpdateInputObjectSchema } from './objects/MediaAssetUncheckedUpdateInput.schema';
import { MediaAssetWhereUniqueInputObjectSchema as MediaAssetWhereUniqueInputObjectSchema } from './objects/MediaAssetWhereUniqueInput.schema';

export const MediaAssetUpdateOneSchema: z.ZodType<Prisma.MediaAssetUpdateArgs> = z.object({ select: MediaAssetSelectObjectSchema.optional(),  data: z.union([MediaAssetUpdateInputObjectSchema, MediaAssetUncheckedUpdateInputObjectSchema]), where: MediaAssetWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.MediaAssetUpdateArgs>;

export const MediaAssetUpdateOneZodSchema = z.object({ select: MediaAssetSelectObjectSchema.optional(),  data: z.union([MediaAssetUpdateInputObjectSchema, MediaAssetUncheckedUpdateInputObjectSchema]), where: MediaAssetWhereUniqueInputObjectSchema }).strict();