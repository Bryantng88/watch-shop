import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaObjectCreateManyInputObjectSchema as MediaObjectCreateManyInputObjectSchema } from './objects/MediaObjectCreateManyInput.schema';

export const MediaObjectCreateManySchema: z.ZodType<Prisma.MediaObjectCreateManyArgs> = z.object({ data: z.union([ MediaObjectCreateManyInputObjectSchema, z.array(MediaObjectCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.MediaObjectCreateManyArgs>;

export const MediaObjectCreateManyZodSchema = z.object({ data: z.union([ MediaObjectCreateManyInputObjectSchema, z.array(MediaObjectCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();