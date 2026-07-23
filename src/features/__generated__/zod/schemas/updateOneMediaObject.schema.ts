import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaObjectSelectObjectSchema as MediaObjectSelectObjectSchema } from './objects/MediaObjectSelect.schema';
import { MediaObjectIncludeObjectSchema as MediaObjectIncludeObjectSchema } from './objects/MediaObjectInclude.schema';
import { MediaObjectUpdateInputObjectSchema as MediaObjectUpdateInputObjectSchema } from './objects/MediaObjectUpdateInput.schema';
import { MediaObjectUncheckedUpdateInputObjectSchema as MediaObjectUncheckedUpdateInputObjectSchema } from './objects/MediaObjectUncheckedUpdateInput.schema';
import { MediaObjectWhereUniqueInputObjectSchema as MediaObjectWhereUniqueInputObjectSchema } from './objects/MediaObjectWhereUniqueInput.schema';

export const MediaObjectUpdateOneSchema: z.ZodType<Prisma.MediaObjectUpdateArgs> = z.object({ select: MediaObjectSelectObjectSchema.optional(), include: MediaObjectIncludeObjectSchema.optional(), data: z.union([MediaObjectUpdateInputObjectSchema, MediaObjectUncheckedUpdateInputObjectSchema]), where: MediaObjectWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.MediaObjectUpdateArgs>;

export const MediaObjectUpdateOneZodSchema = z.object({ select: MediaObjectSelectObjectSchema.optional(), include: MediaObjectIncludeObjectSchema.optional(), data: z.union([MediaObjectUpdateInputObjectSchema, MediaObjectUncheckedUpdateInputObjectSchema]), where: MediaObjectWhereUniqueInputObjectSchema }).strict();