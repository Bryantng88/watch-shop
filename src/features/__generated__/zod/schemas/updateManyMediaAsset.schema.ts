import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaAssetUpdateManyMutationInputObjectSchema as MediaAssetUpdateManyMutationInputObjectSchema } from './objects/MediaAssetUpdateManyMutationInput.schema';
import { MediaAssetWhereInputObjectSchema as MediaAssetWhereInputObjectSchema } from './objects/MediaAssetWhereInput.schema';

export const MediaAssetUpdateManySchema: z.ZodType<Prisma.MediaAssetUpdateManyArgs> = z.object({ data: MediaAssetUpdateManyMutationInputObjectSchema, where: MediaAssetWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.MediaAssetUpdateManyArgs>;

export const MediaAssetUpdateManyZodSchema = z.object({ data: MediaAssetUpdateManyMutationInputObjectSchema, where: MediaAssetWhereInputObjectSchema.optional() }).strict();