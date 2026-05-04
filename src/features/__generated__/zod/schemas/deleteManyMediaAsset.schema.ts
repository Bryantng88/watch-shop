import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaAssetWhereInputObjectSchema as MediaAssetWhereInputObjectSchema } from './objects/MediaAssetWhereInput.schema';

export const MediaAssetDeleteManySchema: z.ZodType<Prisma.MediaAssetDeleteManyArgs> = z.object({ where: MediaAssetWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.MediaAssetDeleteManyArgs>;

export const MediaAssetDeleteManyZodSchema = z.object({ where: MediaAssetWhereInputObjectSchema.optional() }).strict();