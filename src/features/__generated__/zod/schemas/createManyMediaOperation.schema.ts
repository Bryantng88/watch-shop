import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaOperationCreateManyInputObjectSchema as MediaOperationCreateManyInputObjectSchema } from './objects/MediaOperationCreateManyInput.schema';

export const MediaOperationCreateManySchema: z.ZodType<Prisma.MediaOperationCreateManyArgs> = z.object({ data: z.union([ MediaOperationCreateManyInputObjectSchema, z.array(MediaOperationCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.MediaOperationCreateManyArgs>;

export const MediaOperationCreateManyZodSchema = z.object({ data: z.union([ MediaOperationCreateManyInputObjectSchema, z.array(MediaOperationCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();