import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaObjectSelectObjectSchema as MediaObjectSelectObjectSchema } from './objects/MediaObjectSelect.schema';
import { MediaObjectIncludeObjectSchema as MediaObjectIncludeObjectSchema } from './objects/MediaObjectInclude.schema';
import { MediaObjectWhereUniqueInputObjectSchema as MediaObjectWhereUniqueInputObjectSchema } from './objects/MediaObjectWhereUniqueInput.schema';

export const MediaObjectFindUniqueOrThrowSchema: z.ZodType<Prisma.MediaObjectFindUniqueOrThrowArgs> = z.object({ select: MediaObjectSelectObjectSchema.optional(), include: MediaObjectIncludeObjectSchema.optional(), where: MediaObjectWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.MediaObjectFindUniqueOrThrowArgs>;

export const MediaObjectFindUniqueOrThrowZodSchema = z.object({ select: MediaObjectSelectObjectSchema.optional(), include: MediaObjectIncludeObjectSchema.optional(), where: MediaObjectWhereUniqueInputObjectSchema }).strict();