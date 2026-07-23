import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaObjectUpdateManyMutationInputObjectSchema as MediaObjectUpdateManyMutationInputObjectSchema } from './objects/MediaObjectUpdateManyMutationInput.schema';
import { MediaObjectWhereInputObjectSchema as MediaObjectWhereInputObjectSchema } from './objects/MediaObjectWhereInput.schema';

export const MediaObjectUpdateManySchema: z.ZodType<Prisma.MediaObjectUpdateManyArgs> = z.object({ data: MediaObjectUpdateManyMutationInputObjectSchema, where: MediaObjectWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.MediaObjectUpdateManyArgs>;

export const MediaObjectUpdateManyZodSchema = z.object({ data: MediaObjectUpdateManyMutationInputObjectSchema, where: MediaObjectWhereInputObjectSchema.optional() }).strict();