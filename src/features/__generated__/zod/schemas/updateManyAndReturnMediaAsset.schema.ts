import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaAssetSelectObjectSchema as MediaAssetSelectObjectSchema } from './objects/MediaAssetSelect.schema';
import { MediaAssetUpdateManyMutationInputObjectSchema as MediaAssetUpdateManyMutationInputObjectSchema } from './objects/MediaAssetUpdateManyMutationInput.schema';
import { MediaAssetWhereInputObjectSchema as MediaAssetWhereInputObjectSchema } from './objects/MediaAssetWhereInput.schema';

export const MediaAssetUpdateManyAndReturnSchema: z.ZodType<Prisma.MediaAssetUpdateManyAndReturnArgs> = z.object({ select: MediaAssetSelectObjectSchema.optional(), data: MediaAssetUpdateManyMutationInputObjectSchema, where: MediaAssetWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.MediaAssetUpdateManyAndReturnArgs>;

export const MediaAssetUpdateManyAndReturnZodSchema = z.object({ select: MediaAssetSelectObjectSchema.optional(), data: MediaAssetUpdateManyMutationInputObjectSchema, where: MediaAssetWhereInputObjectSchema.optional() }).strict();