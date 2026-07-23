import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaObjectSelectObjectSchema as MediaObjectSelectObjectSchema } from './objects/MediaObjectSelect.schema';
import { MediaObjectIncludeObjectSchema as MediaObjectIncludeObjectSchema } from './objects/MediaObjectInclude.schema';
import { MediaObjectWhereUniqueInputObjectSchema as MediaObjectWhereUniqueInputObjectSchema } from './objects/MediaObjectWhereUniqueInput.schema';

export const MediaObjectFindUniqueSchema: z.ZodType<Prisma.MediaObjectFindUniqueArgs> = z.object({ select: MediaObjectSelectObjectSchema.optional(), include: MediaObjectIncludeObjectSchema.optional(), where: MediaObjectWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.MediaObjectFindUniqueArgs>;

export const MediaObjectFindUniqueZodSchema = z.object({ select: MediaObjectSelectObjectSchema.optional(), include: MediaObjectIncludeObjectSchema.optional(), where: MediaObjectWhereUniqueInputObjectSchema }).strict();