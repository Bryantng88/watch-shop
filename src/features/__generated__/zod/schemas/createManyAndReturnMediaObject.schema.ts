import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaObjectSelectObjectSchema as MediaObjectSelectObjectSchema } from './objects/MediaObjectSelect.schema';
import { MediaObjectCreateManyInputObjectSchema as MediaObjectCreateManyInputObjectSchema } from './objects/MediaObjectCreateManyInput.schema';

export const MediaObjectCreateManyAndReturnSchema: z.ZodType<Prisma.MediaObjectCreateManyAndReturnArgs> = z.object({ select: MediaObjectSelectObjectSchema.optional(), data: z.union([ MediaObjectCreateManyInputObjectSchema, z.array(MediaObjectCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.MediaObjectCreateManyAndReturnArgs>;

export const MediaObjectCreateManyAndReturnZodSchema = z.object({ select: MediaObjectSelectObjectSchema.optional(), data: z.union([ MediaObjectCreateManyInputObjectSchema, z.array(MediaObjectCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();