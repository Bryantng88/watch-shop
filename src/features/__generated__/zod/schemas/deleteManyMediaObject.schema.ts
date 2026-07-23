import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaObjectWhereInputObjectSchema as MediaObjectWhereInputObjectSchema } from './objects/MediaObjectWhereInput.schema';

export const MediaObjectDeleteManySchema: z.ZodType<Prisma.MediaObjectDeleteManyArgs> = z.object({ where: MediaObjectWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.MediaObjectDeleteManyArgs>;

export const MediaObjectDeleteManyZodSchema = z.object({ where: MediaObjectWhereInputObjectSchema.optional() }).strict();