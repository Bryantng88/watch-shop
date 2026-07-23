import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaObjectSelectObjectSchema as MediaObjectSelectObjectSchema } from './objects/MediaObjectSelect.schema';
import { MediaObjectUpdateManyMutationInputObjectSchema as MediaObjectUpdateManyMutationInputObjectSchema } from './objects/MediaObjectUpdateManyMutationInput.schema';
import { MediaObjectWhereInputObjectSchema as MediaObjectWhereInputObjectSchema } from './objects/MediaObjectWhereInput.schema';

export const MediaObjectUpdateManyAndReturnSchema: z.ZodType<Prisma.MediaObjectUpdateManyAndReturnArgs> = z.object({ select: MediaObjectSelectObjectSchema.optional(), data: MediaObjectUpdateManyMutationInputObjectSchema, where: MediaObjectWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.MediaObjectUpdateManyAndReturnArgs>;

export const MediaObjectUpdateManyAndReturnZodSchema = z.object({ select: MediaObjectSelectObjectSchema.optional(), data: MediaObjectUpdateManyMutationInputObjectSchema, where: MediaObjectWhereInputObjectSchema.optional() }).strict();