import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaAssetSelectObjectSchema as MediaAssetSelectObjectSchema } from './objects/MediaAssetSelect.schema';
import { MediaAssetCreateInputObjectSchema as MediaAssetCreateInputObjectSchema } from './objects/MediaAssetCreateInput.schema';
import { MediaAssetUncheckedCreateInputObjectSchema as MediaAssetUncheckedCreateInputObjectSchema } from './objects/MediaAssetUncheckedCreateInput.schema';

export const MediaAssetCreateOneSchema: z.ZodType<Prisma.MediaAssetCreateArgs> = z.object({ select: MediaAssetSelectObjectSchema.optional(),  data: z.union([MediaAssetCreateInputObjectSchema, MediaAssetUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.MediaAssetCreateArgs>;

export const MediaAssetCreateOneZodSchema = z.object({ select: MediaAssetSelectObjectSchema.optional(),  data: z.union([MediaAssetCreateInputObjectSchema, MediaAssetUncheckedCreateInputObjectSchema]) }).strict();