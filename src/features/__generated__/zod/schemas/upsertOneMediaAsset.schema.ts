import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaAssetSelectObjectSchema as MediaAssetSelectObjectSchema } from './objects/MediaAssetSelect.schema';
import { MediaAssetWhereUniqueInputObjectSchema as MediaAssetWhereUniqueInputObjectSchema } from './objects/MediaAssetWhereUniqueInput.schema';
import { MediaAssetCreateInputObjectSchema as MediaAssetCreateInputObjectSchema } from './objects/MediaAssetCreateInput.schema';
import { MediaAssetUncheckedCreateInputObjectSchema as MediaAssetUncheckedCreateInputObjectSchema } from './objects/MediaAssetUncheckedCreateInput.schema';
import { MediaAssetUpdateInputObjectSchema as MediaAssetUpdateInputObjectSchema } from './objects/MediaAssetUpdateInput.schema';
import { MediaAssetUncheckedUpdateInputObjectSchema as MediaAssetUncheckedUpdateInputObjectSchema } from './objects/MediaAssetUncheckedUpdateInput.schema';

export const MediaAssetUpsertOneSchema: z.ZodType<Prisma.MediaAssetUpsertArgs> = z.object({ select: MediaAssetSelectObjectSchema.optional(),  where: MediaAssetWhereUniqueInputObjectSchema, create: z.union([ MediaAssetCreateInputObjectSchema, MediaAssetUncheckedCreateInputObjectSchema ]), update: z.union([ MediaAssetUpdateInputObjectSchema, MediaAssetUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.MediaAssetUpsertArgs>;

export const MediaAssetUpsertOneZodSchema = z.object({ select: MediaAssetSelectObjectSchema.optional(),  where: MediaAssetWhereUniqueInputObjectSchema, create: z.union([ MediaAssetCreateInputObjectSchema, MediaAssetUncheckedCreateInputObjectSchema ]), update: z.union([ MediaAssetUpdateInputObjectSchema, MediaAssetUncheckedUpdateInputObjectSchema ]) }).strict();